export interface DeckStore {
	list: () => Promise<number[]>;
	add: (deckId: number) => Promise<void>;
	remove: (deckId: number) => Promise<void>;
}
