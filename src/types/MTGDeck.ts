import type MTGCard from "@/types/MTGCard";

interface MTGDeck {
	artifacts?: MTGCard[];
	color: string;
	creatures?: MTGCard[];
	enchantments?: MTGCard[];
	id: number;
	instants?: MTGCard[];
	iteration?: number | null;
	lands?: MTGCard[];
	name?: string;
	planeswalkers?: MTGCard[];
	sorceries?: MTGCard[];
}

export type { MTGDeck as default };