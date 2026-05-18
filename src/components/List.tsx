import { Activity } from "react";
import type MTGCard from "@/types/MTGCard";
import type MTGDeck from "@/types/MTGDeck";
import ListItem from "./ListItem";

type DeckCategory = Exclude<keyof MTGDeck, "color" | "id" | "iteration" | "name">;

export interface ListProps {
	category: string;
	deck: MTGDeck;
}

const List = ({ category, deck }: ListProps) => {
	const key = category.toLowerCase() as DeckCategory;
	const cards: MTGCard[] = deck?.[key] ?? [];

	return (
		<Activity mode={cards.length === 0 ? "hidden" : "visible"}>
			<details className="list" open>

				<summary className="flex gap-2 cursor-pointer">
					<span className="font-bold">{category}</span>
				</summary>
				<section>
					<ul className="">
						{cards.map((card, index) => (
							<ListItem key={`${card.id}${index}`} card={card} />
						))}
					</ul>
				</section>
			</details>
		</Activity>
	);
};

export default List;