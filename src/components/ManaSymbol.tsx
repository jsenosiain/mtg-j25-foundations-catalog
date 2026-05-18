import Mana from "./Mana";

const SVG_SYMBOLS = new Set(["W", "U", "B", "R", "G"]);

const BASE_CLASS =
  "w-4 h-4 text-xs font-bold inline-flex items-center justify-center " +
  "rounded-full align-middle mx-0.5 select-none";

const SYMBOL_MAP: Record<string, { label: string; className: string }> = {
  C: { label: "C", className: "bg-gray-400 text-white" },
  T: { label: "T", className: "bg-gray-200 text-gray-700" },
  X: { label: "X", className: "bg-gray-300 text-gray-800" },
};

function ManaSymbol({ symbol }: { symbol: string }) {
  const key = symbol.toUpperCase();

  if (SVG_SYMBOLS.has(key)) {
    return <Mana type={key} />;
  }

  const isNumeric = /^\d+$/.test(key);
  const { label, className } = SYMBOL_MAP[key] ?? {
    label: symbol,
    className: "bg-gray-300 text-gray-800",
  };

  return (
    <span className={`${BASE_CLASS} ${isNumeric ? "bg-gray-300 text-gray-800" : className}`}>
      <span className={key === "T" ? "inline-block rotate-30" : undefined}>
        {isNumeric ? symbol : label}
      </span>
    </span>
  );
}

export default ManaSymbol;