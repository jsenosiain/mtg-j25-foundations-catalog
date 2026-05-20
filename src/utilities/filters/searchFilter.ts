import type { MTGCard, MTGDeck } from "@/types";

const searchFilter = (search: string) => (deck: MTGDeck) => {
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

export default searchFilter;