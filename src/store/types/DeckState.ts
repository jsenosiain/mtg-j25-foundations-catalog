import type StoreState from "./StoreState";

interface DeckState {
  artifacts?: StoreState[];
	color: string;
	creatures: StoreState[];
	enchantments?: StoreState[];
	id: number;
	instants?: StoreState[];
	iteration: number | null;
	lands: StoreState[];
	name: string;
	planeswalkers?: StoreState[];
	sorceries?: StoreState[];
}

export default DeckState;