import type { DeckStore } from "./types/DeckStore";

const KEY = "decks";

const read = (): number[] => JSON.parse(localStorage.getItem(KEY) || "[]");
const write = (ids: number[]) => localStorage.setItem(KEY, JSON.stringify(ids));

const StoreLocal: DeckStore = {
	list: async () => read(),

	add: async (deckId) => {
		const ids = read();
		if (!ids.includes(deckId)) write([...ids, deckId]);
	},

	remove: async (deckId) => {
		write(read().filter((id) => id !== deckId));
	},
};

export default StoreLocal;
