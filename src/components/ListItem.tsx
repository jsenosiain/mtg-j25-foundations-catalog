import type MTGCard from "@/types/MTGCard";
import ManaCost from "./ManaCost";

export interface ListItemProps {
	card: MTGCard;
}

const ListItem = ({ card }: ListItemProps) => {		
	return (
		<li className="flex gap-2 odd:bg-white even:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer">			
			<details className="w-full">
				<summary className="flex justify-between gap-2 truncate">
					<span>{card.name}</span>
					<ManaCost cost={card.mana_cost ?? ""} />
				</summary>
				<section className="flex-1 flex flex-col justify-end gap-2 text-sm text-gray-500 p-4">
					{card.oracle_text?.split("\n").map((line, index) => (
						<span key={index}>{line}</span>
					))}
				</section>
			</details>
		</li>
	);
};

export default ListItem;