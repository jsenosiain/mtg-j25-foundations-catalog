import type MTGCard from "@/types/MTGCard";
import cards from '@/store/data/j25-all-cards.json';
import decks from '@/store/data/j25-all-decks.json';

const load = (name: string): MTGCard => {
  return cards.find((card) => card.name === name);
};

const getDeckList = (): MTGDeck[] => {
	 return decks.map((deck) => {
    const { artifacts = [], creatures, enchantments, instants, lands, planeswalkers, sorceries } = deck;
    
    return {
      ...deck,
      artifacts: artifacts.map(load),
      creatures: creatures.map(load),
      enchantments: enchantments?.map(load) ?? [],
      instants: instants?.map(load) ?? [],
      lands: lands?.map(load) ?? [],
      planeswalkers: planeswalkers?.map(load) ?? [],
      sorceries: sorceries?.map(load) ?? [],
    };
  });
};

export default getDeckList;