import type { MTGCard, MTGDeck } from "@/types";
import decks from "@/json/j25-all-decks.json";
import getCards from "./getCards";

const getDecks = async (): Promise<MTGDeck[]> => {
	const cards: MTGCard[] = await getCards();

	const nameToCard = (name: string) => {
    return {
      ...cards.find((card) => card.name.toLowerCase() === name.toLowerCase()) as MTGCard,
      iteration: 0,
    };
  };

	return decks.map((deck) => {
    const { 
      artifacts = [], 
      creatures = [], 
      enchantments = [], 
      instants = [], 
      lands = [], 
      planeswalkers = [], 
      sorceries = [], 
      ...rest 
    } = deck;

    return {        
			...rest,
      artifacts: artifacts.map(nameToCard),
      creatures: creatures.map(nameToCard),
      enchantments: enchantments.map(nameToCard),
      instants: instants.map(nameToCard),
      lands: lands.map(nameToCard),
      planeswalkers: planeswalkers.map(nameToCard),
      sorceries: sorceries.map(nameToCard),
    };
  });
};

export default getDecks;