"use client";

import { FARMS } from "../data";

const VIETNAM_PATH =
  "M 45,5 Q 38,15 35,25 Q 32,35 38,42 Q 40,50 36,58 Q 40,65 42,75 Q 48,82 52,90 Q 58,95 62,105 Q 68,115 72,125 Q 65,132 55,128 Q 45,125 40,115 Q 32,108 28,95 Q 25,85 28,72 Q 30,60 28,48 Q 30,35 35,22 Q 40,10 45,5 Z";

export function FarmMapSvg({
  hovered,
  setHovered,
  labelFor,
}: {
  hovered: string | null;
  setHovered: (id: string | null) => void;
  labelFor: (id: string) => string;
}) {
  return (
    <svg
      viewBox="0 0 100 140"
      preserveAspectRatio="xMidYMid meet"
      className="home-map-svg"
    >
      <defs>
        <pattern id="topo" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="rgba(26,26,26,0.08)" />
        </pattern>
      </defs>
      <path d={VIETNAM_PATH} fill="var(--cream)" stroke="var(--ink)" strokeWidth="0.3" />
      <path d={VIETNAM_PATH} fill="url(#topo)" opacity="0.6" />
      <g>
        <circle cx="52" cy="88" r="1.2" fill="var(--ink)" />
        <text
          x="55"
          y="90"
          fontSize="2.8"
          fontFamily="ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
          fill="var(--ink)"
        >
          HO CHI MINH
        </text>
      </g>
      {FARMS.map((f) => {
        const active = hovered === f.id;
        return (
          <g key={f.id}>
            <circle
              cx={f.x}
              cy={f.y}
              r={active ? 5 : 3.5}
              fill="var(--magenta)"
              opacity={active ? 0.2 : 0.15}
              style={{ transition: "all 0.3s" }}
            />
            <circle
              cx={f.x}
              cy={f.y}
              r={active ? 2 : 1.4}
              fill="var(--magenta)"
              style={{ transition: "all 0.3s", cursor: "pointer" }}
              onMouseEnter={() => setHovered(f.id)}
              onMouseLeave={() => setHovered(null)}
            />
            {active && (
              <g>
                <rect x={f.x + 4} y={f.y - 5} width="30" height="8" rx="1" fill="var(--ink)" />
                <text
                  x={f.x + 6}
                  y={f.y + 0.5}
                  fontSize="2.5"
                  fontFamily="ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
                  fill="var(--cream)"
                  letterSpacing="0.1"
                >
                  {labelFor(f.id).toUpperCase().slice(0, 20)}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
