import { Activity } from "react";
import type MTGDeck from "@/types/MTGDeck";
import ListItem from "./ListItem";

export interface ListProps {
	category: string;
	deck: MTGDeck;
}

const List = ({ category, deck }: ListProps) => {	
	const cards = deck?.[category.toLowerCase()] ?? [];

	return (
		<Activity mode={cards.length === 0 ? "hidden" : "visible"}>
			<details className="list" open>

				<summary className="flex gap-2 cursor-pointer">
					<span className="font-bold">{category}</span>
				</summary>
				<p>
					<ul className="">
						{cards.map((card, index) => (
							<ListItem key={`${card.id}${index}`} card={card} />
						))}
					</ul>
				</p>
			</details>
		</Activity>
	);
};

export default List;