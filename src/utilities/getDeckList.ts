import type MTGCard from "@/types/MTGCard";
import type MTGDeck from "@/types/MTGDeck";
import cards from '@/store/data/j25-all-cards.json';
import decks from '@/store/data/j25-all-decks.json';

const cardList = cards as unknown as MTGCard[];

const load = (name: string): MTGCard | undefined =>
  cardList.find((card) => card.name === name);

const resolve = (names: string[] | undefined): MTGCard[] => (names ?? [])
  .map(load)
  .filter((card): card is MTGCard => card !== undefined);

const getDeckList = (): MTGDeck[] => decks.map((deck) => ({
  ...deck,
  artifacts: resolve(deck.artifacts),
  creatures: resolve(deck.creatures),
  enchantments: resolve(deck.enchantments),
  instants: resolve(deck.instants),
  lands: resolve(deck.lands),
  planeswalkers: resolve(deck.planeswalkers),
  sorceries: resolve(deck.sorceries),
})) as MTGDeck[];

export default getDeckList;
