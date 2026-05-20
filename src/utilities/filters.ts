import type { MTGCard, MTGDeck } from "@/types";

export const searchFilter = (search: string) => (deck: MTGDeck) => {
	const allCards = (deck: MTGDeck): MTGCard[] => { 
		return [
			...deck?.artifacts ?? [],
			...deck?.creatures ?? [],
			...deck?.enchantments ?? [],
			...deck?.instants ?? [],
			...deck?.lands ?? [],
			...deck?.planeswalkers ?? [],
			...deck?.sorceries ?? [],
		]; 
	};

	return !search.trim() ||
		allCards(deck).some((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()));
};

export const selectedFilter = (selectedFilterValue: string, isSaved: (id: number) => boolean) => (deck: MTGDeck) => {
	return selectedFilterValue === "all" ? true : selectedFilterValue === "selected" ? isSaved(deck.id) : !isSaved(deck.id);
};

export const colorFilter = (colorFilters: string[]) => (deck: MTGDeck) => colorFilters.length === 0 || colorFilters.includes(deck.color);
