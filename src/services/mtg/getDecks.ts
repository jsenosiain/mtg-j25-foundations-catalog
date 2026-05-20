import type { MTGCard, MTGDeck } from "@/types";
import { getCards } from "./getCards";
import decks from "./j25-all-decks.json";

const getDecks = async (): Promise<MTGDeck[]> => {
	const cards: MTGCard[] = await getCards();

	const lookup = (name: string) => cards.find((card) => card.name.toLowerCase() === name.toLowerCase());

	return decks.map((deck) => {
    const artifacts     = (deck?.artifacts     ?? []).map(lookup).filter((c): c is MTGCard => c !== undefined);
    const creatures     = (deck?.creatures     ?? []).map(lookup).filter((c): c is MTGCard => c !== undefined);
    const enchantments  = (deck?.enchantments  ?? []).map(lookup).filter((c): c is MTGCard => c !== undefined);
    const instants      = (deck?.instants      ?? []).map(lookup).filter((c): c is MTGCard => c !== undefined);
    const lands         = (deck?.lands         ?? []).map(lookup).filter((c): c is MTGCard => c !== undefined);
    const planeswalkers = (deck?.planeswalkers ?? []).map(lookup).filter((c): c is MTGCard => c !== undefined);
    const sorceries     = (deck?.sorceries     ?? []).map(lookup).filter((c): c is MTGCard => c !== undefined);

    return {        
			...deck,
      artifacts,
      creatures,
      enchantments,
      instants,
      lands,
      planeswalkers,
      sorceries,
    };
  });
};

export { getDecks };