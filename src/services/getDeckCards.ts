import type { MTGCard, MTGDeck } from "@/types";

const EXPIRY_MS = 24 * 60 * 60 * 1000;
const SET = "j25";
const ENDPOINT = "https://api.scryfall.com/cards/collection";

interface ScryfallCollectionResponse {
	object: "list";
	data: MTGCard[];
	not_found?: Array<{ name: string; set?: string }>;
}

const buildIdentifiers = (deck: MTGDeck) => {
	const names = [
		...(deck.artifacts ?? []),
		...(deck.creatures ?? []),
		...(deck.enchantments ?? []),
		...(deck.instants ?? []),
		...(deck.lands ?? []),
		...(deck.planeswalkers ?? []),
		...(deck.sorceries ?? []),
	];
	const unique = Array.from(new Set(names));
	return unique.map((name) => ({ name, set: SET }));
};

const getDeckCards = async (deck: MTGDeck): Promise<MTGCard[]> => {
	const cacheKey = `mtg-deck-cache-${deck.id}`;
	const cached = localStorage.getItem(cacheKey);

	if (cached) {
		try {
			const { data, timestamp } = JSON.parse(cached) as { data: MTGCard[]; timestamp: number };
			if (Date.now() - timestamp < EXPIRY_MS) {
				return data;
			}
		} catch {
			// fall through and refetch
		}
	}

	const response = await fetch(ENDPOINT, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ identifiers: buildIdentifiers(deck) }),
	});

	if (!response.ok) {
		throw new Error(`Scryfall request failed: ${response.status}`);
	}

	const json = (await response.json()) as ScryfallCollectionResponse;
	const cards = json.data ?? [];

	try {
		localStorage.setItem(cacheKey, JSON.stringify({ data: cards, timestamp: Date.now() }));
	} catch {
		// localStorage quota exceeded — proceed without caching
	}

	return cards;
};

export default getDeckCards;
