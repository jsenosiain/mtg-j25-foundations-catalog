import List from "./List";
import { useSavedDecks } from "@/store";
import type MTGDeck from "@/types/MTGDeck";
import { BACKGROUND_COLORS } from "../contants";

export interface DeckProps {
	deck: MTGDeck;
}

const Deck = ({ deck }: DeckProps) => {
	const { isSaved, toggle } = useSavedDecks();
	const checked = isSaved(deck.id);

	const handleChange = () => {
		toggle(deck.id).catch((err: unknown) => {
			console.error("Failed to toggle deck", err);
		});
	};

	return (
		<div className="flex-[0_0_25%] p-2" key={deck.id}>
			<details className="border rounded-md p-4 cursor-pointer">
				<summary className="flex items-center justify-between gap-2">					
					<div className="flex items-center gap-2">
						<input type="checkbox" onChange={handleChange} checked={checked} value={deck.id} />
						<span className="font-bold">{deck.name}</span>
					</div>
					<span 
						className="rounded-full w-4 h-4 bg-gray-300" 
						style={{ backgroundColor: BACKGROUND_COLORS[deck.color as keyof typeof BACKGROUND_COLORS] }}
					></span>
				</summary>
				<p>
					<List category="Artifacts" deck={deck} />
					<List category="Planeswalkers" deck={deck} />
					<List category="Creatures" deck={deck} />
					<List category="Enchantments" deck={deck} />
					<List category="Instants" deck={deck} />
					<List category="Sorceries" deck={deck} />
					<List category="Lands" deck={deck} />
				</p>
			</details>
		</div>
	);
};

export default Deck;
