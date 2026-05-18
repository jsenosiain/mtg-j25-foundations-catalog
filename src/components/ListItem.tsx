import type MTGCard from "@/types/MTGCard";
import ManaCost from "./ManaCost";
import ManaText from "./ManaText";

export interface ListItemProps {
	card: MTGCard;
}

const ListItem = ({ card }: ListItemProps) => {		
	return (
		<li className="flex gap-2 odd:bg-white even:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer">			
			<details className="w-full">
				<summary className="flex justify-between gap-2">
					<span className="truncate min-w-0">{card.name}</span>
					<ManaCost cost={card.mana_cost ?? ""} />
				</summary>
				<section className="flex-1 flex flex-col justify-end gap-2 text-sm text-gray-500 p-4">
					{card.oracle_text?.split("\n").map((line, index) => (
						<ManaText key={index} text={line} />
					))}
				</section>
			</details>
		</li>
	);
};

export default ListItem;