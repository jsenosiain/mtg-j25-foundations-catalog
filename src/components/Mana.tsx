import type { ReactNode } from "react";
import clsx from "clsx";

interface ManaProps {
	children?: ReactNode;
	text?: string;
	type?: string;
}

const Mana = ({ children, type = "C" }: ManaProps) => {
	return (
		<span
			className={clsx(
				"w-4 h-4 text-xs inline-flex items-center justify-center rounded-full bg-no-repeat bg-center bg-contain",
				type === "C" && "bg-gray-300"
			)}
			style={type !== "C" ? { backgroundImage: `url(/mtg-j25-foundations-catalog/assets/mana/${type}.svg)` } : undefined}
		>{children}</span>
	);
};

export default Mana;