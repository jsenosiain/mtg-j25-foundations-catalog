import { Activity, use } from "react";
import type { MTGCard, MTGDeck } from "@/types";
import ListItem from "./ListItem";

type DeckCategory = Exclude<keyof MTGDeck, "color" | "id" | "iteration" | "name">;

export interface ListProps {
	category: string;
	deck: MTGDeck;
	cardsPromise: Promise<MTGCard[]>;
}

const List = ({ category, deck, cardsPromise }: ListProps) => {
	const cards = use(cardsPromise);
	const key = category.toLowerCase() as DeckCategory;
	const names: string[] = deck?.[key] ?? [];

	const items = names
		.map((name) => cards.find((card) => card.name === name))
		.filter((card): card is MTGCard => Boolean(card));

		console.log("items", items.map((i) => i.rarity));

	return (
		<Activity mode={names.length === 0 ? "hidden" : "visible"}>
			<details className="list" open>

				<summary className="flex gap-2 cursor-pointer">
					<span className="font-bold">{category}</span>
				</summary>
				<section>
					<ul className="">
						{items.map((card, index) => (
							<ListItem key={`${card.id}-${index}`} card={card} />
						))}
					</ul>
				</section>
			</details>
		</Activity>
	);
};

export default List;
