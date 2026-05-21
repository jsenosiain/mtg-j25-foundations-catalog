import type { MTGCard, MTGDeck } from "@/types";
import decks from "@/json/j25-all-decks.json";
import getCards from "./getCards";

const getDecks = async (): Promise<MTGDeck[]> => {
	const cards: MTGCard[] = await getCards();

  console.log("cards", cards);

	const nameToCard = (name: string) => {
    console.log("nameToCard", name);
    return {
      ...(cards.find((card) => card.name.toLowerCase() === name.toLowerCase()) as MTGCard),
      iteration: 0,
    };
  };
  
  //console.log("%cGET CARDS!", "color: red; font-weight: bold;");
  //console.log("decks", decks);

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

    const results = {        
			...rest,
      artifacts: artifacts.map(nameToCard),
      creatures: creatures.map(nameToCard),
      enchantments: enchantments.map(nameToCard),
      instants: instants.map(nameToCard),
      lands: lands.map(nameToCard),
      planeswalkers: planeswalkers.map(nameToCard),
      sorceries: sorceries.map(nameToCard),
    };

    //console.log("%cGET DECKS!", "color: red; font-weight: bold;");
    //console.log("results", results);

    return results;
  });
};

export default getDecks;