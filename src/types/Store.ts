interface Store {
	list: () => Promise<number[]>;
	add: (id: number) => Promise<void>;
	remove: (id: number) => Promise<void>;
}

export type { Store as default };