import type { MTGCard } from "@/types";
import ManaText from "./ManaText";

interface OracleTextProps {
	card: MTGCard;
}

const OracleText = ({ card }: OracleTextProps) => (
	<section className="flex-1 flex flex-col justify-end gap-2 text-sm p-2">
		{card?.oracle_text?.split("\n").map((line, index) => (
			<ManaText key={index} text={line} />
		))}
	</section>
);

export default OracleText;