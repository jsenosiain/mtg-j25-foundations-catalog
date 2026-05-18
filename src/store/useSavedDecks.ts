import { useCallback, useEffect, useState } from "react";
import Store from "./store";
import { useAuth } from "./auth";

export const useSavedDecks = () => {
	const { session } = useAuth();
	const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!session) {
			setSavedIds(new Set());
			setLoading(false);
			return;
		}
		setLoading(true);
		Store.list()
			.then((ids) => setSavedIds(new Set(ids)))
			.finally(() => setLoading(false));
	}, [session]);

	const isSaved = useCallback((deckId: number) => savedIds.has(deckId), [savedIds]);

	const toggle = useCallback(
		async (deckId: number) => {
			const willSave = !savedIds.has(deckId);

			setSavedIds((prev) => {
				const next = new Set(prev);
				if (willSave) next.add(deckId);
				else next.delete(deckId);
				return next;
			});

			try {
				if (willSave) await Store.add(deckId);
				else await Store.remove(deckId);
			} catch (err) {
				setSavedIds((prev) => {
					const next = new Set(prev);
					if (willSave) next.delete(deckId);
					else next.add(deckId);
					return next;
				});
				throw err;
			}
		},
		[savedIds],
	);

	return { isSaved, toggle, loading };
};
