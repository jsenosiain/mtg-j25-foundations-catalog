import { use } from "react";
import type { MTGDeck } from "@/types";
import { useSavedDecks } from "@/hooks";

interface DeckCounterProps {
	decksPromise: Promise<MTGDeck[]>;
}

const DeckCounter = ({ decksPromise }: DeckCounterProps) => {
	const list = use(decksPromise); 	
	
	// i believe this is causing unnecessary re-draws
	// once list resolves this component should display correctly but instead it
	// initially displays a 0 before updating to the correct count
	const { isSaved } = useSavedDecks();

	return (
		<span className="text-sm text-gray-500 shrink-0">
			{list.filter(({id}) => isSaved(id)).length} / {list.length}
		</span>
	);
};

export default DeckCounter;