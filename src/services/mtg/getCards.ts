import type { MTGCard } from "@/types";
import { sleep } from "./sleep";

const BASE_URL = "https://api.scryfall.com/cards/search?q=set:j25&unique=prints&include_variations=true&format=json&order=set";
const CARDS_CACHE_KEY = 'scryfall_j25_cards';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const getCards = async (): Promise<MTGCard[]> => {
	const cached = localStorage.getItem(CARDS_CACHE_KEY);
  
	if (cached) {
		const { timestamp, cards } = JSON.parse(cached) as { timestamp: number; cards: MTGCard[] };
		if (Date.now() - timestamp < CACHE_TTL_MS) {
			return cards;
		}
	}

	const allCards = [];

	let nextUrl = BASE_URL;
	
	while (nextUrl) {		
		const response = await fetch(nextUrl, { headers: { "User-Agent": "ScryfallFetcher/1.0" } });		
		const data = await response.json();
		
		if (data.data && Array.isArray(data.data)) {
        allCards.push(...data.data);
      }

      nextUrl = data.has_more && data.next_page ? data.next_page : null;
		
		if (nextUrl) {
			await sleep(500);
		}
	}	
	
	const cards = allCards.map((card) => {
    const {
      artist,
      flavor_text,
      id,
      image_uris,
      mana_cost,
      name,
      oracle_text,
      power,
      prices,
      rarity,
      toughness,
      type_line,
    } = card;

    return {
      artist,
      flavor_text,
      id,
      image_uris,
      mana_cost,
      name,
      oracle_text,
      power,
      prices,
      rarity,
      toughness,
      type_line,
    };
  });

	try {
		localStorage.setItem(CARDS_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), cards }));
	} catch {
		// localStorage quota exceeded — proceed without caching
	}

	return cards;
}
	
export { getCards };