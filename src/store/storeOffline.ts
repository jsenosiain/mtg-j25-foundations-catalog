import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";
import type { Store } from "@/types";

const TABLE = "saved_decks";
const LOCAL_KEY_PREFIX = "decks_offline:";
const GUEST_BUCKET = `${LOCAL_KEY_PREFIX}guest`;

type Entry = { saved: boolean; updatedAt: number; synced: boolean };
type LocalState = Record<number, Entry>;

export type ActiveUser =
	| { kind: "none" }
	| { kind: "guest" }
	| { kind: "user"; id: string };

let activeUser: ActiveUser = { kind: "none" };

const bucketKey = (): string | null => {
	if (activeUser.kind === "guest") return GUEST_BUCKET;
	if (activeUser.kind === "user") return `${LOCAL_KEY_PREFIX}${activeUser.id}`;
	return null;
};

const readBucket = (key: string): LocalState => {
	try {
		return JSON.parse(localStorage.getItem(key) || "{}") as LocalState;
	} catch {
		return {};
	}
};

const writeBucket = (key: string, state: LocalState) => {
	localStorage.setItem(key, JSON.stringify(state));
};

const readLocal = (): LocalState => {
	const key = bucketKey();
	return key ? readBucket(key) : {};
};

const writeLocal = (state: LocalState) => {
	const key = bucketKey();
	if (!key) return;
	writeBucket(key, state);
};

const savedIds = (state: LocalState): number[] =>
	Object.entries(state)
		.filter(([, v]) => v.saved)
		.map(([k]) => Number(k));

const buildSavedSet = (state: LocalState): ReadonlySet<number> =>
	new Set(savedIds(state));

const countPending = (state: LocalState): number =>
	Object.values(state).filter((e) => !e.synced).length;

let savedSnapshot: ReadonlySet<number> = new Set();
const savedListeners = new Set<() => void>();

const notifySaved = () => {
	savedSnapshot = buildSavedSet(readLocal());
	for (const fn of savedListeners) fn();
};

const subscribeSaved = (fn: () => void) => {
	savedListeners.add(fn);
	return () => {
		savedListeners.delete(fn);
	};
};

const getSavedSnapshot = () => savedSnapshot;

export const useSavedIds = (): ReadonlySet<number> =>
	useSyncExternalStore(subscribeSaved, getSavedSnapshot, getSavedSnapshot);

export type SyncStatus = {
	state: "idle" | "syncing" | "synced" | "error";
	pending: number;
	lastSyncedAt: number | null;
	lastError: string | null;
};

let status: SyncStatus = {
	state: "idle",
	pending: 0,
	lastSyncedAt: null,
	lastError: null,
};

const listeners = new Set<() => void>();

const setStatus = (next: Partial<SyncStatus>) => {
	status = { ...status, ...next };
	for (const fn of listeners) fn();
};

const subscribe = (fn: () => void) => {
	listeners.add(fn);
	return () => {
		listeners.delete(fn);
	};
};

const getSnapshot = () => status;

export const useSyncStatus = (): SyncStatus =>
	useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const setActiveUser = (next: ActiveUser) => {
	activeUser = next;
	notifySaved();
	setStatus({
		state: "idle",
		pending: countPending(readLocal()),
		lastError: null,
	});
	if (next.kind === "user") {
		sync().catch(() => {});
	}
};

let syncInFlight: Promise<void> | null = null;

const sync = (): Promise<void> => {
	if (activeUser.kind !== "user") {
		setStatus({ state: "idle", pending: countPending(readLocal()), lastError: null });
		return Promise.resolve();
	}
	if (syncInFlight) return syncInFlight;
	syncInFlight = runSync().finally(() => {
		syncInFlight = null;
	});
	return syncInFlight;
};

export const migrateGuestToUser = async (userId: string): Promise<void> => {
	const userBucket = `${LOCAL_KEY_PREFIX}${userId}`;
	const guestState = readBucket(GUEST_BUCKET);
	const userState = readBucket(userBucket);

	const merged: LocalState = { ...userState };
	for (const [idStr, entry] of Object.entries(guestState)) {
		merged[Number(idStr)] = { ...entry, synced: false };
	}

	writeBucket(userBucket, merged);
	try {
		localStorage.removeItem(GUEST_BUCKET);
	} catch {
		/* ignore */
	}

	if (activeUser.kind === "user" && activeUser.id === userId) {
		notifySaved();
		setStatus({ pending: countPending(merged) });
		await sync().catch(() => {});
	}
};

// LWW reconciliation: unsynced local ops are pushed; synced local trusts server.
// Without server-side tombstones, a deck deleted on another device will overwrite
// a stale local `{ saved: true, synced: true }` on the next sync.
const runSync = async (): Promise<void> => {
	setStatus({ state: "syncing" });

	const userResult = await supabase.auth.getUser().catch(() => null);
	const userId = userResult?.data.user?.id;
	if (!userId) {
		setStatus({ state: "idle", pending: countPending(readLocal()) });
		return;
	}

	const serverResult = await supabase.from(TABLE).select("deck_id, created_at");
	if (serverResult.error) {
		setStatus({
			state: "error",
			pending: countPending(readLocal()),
			lastError: serverResult.error.message,
		});
		return;
	}

	const serverMap = new Map<number, number>();
	for (const row of serverResult.data) {
		serverMap.set(row.deck_id as number, Date.parse(row.created_at as string));
	}

	const local = readLocal();
	const next: LocalState = { ...local };
	let pushError: string | null = null;

	for (const [deckIdStr, entry] of Object.entries(local)) {
		const deckId = Number(deckIdStr);
		const serverHas = serverMap.has(deckId);

		if (!entry.synced) {
			if (entry.saved && !serverHas) {
				const { error } = await supabase
					.from(TABLE)
					.insert({ user_id: userId, deck_id: deckId });
				if (!error) next[deckId] = { ...entry, synced: true };
				else pushError = error.message;
			} else if (!entry.saved && serverHas) {
				const { error } = await supabase.from(TABLE).delete().eq("deck_id", deckId);
				if (!error) next[deckId] = { ...entry, synced: true };
				else pushError = error.message;
			} else {
				next[deckId] = { ...entry, synced: true };
			}
		} else if (serverHas) {
			next[deckId] = { saved: true, updatedAt: serverMap.get(deckId)!, synced: true };
		} else {
			next[deckId] = { saved: false, updatedAt: Date.now(), synced: true };
		}
	}

	for (const [deckId, ts] of serverMap.entries()) {
		if (!(deckId in next)) {
			next[deckId] = { saved: true, updatedAt: ts, synced: true };
		}
	}

	writeLocal(next);
	notifySaved();

	const pending = countPending(next);
	if (pushError) {
		setStatus({ state: "error", pending, lastError: pushError });
	} else {
		setStatus({ state: "synced", pending, lastSyncedAt: Date.now(), lastError: null });
	}
};

if (typeof window !== "undefined") {
	window.addEventListener("online", () => {
		sync().catch(() => {});
	});
}

const StoreOffline: Store = {
	list: async () => {
		await sync().catch(() => {});
		return savedIds(readLocal());
	},

	add: async (id) => {
		if (activeUser.kind === "none") return;
		const state = readLocal();
		state[id] = { saved: true, updatedAt: Date.now(), synced: activeUser.kind === "guest" };
		writeLocal(state);
		notifySaved();
		setStatus({ pending: countPending(state) });
		sync().catch(() => {});
	},

	remove: async (id) => {
		if (activeUser.kind === "none") return;
		const state = readLocal();
		state[id] = { saved: false, updatedAt: Date.now(), synced: activeUser.kind === "guest" };
		writeLocal(state);
		notifySaved();
		setStatus({ pending: countPending(state) });
		sync().catch(() => {});
	},
};

export default StoreOffline;
