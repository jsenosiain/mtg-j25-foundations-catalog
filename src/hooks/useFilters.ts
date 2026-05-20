const colorFilter = (colorFilters: string[]) => (deck: MTGDeck) => colorFilters.length === 0 || colorFilters.includes(deck.color);

const searchFilter = (search: string) => (deck: MTGDeck) => {
	return !search.trim() ||
		allCards(deck).some((c) => c.name.toLowerCase().includes(search.trim().toLowerCase()));
}

const selectedFilter = (selectedFilterValue: string, isSaved: (id: string) => boolean) => (deck: MTGDeck) => {
	return selectedFilterValue === "all" ? true : selectedFilterValue === "selected" ? isSaved(deck.id) : !isSaved(deck.id);
};

const useFilters = (list: MTGDeck[] = []) => {
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