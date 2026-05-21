import type { MTGDeck } from "@/types";

const selectedFilter = (selected: string, isSaved: (id: number) => boolean) => (deck: MTGDeck) => {	
	return selected === "all" ? 
		true : 
		selected === "selected" ? 
			isSaved(deck.id) : 
			!isSaved(deck.id);
};

export default selectedFilter;