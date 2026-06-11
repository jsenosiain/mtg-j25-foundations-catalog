import type { MTGDeck } from "@/types";
import { useSavedDecks } from "@/hooks";

interface DeckCounterProps {
	list: MTGDeck[];
}

const DeckCounter = ({ list }: DeckCounterProps) => {
	const { isSaved } = useSavedDecks();

	return (
		<span className="text-sm text-gray-500 shrink-0">
			{list.filter(({ id }) => isSaved(id)).length} / {list.length}
		</span>
	);
};

export default DeckCounter;
