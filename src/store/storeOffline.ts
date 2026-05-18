import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";
import type { DeckStore } from "./types/DeckStore";

const TABLE = "saved_decks";
const LOCAL_KEY = "decks_offline";

type Entry = { saved: boolean; updatedAt: number; synced: boolean };
type LocalState = Record<number, Entry>;

const readLocal = (): LocalState => {
	try {
		return JSON.parse(localStorage.getItem(LOCAL_KEY) || "{}") as LocalState;
	} catch {
		return {};
	}
};

const writeLocal = (state: LocalState) => {
	localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
};

const savedIds = (state: LocalState): number[] =>
	Object.entries(state)
		.filter(([, v]) => v.saved)
		.map(([k]) => Number(k));

const countPending = (state: LocalState): number =>
	Object.values(state).filter((e) => !e.synced).length;

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

let syncInFlight: Promise<void> | null = null;

const sync = (): Promise<void> => {
	if (syncInFlight) return syncInFlight;
	syncInFlight = runSync().finally(() => {
		syncInFlight = null;
	});
	return syncInFlight;
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

const StoreOffline: DeckStore = {
	list: async () => {
		await sync().catch(() => {});
		return savedIds(readLocal());
	},

	add: async (deckId) => {
		const state = readLocal();
		state[deckId] = { saved: true, updatedAt: Date.now(), synced: false };
		writeLocal(state);
		setStatus({ pending: countPending(state) });
		sync().catch(() => {});
	},

	remove: async (deckId) => {
		const state = readLocal();
		state[deckId] = { saved: false, updatedAt: Date.now(), synced: false };
		writeLocal(state);
		setStatus({ pending: countPending(state) });
		sync().catch(() => {});
	},
};

export default StoreOffline;
