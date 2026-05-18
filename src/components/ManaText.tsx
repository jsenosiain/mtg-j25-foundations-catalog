import React from "react";
import ManaSymbol from "./ManaSymbol";

function ManaText({ text }: { text: string }) {
  // Split on {X} tokens, keeping the delimiters
  const parts = text.split(/(\{[^}]+\})/);

  return (
    <p>
      {parts.map((part, i) => {
        const match = part.match(/^\{([^}]+)\}$/);
        return match
          ? <ManaSymbol key={i} symbol={match[1]} />
          : <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </p>
  );
}

export default ManaText;