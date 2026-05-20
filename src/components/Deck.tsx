import List from "./List";
import type { MTGDeck } from "@/types";

export interface DeckProps {
	deck: MTGDeck;
	isChecked: boolean;
	onCheck: (id: number) => void;
}

const Deck = ({ deck, isChecked, onCheck }: DeckProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onCheck(parseInt(e.target.value, 10));
	};

	return (
		<div className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] p-2" key={deck.id}>
			<details className="border rounded-md p-4 cursor-pointer">
				<summary className="flex items-center justify-between gap-2">					
					<div className="flex items-center gap-2">
						<input type="checkbox" onChange={handleChange} checked={isChecked} value={deck.id} />
						<span className="font-bold">{deck.name}</span>
					</div>
					<span 
						className="rounded-full w-4 h-4 bg-gray-300" 
						style={{ backgroundColor: `var(--deck-${deck.color})` }}
					></span>
				</summary>
				<section>
					<List category="Artifacts" deck={deck} />
					<List category="Planeswalkers" deck={deck} />
					<List category="Creatures" deck={deck} />
					<List category="Enchantments" deck={deck} />
					<List category="Instants" deck={deck} />
					<List category="Sorceries" deck={deck} />
					<List category="Lands" deck={deck} />
				</section>
			</details>
		</div>
	);
};

export default Deck;
