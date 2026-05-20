import type { Store } from "@/types";

const KEY = "decks";

const read = (): number[] => JSON.parse(localStorage.getItem(KEY) || "[]");
const write = (ids: number[]) => localStorage.setItem(KEY, JSON.stringify(ids));

const StoreLocal: Store = {
	list: async () => read(),

	add: async (id) => {
		const ids = read();
		if (!ids.includes(id)) write([...ids, id]);
	},

	remove: async (id) => {
		write(read().filter((existingId) => existingId !== id));
	},
};

export default StoreLocal;
