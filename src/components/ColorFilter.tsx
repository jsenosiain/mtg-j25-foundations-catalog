import { BACKGROUND_COLORS } from "../contants";

interface ColorFilterProps {
	colorFilters: string[];
	toggleColor: (color: string) => void;
	savedList: MTGDeck[];
}

const ColorFilter = ({ colorFilters, savedList, toggleColor }: ColorFilterProps) => {
	const savedCounts = savedList.reduce((acc, deck) => ({
		...acc,
		[deck.color]: (acc[deck.color as keyof typeof acc] || 0) + 1,
	}), { black: 0, blue: 0, green: 0, multi: 0, red: 0, white: 0 });	

	const handleToggleColor = (color: string) => () => {
		toggleColor(color);
	};

	return (
		<div className="flex items-center gap-1">
			{Object.entries(BACKGROUND_COLORS).map(([color, bg]) => (
				<button
					key={color}
					title={color}
					onClick={handleToggleColor(color)}
					className={`w-6 h-6 text-xs rounded-full border border-gray-300 ${colorFilters.includes(color) ? "ring-2 ring-offset-1 ring-gray-700" : ""}`}
					style={{ backgroundColor: bg as string }}
				>{savedCounts[color as keyof typeof savedCounts]}</button>
			))}
		</div>
	);	
};

export default ColorFilter;