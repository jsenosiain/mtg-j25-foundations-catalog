import type MTGCard from "@/types/MTGCard";
import ManaCost from "./ManaCost";
import OracleText from "./OracleText";

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export interface ListItemProps {
	card: MTGCard;
}

const Attributes = ({ card }: { card: MTGCard }) => {
	if (!card?.power || !card?.toughness) {
		return null;
	}

	return (
		<div className="text-xs text-gray-400">{card.power} / {card.toughness}</div>
	)
};

const ListItem = ({ card }: ListItemProps) => {		
	return (
		<li className="flex gap-2 odd:bg-white even:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer">			
			<details className="w-full">
				<summary className="flex justify-between gap-2">
					<div className="flex flex-col gap-1">
						<span className="truncate min-w-0">{card?.name}</span>
						<span className="truncate min-w-0 text-xs">{card?.type_line}</span>
					</div>
					<div className="flex flex-col gap-1 h-full items-end">
						<ManaCost cost={card?.mana_cost ?? ""} />						
						<Attributes card={card} />
					</div>
				</summary>
				<section className="flex flex-col gap-0 text-gray-400 px-2 py-2">
	<span className="text-xs">{card?.rarity}</span>
					<OracleText card={card} />
					<div className="flex flex-row justify-between text-xs">
						<div>{card?.collector_number}</div>
						<div>{usdFormatter.format(Number(card?.prices?.usd ?? 0))}</div>
					</div>
				</section>
			</details>
		</li>
	);
};

export default ListItem;