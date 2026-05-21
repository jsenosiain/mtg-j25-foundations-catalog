import type { MTGDeck } from "@/types";
import { useSavedDecks } from "@/hooks";

const COLOR_ORDER = ["white", "blue", "black", "red", "green", "multi"];

interface ColorFilterProps {
	list: MTGDeck[];
	colorFilters: string[];
	toggleColor: (color: string) => void;
}

const ColorFilter = ({ list, colorFilters, toggleColor }: ColorFilterProps) => {
	const { isSaved } = useSavedDecks();
	const savedList = list.filter((deck) => isSaved(deck.id));	

	const initialCounts = { black: 0, blue: 0, green: 0, multi: 0, red: 0, white: 0 };
	const savedCounts = savedList.reduce((acc, deck) => ({
		...acc,
		[deck.color]: (acc[deck.color as keyof typeof acc] || 0) + 1,
	}), initialCounts);	

	const handleToggleColor = (color: string) => () => {
		toggleColor(color);
	};

	return (
		<div className="flex items-center gap-1">
			{COLOR_ORDER.map((color) => (
				<button
					key={color}
					title={color}
					onClick={handleToggleColor(color)}
					className={`w-6 h-6 text-xs rounded-full border border-gray-300 ${colorFilters.includes(color) ? "ring-2 ring-offset-1 ring-gray-700" : ""}`}
					style={{ backgroundColor: `var(--deck-${color})` }}
				>{savedCounts[color as keyof typeof savedCounts]}</button>
			))}
		</div>
	);	
};

export default ColorFilter;