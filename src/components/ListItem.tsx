import { useState } from "react";
import type MTGCard from "@/types/MTGCard";
import ManaCost from "./ManaCost";
import OracleText from "./OracleText";
import styles from "./ListItem.module.css";

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export interface ListItemProps {
	card: MTGCard;
}

const Attributes = ({ card }: { card: MTGCard }) => {
	if (!card.power || !card.toughness) {
		return null;
	}

	return (
		<div className="text-xs text-gray-400">{card.power} / {card.toughness}</div>
	)
};

const ListItem = ({ card }: ListItemProps) => {
	const [flipped, setFlipped] = useState(false);

	return (
		<li
			className={`odd:bg-white even:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer ${styles.container}`}
			onClick={() => setFlipped(f => !f)}
		>
			<div className={`${styles.inner} ${flipped ? styles.flipped : ""}`}>
				{/* Front */}
				<div className={`flex justify-between gap-2 ${styles.face}`}>
					<div className="flex flex-col gap-1 min-w-0">
						<span className="truncate min-w-0">{card.name}</span>
						<span className="truncate min-w-0 text-xs">{card.type_line}</span>
					</div>
					<div className="flex flex-col gap-1 h-full items-end shrink-0">
						<ManaCost cost={card.mana_cost ?? ""} />
						<Attributes card={card} />
					</div>
				</div>

				{/* Back */}
				<div className={`flex flex-col gap-1 ${styles.back}`}>
					{card.image_uris?.normal ? (
						<img
							src={card.image_uris.normal}
							alt={card.name}
							className={`rounded-lg w-full object-contain ${styles.image}`}
						/>
					) : (
						<div className="flex flex-col gap-1 text-gray-400 py-2">
							<span className="text-xs">{card.rarity}</span>
							<OracleText card={card} />
							<div className="flex flex-row justify-between text-xs">
								<div>{card.collector_number}</div>
								<div>{usdFormatter.format(Number(card.prices?.usd ?? 0))}</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</li>
	);
};

export default ListItem;