import { useCallback, useEffect, useState } from "react";
import Store from "./store";
import useAuth from "./useAuth";

const EMPTY_SET = new Set<number>();

export const useSavedDecks = () => {
	const { session } = useAuth();
	// null = not yet fetched (loading); Set = fetched (possibly empty)
	const [savedIds, setSavedIds] = useState<Set<number> | null>(null);

	useEffect(() => {
		if (!session) return;
		Store.list().then((ids) => setSavedIds(new Set(ids)));
	}, [session]);

	const isSaved = useCallback(
		(deckId: number) => (savedIds ?? EMPTY_SET).has(deckId),
		[savedIds],
	);

	const toggle = useCallback(
		async (deckId: number) => {
			const willSave = !(savedIds ?? EMPTY_SET).has(deckId);

			setSavedIds((prev) => {
				const next = new Set(prev ?? EMPTY_SET);
				if (willSave) next.add(deckId);
				else next.delete(deckId);
				return next;
			});

			try {
				if (willSave) await Store.add(deckId);
				else await Store.remove(deckId);
			} catch (err) {
				setSavedIds((prev) => {
					const next = new Set(prev ?? EMPTY_SET);
					if (willSave) next.delete(deckId);
					else next.add(deckId);
					return next;
				});
				throw err;
			}
		},
		[savedIds],
	);

	return { isSaved, toggle, loading: savedIds === null };
};
