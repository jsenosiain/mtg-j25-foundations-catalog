interface DeckCounterProps {
	savedCount: number;
	totalCount: number;
}

const DeckCounter = ({ savedCount, totalCount }: DeckCounterProps) => (
	<span className="text-sm text-gray-500 shrink-0">{savedCount} / {totalCount}</span>
);

export default DeckCounter;