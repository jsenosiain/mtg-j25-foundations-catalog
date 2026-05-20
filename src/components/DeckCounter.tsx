const DeckCounter = ({ savedCount, totalCount }: { savedCount: number, totalCount: number }) => {
	return (
		<span className="text-sm text-gray-500 shrink-0">{savedCount} / {totalCount}</span>
	);
};

export default DeckCounter;