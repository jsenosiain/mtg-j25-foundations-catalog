import type { MTGCard } from "@/types";
import { usdFormatter } from "@/utilities";
import Attributes from "./Attributes";
import ManaCost from "./ManaCost";
import OracleText from "./OracleText";

type RARITY = "common" | "uncommon" | "rare" | "mythic";
const RARITY_COLOR: Record<RARITY, string>  = {
	common: "rgb(33,33,33)",
	uncommon: "rgb(185,220,235)",
	rare: "rgb(230,205,140)",
	mythic: "rgb(209,81,45)"
};

export interface ListItemProps {
	card: MTGCard;
}

const ListItem = ({ card }: ListItemProps) => {
	const rarityColor = card.rarity && card.rarity in RARITY_COLOR
		? RARITY_COLOR[card.rarity as RARITY]
		: RARITY_COLOR.common;

	return (
		<li className="flex gap-2 odd:bg-white even:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer">			
			<details className="w-full">
				<summary className="flex justify-between gap-2">
					<div className="flex flex-col gap-1">
						<span className="truncate min-w-0">{card?.name}</span>
						<span className="truncate min-w-0 text-xs flex gap-1 items-center">						
							<span className="w-2 h-2 rounded-full" style={{ backgroundColor: rarityColor }}></span>
							<span>{card?.type_line}</span>
						</span>
					</div>
					<div className="flex flex-col gap-1 h-full items-end">
						<ManaCost cost={card?.mana_cost ?? ""} />	
						<Attributes card={card} />	
					</div>
				</summary>
				<section className="flex flex-col gap-0 text-gray-400 px-2 py-0">
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