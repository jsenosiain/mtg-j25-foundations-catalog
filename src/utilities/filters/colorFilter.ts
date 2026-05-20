import type { MTGDeck } from "@/types";

const colorFilter = (colorFilters: string[]) => (deck: MTGDeck) => colorFilters.length === 0 || colorFilters.includes(deck.color);

export default colorFilter;