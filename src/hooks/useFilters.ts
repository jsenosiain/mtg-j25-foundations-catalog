import type { MTGCard, MTGDeck } from "@/types";

const allCards = (deck: MTGDeck): MTGCard[] => [
	...(deck.artifacts ?? []),
	...(deck.creatures ?? []),
	...(deck.enchantments ?? []),
	...(deck.instants ?? []),
	...(deck.lands ?? []),
	...(deck.planeswalkers ?? []),
	...(deck.sorceries ?? []),
];	

const colorFilter = (colorFilters: string[]) => (deck: MTGDeck) => colorFilters.length === 0 || colorFilters.includes(deck.color);

const searchFilter = (search: string) => (deck: MTGDeck) => {
	// search does not work because `allCarfds` is not defined!
	return !search.trim() ||
		allCards(deck).some((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()));
}

const selectedFilter = (selectedFilterValue: string, isSaved: (id: number) => boolean) => (deck: MTGDeck) => {
	return selectedFilterValue === "all" ? true : selectedFilterValue === "selected" ? isSaved(deck.id) : !isSaved(deck.id);
};

const useFilters = (list: MTGDeck[] = []) => {
	const isSaved = (id: number): boolean => !!id;
	const colorFilters: string[] = [];
	const selectedFilterValue = "all"; // "all" | "selected" | "unselected"
	const search = "";
	
	const filtered = list
		.filter(colorFilter(colorFilters))
		.filter(searchFilter(search))
		.filter(selectedFilter(selectedFilterValue, isSaved));

	return {
		filtered,
		//toggleColor: (value: string) => {},
		//toggleSelected: (value: string) => {},
		//updateSearch: (value: string) => {},
	}
};

export default useFilters;