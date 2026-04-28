"use client";

import type { CSSProperties } from "react";

export function SectionTitle({
  text,
  italicColor,
  style,
}: {
  text: string;
  italicColor: string;
  style?: CSSProperties;
}) {
  const lines = text.split("\n");
  return (
    <h2 className="h2" style={{ whiteSpace: "pre-line", ...style }}>
      {lines.map((line, i) => (
        <div key={line}>
          {i === 1 ? (
            <em className="italic" style={{ color: italicColor }}>
              {line}
            </em>
          ) : (
            line
          )}
        </div>
      ))}
    </h2>
  );
}
