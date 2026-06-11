import type { MTGDeck } from "@/types";

const allCardNames = (deck: MTGDeck): string[] => [
	...(deck.artifacts ?? []),
	...(deck.creatures ?? []),
	...(deck.enchantments ?? []),
	...(deck.instants ?? []),
	...(deck.lands ?? []),
	...(deck.planeswalkers ?? []),
	...(deck.sorceries ?? []),
];

const searchFilter = (search: string) => (deck: MTGDeck) => {
	const needle = search.trim().toLowerCase();
	if (!needle) return true;
	return allCardNames(deck).some((name) => name.toLowerCase().includes(needle));
};

export default searchFilter;
