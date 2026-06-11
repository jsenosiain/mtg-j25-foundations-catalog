interface MTGDeck {
	artifacts?: string[];
	color: string;
	creatures?: string[];
	enchantments?: string[];
	id: number;
	instants?: string[];
	iteration?: number | null;
	lands?: string[];
	name?: string;
	planeswalkers?: string[];
	sorceries?: string[];
}

export type { MTGDeck as default };
