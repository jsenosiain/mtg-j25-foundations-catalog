import ManaText from "./ManaText";
import type MTGCard from "@/types/MTGCard";

const OracleText = ({ card }: { card: MTGCard }) => {
	return (
		<section className="flex-1 flex flex-col justify-end gap-2 text-sm p-2">
			{card?.oracle_text?.split("\n").map((line, index) => (
				<ManaText key={index} text={line} />
			))}
		</section>
	);
};

export default OracleText;