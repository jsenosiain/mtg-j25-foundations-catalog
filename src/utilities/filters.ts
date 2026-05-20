export const searchFilter = (search: string) => (deck: MTGDeck) => {
	return !search.trim() ||
		allCards(deck).some((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()));
};

export const selectedFilter = (selectedFilterValue: string, isSaved: (id: string) => boolean) => (deck: MTGDeck) => {
	return selectedFilterValue === "all" ? true : selectedFilterValue === "selected" ? isSaved(deck.id) : !isSaved(deck.id);
};

export const colorFilter = (colorFilters: string[]) => (deck: MTGDeck) => colorFilters.length === 0 || colorFilters.includes(deck.color);
