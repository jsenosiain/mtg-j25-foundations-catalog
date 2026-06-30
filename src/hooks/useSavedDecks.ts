import { useCallback } from "react";
import { Store, useSavedIds } from "@/store";

const useSavedDecks = () => {
	const savedIds = useSavedIds();

	const isSaved = useCallback((deckId: number) => savedIds.has(deckId), [savedIds]);

	const toggle = useCallback(async (deckId: number) => {
		if (savedIds.has(deckId)) await Store.remove(deckId);
		else await Store.add(deckId);
	}, [savedIds]);

	return { isSaved, toggle, loading: false };
};

export default useSavedDecks;
