export interface Card {
  artist: string, 
  flavor_text: string, 
  id: string, 
  image_uris: { [key: string]: string }, 
  mana_cost: string, 
  name: string, 
  oracle_text: string, 
  power: string, 
  prices: { [key: string]: string }[], 
  rarity: string, 
  toughness: string, 
  type_line: string
}

export interface Deck {
	id: string;
	color: string;
	iteration: number;
	name: string;
	artifacts?: Card[];
	creatures?: Card[];
	enchantments?: Card[];	
	instants?: Card[];
	lands?: Card[];
	planeswalkers?: Card[];
	sorceries?: Card[];
}