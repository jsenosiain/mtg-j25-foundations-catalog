import { useState, Suspense } from "react";
import type { MTGCard, MTGDeck } from "@/types";
import { useSavedDecks } from "@/hooks";
import { getDeckCards } from "@/services";
import List from "./List";

export interface DeckProps {
	deck: MTGDeck;
}

const Deck = ({ deck }: DeckProps) => {
	const { isSaved, toggle } = useSavedDecks();
	const [cardsPromise, setCardsPromise] = useState<Promise<MTGCard[]> | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		toggle(parseInt(e.target.value, 10));
	};

	const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
		if (e.currentTarget.open && !cardsPromise) {
			setCardsPromise(getDeckCards(deck));
		}
	};

	return (
		<div className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] p-2" key={deck.id}>
			<details className="border rounded-md p-4 cursor-pointer" onToggle={handleToggle}>
				<summary className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<input type="checkbox" onChange={handleChange} checked={isSaved(deck.id)} value={deck.id} />
						<span className="font-bold">{deck.name}</span>
					</div>
					<span
						className="rounded-full w-4 h-4 bg-gray-300"
						style={{ backgroundColor: `var(--deck-${deck.color})` }}
					></span>
				</summary>
				<section>
					{cardsPromise && (
						<Suspense fallback={<div className="py-4 text-sm text-gray-500">Loading cards…</div>}>
							<List category="Artifacts" deck={deck} cardsPromise={cardsPromise} />
							<List category="Planeswalkers" deck={deck} cardsPromise={cardsPromise} />
							<List category="Creatures" deck={deck} cardsPromise={cardsPromise} />
							<List category="Enchantments" deck={deck} cardsPromise={cardsPromise} />
							<List category="Instants" deck={deck} cardsPromise={cardsPromise} />
							<List category="Sorceries" deck={deck} cardsPromise={cardsPromise} />
							<List category="Lands" deck={deck} cardsPromise={cardsPromise} />
						</Suspense>
					)}
				</section>
			</details>
		</div>
	);
};

export default Deck;
