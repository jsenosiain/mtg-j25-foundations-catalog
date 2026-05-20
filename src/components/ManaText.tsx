import React from "react";
import ManaSymbol from "./ManaSymbol";

interface ManaTextProps {
  text: string;
}

function ManaText({ text }: ManaTextProps) {
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