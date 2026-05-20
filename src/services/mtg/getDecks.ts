import type { Deck } from "./types";
import { getCards } from "./getCards";
import decks from "./j25-all-decks.json";

const getDecks = async (): Promise<Deck[]> => {
	const cards = await getCards();

	return decks.map((deck) => {
    const artifacts = (deck?.artifacts ?? []).map((artifact) => cards.find((card) => card.name.toLowerCase() === artifact.toLowerCase()));
    const creatures = (deck?.creatures ?? []).map((creature) => cards.find((card) => card.name.toLowerCase() === creature.toLowerCase()));
    const enchantments = (deck?.enchantments ?? []).map((enchantment) => cards.find((card) => card.name.toLowerCase() === enchantment.toLowerCase()));
    const instants = (deck?.instants ?? []).map((instant) => cards.find((card) => card.name.toLowerCase() === instant.toLowerCase()));
    const lands = (deck?.lands ?? []).map((land) => cards.find((card) => card.name.toLowerCase() === land.toLowerCase()));
    const planeswalkers = (deck?.planeswalkers ?? []).map((planeswalker) => cards.find((card) => card.name.toLowerCase() === planeswalker.toLowerCase()));
    const sorceries = (deck?.sorceries ?? []).map((sorcery) => cards.find((card) => card.name.toLowerCase() === sorcery.toLowerCase()));    

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

export { getDecks, Deck };