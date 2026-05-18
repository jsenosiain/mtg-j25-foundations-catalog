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

const ListItem = ({ card }: ListItemProps) => {		
	return (
		<li className="flex gap-2 odd:bg-white even:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer">			
			<details className="w-full">
				<summary className="flex justify-between gap-2">
					<div className="flex flex-col gap-1">
						<span className="truncate min-w-0">{card.name}</span>
						<span className="truncate min-w-0 text-xs">{card.type_line}</span>
					</div>
					<div className="flex flex-col gap-1 h-full items-end">
						<ManaCost cost={card.mana_cost ?? ""} />
						<span className="truncate min-w-0 text-xs">{card.rarity}</span>
					</div>
				</summary>
				<section>
					{/*
					<img src={card.image_uris?.art_crop} alt={card.name} />
					<span className="truncate min-w-0 text-xs text-gray-400">{card.artist}</span>
					*/}
					<OracleText card={card} />
					<div className="flex flex-row justify-between text-xs text-gray-400">
						<div>{usdFormatter.format(Number(card.prices?.usd ?? 0))}</div>
						<div>{card.collector_number} / 1213</div>
					</div>
				</section>
			</details>
		</li>
	);
};

export default ListItem;