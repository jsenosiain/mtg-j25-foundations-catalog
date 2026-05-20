import type { MTGCard } from "@/types";

const Attributes = ({ card }: { card: MTGCard }) => {
	if (!card?.power || !card?.toughness) {
		return null;
	}

	return (
		<div className="text-xs text-gray-400">{card.power} / {card.toughness}</div>
	)
};

export default Attributes;