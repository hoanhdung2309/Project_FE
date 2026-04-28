"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function useInView<T extends Element>(): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, seen];
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [ref, seen] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${className} fade-up ${seen ? "in" : ""}`.trim()}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export type FruitVariant = "white" | "red" | "yellow" | "organic" | "processed";

export function Fruit({
  variant = "red",
  size = 180,
  style,
}: {
  variant?: FruitVariant;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`fruit fruit-${variant}`}
      style={{ width: size, height: size, ...style }}
    />
  );
}

export type PitayaVariant = "red" | "white" | "yellow";

const PITAYA_PALETTE: Record<
  PitayaVariant,
  { hi: string; mid: string; deep: string; core: string }
> = {
  red: { hi: "#FFB3CF", mid: "#D8336F", deep: "#7A1A40", core: "#4A0F2A" },
  white: { hi: "#FCDCE8", mid: "#E0729E", deep: "#8E2956", core: "#52132F" },
  yellow: { hi: "#FBF0B8", mid: "#E8C55A", deep: "#9C7820", core: "#523F12" },
};

/**
 * Realistic stylized dragon fruit (Pitaya) — oval body with green-tipped
 * bracts and a leafy crown. Fills its container by default; pass `size` for
 * a fixed pixel dimension.
 */
export function Pitaya({
  variant = "red",
  size,
  className,
}: {
  variant?: PitayaVariant;
  size?: number;
  className?: string;
}) {
  const reactId = useId();
  const id = `pt${reactId.replace(/:/g, "")}`;
  const palette = PITAYA_PALETTE[variant];
  const dims = size
    ? { width: size, height: size }
    : { width: "100%" as const, height: "100%" as const };

  return (
    <svg
      {...dims}
      viewBox="0 0 240 280"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${id}-body`} cx="35%" cy="28%" r="78%">
          <stop offset="0%" stopColor={palette.hi} />
          <stop offset="40%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.deep} />
        </radialGradient>
        <linearGradient id={`${id}-bract`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#D7E574" />
          <stop offset="55%" stopColor="#86AC32" />
          <stop offset="100%" stopColor={palette.deep} />
        </linearGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2EE7A" />
          <stop offset="60%" stopColor="#A6C342" />
          <stop offset="100%" stopColor="#4A6B30" />
        </linearGradient>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="120" cy="248" rx="58" ry="6" fill="#000" opacity="0.16" />

      {/* Body */}
      <ellipse cx="120" cy="160" rx="68" ry="84" fill={`url(#${id}-body)`} />

      {/* Inner core shadow (bottom-right) */}
      <path
        d="M 96 160 C 94 200 110 238 142 244 C 120 236 104 210 106 170 C 108 138 122 114 144 100 C 120 100 98 126 96 160 Z"
        fill={palette.core}
        opacity="0.32"
      />

      {/* Highlight */}
      <ellipse
        cx="98"
        cy="116"
        rx="22"
        ry="34"
        fill="#FFFFFF"
        opacity="0.30"
        transform="rotate(-18 98 116)"
      />
      <ellipse
        cx="92"
        cy="104"
        rx="8"
        ry="14"
        fill="#FFFFFF"
        opacity="0.55"
        transform="rotate(-18 92 104)"
      />

      {/* Bracts — left side */}
      <path
        d="M 64 128 C 44 116 28 96 18 76 C 32 100 50 116 70 124 C 64 112 62 100 64 88 C 66 102 70 114 74 124 Z"
        fill={`url(#${id}-bract)`}
      />
      <path
        d="M 54 172 C 34 172 16 168 2 160 C 24 174 46 184 72 188 Z"
        fill={`url(#${id}-bract)`}
      />
      <path
        d="M 62 212 C 42 220 24 232 10 246 C 34 232 54 222 76 214 Z"
        fill={`url(#${id}-bract)`}
        opacity="0.95"
      />

      {/* Bracts — right side */}
      <path
        d="M 176 128 C 196 116 212 96 222 76 C 208 100 190 116 170 124 C 176 112 178 100 176 88 C 174 102 170 114 166 124 Z"
        fill={`url(#${id}-bract)`}
      />
      <path
        d="M 186 172 C 206 172 224 168 238 160 C 216 174 194 184 168 188 Z"
        fill={`url(#${id}-bract)`}
      />
      <path
        d="M 178 212 C 198 220 216 232 230 246 C 206 232 186 222 164 214 Z"
        fill={`url(#${id}-bract)`}
        opacity="0.95"
      />

      {/* Top crown — central pointed leaves */}
      <path
        d="M 122 92 C 120 70 116 46 108 22 C 116 46 124 60 126 78 C 128 56 134 38 142 22 C 138 46 132 70 130 96 Z"
        fill={`url(#${id}-leaf)`}
      />
      <path
        d="M 102 100 C 92 80 76 60 58 44 C 70 70 84 90 100 110 Z"
        fill={`url(#${id}-leaf)`}
        opacity="0.95"
      />
      <path
        d="M 138 100 C 148 80 164 60 182 44 C 170 70 156 90 140 110 Z"
        fill={`url(#${id}-leaf)`}
        opacity="0.95"
      />
    </svg>
  );
}

export function PitayaMark({
  size = 32,
  withRing = false,
}: {
  size?: number;
  withRing?: boolean;
}) {
  const reactId = useId();
  const id = `pm${reactId.replace(/:/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ flexShrink: 0 }}>
      <defs>
        <radialGradient id={`${id}-body`} cx="0.38" cy="0.3" r="0.95">
          <stop offset="0" stopColor="#FFB3CF" />
          <stop offset="0.25" stopColor="#FF7AA8" />
          <stop offset="0.6" stopColor="#D8336F" />
          <stop offset="1" stopColor="#7A1A40" />
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E2EE7A" />
          <stop offset="0.5" stopColor="#A6C342" />
          <stop offset="1" stopColor="#6E9430" />
        </linearGradient>
        <linearGradient id={`${id}-bract`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C8DD5C" />
          <stop offset="0.6" stopColor="#86AC32" />
          <stop offset="1" stopColor="#9C2454" />
        </linearGradient>
        <filter id={`${id}-rough`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={3} />
          <feDisplacementMap in="SourceGraphic" scale="2" />
        </filter>
      </defs>
      {withRing && (
        <>
          <circle cx="120" cy="120" r="116" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          <circle cx="120" cy="120" r="110" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </>
      )}

      <ellipse cx="120" cy="220" rx="50" ry="6" fill="#000" opacity="0.10" />

      <g filter={`url(#${id}-rough)`}>
        <path
          d="M 120 48 C 86 48 60 78 60 132 C 60 184 86 214 120 214 C 154 214 180 184 180 132 C 180 78 154 48 120 48 Z"
          fill={`url(#${id}-body)`}
        />
        <path
          d="M 78 132 C 76 168 92 200 120 210 C 102 198 90 170 92 140 C 94 114 104 94 122 84 C 104 80 82 102 78 132 Z"
          fill="#7A1A40"
          opacity="0.4"
        />
        <ellipse cx="100" cy="92" rx="22" ry="34" fill="#FFFFFF" opacity="0.28" transform="rotate(-18 100 92)" />
        <ellipse cx="92" cy="80" rx="9" ry="14" fill="#FFFFFF" opacity="0.45" transform="rotate(-18 92 80)" />
        <ellipse cx="158" cy="180" rx="14" ry="8" fill="#5A1232" opacity="0.22" transform="rotate(20 158 180)" />
      </g>

      <g filter={`url(#${id}-rough)`}>
        <path
          d="M 76 102 C 60 88 46 70 38 50 C 50 70 64 84 80 96 C 76 88 76 80 78 70 C 78 84 80 94 84 104 Z"
          fill={`url(#${id}-bract)`}
        />
        <path
          d="M 70 142 C 50 142 32 138 16 132 C 36 144 56 154 78 156 Z"
          fill={`url(#${id}-bract)`}
        />
        <path
          d="M 80 178 C 64 184 48 196 36 210 C 56 200 74 192 90 184 Z"
          fill={`url(#${id}-bract)`}
          opacity="0.95"
        />
        <path
          d="M 164 102 C 180 88 194 70 202 50 C 190 70 176 84 160 96 C 164 88 164 80 162 70 C 162 84 160 94 156 104 Z"
          fill={`url(#${id}-bract)`}
        />
        <path
          d="M 170 142 C 190 142 208 138 224 132 C 204 144 184 154 162 156 Z"
          fill={`url(#${id}-bract)`}
        />
        <path
          d="M 160 178 C 176 184 192 196 204 210 C 184 200 166 192 150 184 Z"
          fill={`url(#${id}-bract)`}
          opacity="0.95"
        />
      </g>

      <g filter={`url(#${id}-rough)`}>
        <path
          d="M 122 64 C 120 44 116 22 110 2 C 116 18 124 32 126 48 C 128 30 134 16 142 4 C 138 24 132 46 130 66 Z"
          fill={`url(#${id}-leaf)`}
        />
        <path
          d="M 110 70 C 102 50 88 30 70 16 C 80 38 92 58 106 76 Z"
          fill={`url(#${id}-leaf)`}
          opacity="0.95"
        />
        <path
          d="M 134 70 C 142 50 156 30 174 16 C 164 38 152 58 138 76 Z"
          fill={`url(#${id}-leaf)`}
          opacity="0.95"
        />
        <path
          d="M 96 80 C 80 66 56 50 36 42 C 56 60 76 76 94 92 Z"
          fill={`url(#${id}-leaf)`}
          opacity="0.9"
        />
        <path
          d="M 148 80 C 164 66 188 50 208 42 C 188 60 168 76 150 92 Z"
          fill={`url(#${id}-leaf)`}
          opacity="0.9"
        />
        <path
          d="M 122 60 C 122 42 124 24 126 8 C 124 28 122 46 122 60 Z"
          fill="#E2EE7A"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

export function DragonLogo({ onDark = true }: { onDark?: boolean }) {
  return (
    <a
      href="/"
      className="nav-logo"
      style={{ color: onDark ? "var(--cream-light)" : "var(--ink)" }}
    >
      <PitayaMark size={36} />
      <span>D-Dragon</span>
    </a>
  );
}

export type IconName =
  | "cart"
  | "search"
  | "user"
  | "arrow"
  | "arrowUp"
  | "close"
  | "check"
  | "plus"
  | "minus"
  | "filter"
  | "pin"
  | "phone"
  | "mail"
  | "chat"
  | "leaf"
  | "package"
  | "globe";

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    cart: (
      <>
        <path d="M3 4h2.5l1.5 12h12l1.5-8H6.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="20" r="1.4" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <circle cx="18" cy="20" r="1.4" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </>
    ),
    arrow: (
      <path d="M5 12h14m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    arrowUp: (
      <path d="M7 17L17 7m0 0H9m8 0v8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    ),
    close: <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />,
    check: <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />,
    minus: <path d="M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />,
    pin: (
      <>
        <path d="M12 22c-4-5-7-8-7-12a7 7 0 0114 0c0 4-3 7-7 12z" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </>
    ),
    phone: (
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M3 7l9 7 9-7" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </>
    ),
    chat: (
      <path d="M4 5h16v10H10l-4 4v-4H4V5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    ),
    leaf: (
      <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l6-6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
    package: (
      <>
        <path d="M12 3l9 5v8l-9 5-9-5V8l9-5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
        <path d="M3 8l9 5 9-5M12 13v10" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      {paths[name] || null}
    </svg>
  );
}
