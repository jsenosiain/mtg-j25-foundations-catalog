import { use } from "react";
import type { MTGDeck } from "@/types";
import { useSavedDecks } from "@/hooks";
import { Deck } from "@/components";
import { colorFilter, searchFilter, selectedFilter } from "@/utilities/filters";

interface DecksProps {
	colors: string[];
	decksPromise: Promise<MTGDeck[]>;
	search: string;
	selected: string;
}

const Decks = ({ colors, decksPromise, search, selected }: DecksProps) => {
	const list = use(decksPromise);

	const { isSaved } = useSavedDecks();	

	const visible = list
		.filter(colorFilter(colors))
		.filter(searchFilter(search))
		.filter(selectedFilter(selected, isSaved));	

	return (
		<div className="flex flex-wrap">
			{visible.map((deck) => (
				<Deck key={deck.id} deck={deck} />
			))}
		</div>
	);
}

export default Decks;