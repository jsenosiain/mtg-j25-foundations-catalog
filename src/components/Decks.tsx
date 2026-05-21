import { use } from "react";
import type { MTGDeck } from "@/types";
import { useSavedDecks } from "@/hooks";
import { Deck } from "@/components";
import { colorFilter, searchFilter, selectedFilter } from "@/utilities/filters";

interface DecksProps {
	colorFilters: string[];
	decksPromise: Promise<MTGDeck[]>;
	search: string;
	selected: string;
}

const Decks = ({ colorFilters, decksPromise, search, selected }: DecksProps) => {
	const list = use(decksPromise);

	const { isSaved, toggle } = useSavedDecks();	

	const visible = list
		.filter(colorFilter(colorFilters))
		.filter(searchFilter(search))
		.filter(selectedFilter(selected, isSaved));	

	return (
		<div className="flex flex-wrap">
			{visible.map((deck) => (
				<Deck key={deck.id} deck={deck} isChecked={isSaved(deck.id)} onCheck={toggle} />
			))}
		</div>
	);
}

export default Decks;