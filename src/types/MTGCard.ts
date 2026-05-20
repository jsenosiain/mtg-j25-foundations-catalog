interface MTGCard {
  artist?: string;
  cmc?: number;
  collector_number?: string;
  color_identity?: string[];
  colors?: string[];
  created_at?: string;
  id: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
    art_crop?: string;
    border_crop?: string;
  };
  keywords?: string[];
  legalities?: Record<string, string>;
  mana_cost?: string;
  name: string;
  oracle_text?: string;
  power?: string;
  prices?: Record<string, string>;
  rarity?: string;
  scryfall_id?: string;
  set_code?: string;
  set_name?: string;
  toughness?: string;
  type_line?: string;  
  updated_at?: string;
}

export type { MTGCard as default };