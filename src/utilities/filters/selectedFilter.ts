import type { MTGDeck } from "@/types";

const selectedFilter = (selected: string, isSaved: (id: number) => boolean) => (deck: MTGDeck) => {	
	switch(selected) {
		case "all":
			return true;
		case "selected":
			return isSaved(deck.id);
		default:
			return !isSaved(deck.id);
	}
};

export default selectedFilter;