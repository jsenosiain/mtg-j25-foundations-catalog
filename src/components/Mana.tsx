import type { ReactNode } from "react";
import clsx from "clsx";
import { BACKGROUND_COLORS } from "../contants";

interface ManaProps {
	children?: ReactNode;
	type?: string;
}

const TYPE_TO_COLOR: Record<string, keyof typeof BACKGROUND_COLORS> = {
	W: "white",
	U: "blue",
	B: "black",
	R: "red",
	G: "green",
};

const Mana = ({ children, type = "C" }: ManaProps) => {
	return (
		<span
			className={clsx(
				"w-4 h-4 text-xs inline-flex items-center justify-center rounded-full",
				type === "C" && "bg-gray-300"
			)}
			style={type !== "C" ? { backgroundColor: BACKGROUND_COLORS[TYPE_TO_COLOR[type]] } : undefined}
		>{children}</span>
	);
};

export default Mana;