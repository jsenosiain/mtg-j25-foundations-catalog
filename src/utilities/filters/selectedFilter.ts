import type { MTGDeck } from "@/types";

const selectedFilter = (selectedFilterValue: string, isSaved: (id: number) => boolean) => (deck: MTGDeck) => {
	return selectedFilterValue === "all" ? true : selectedFilterValue === "selected" ? isSaved(deck.id) : !isSaved(deck.id);
};

export default selectedFilter;