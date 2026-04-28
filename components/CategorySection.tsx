"use client";

import { useTranslations } from "next-intl";

const CATEGORIES = [
  {
    name: "items.red.name",
    desc: "items.red.desc",
    href: "/shop",
    bg: "bg-gradient-to-br from-pitaya-50 to-white",
    shadowColor: "rgba(232, 25, 111, 0.18)",
    borderColor: "#f9a8d4",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" className="w-full h-full group-hover:[transform:rotate(-8deg)_scale(1.1)] transition-transform duration-300" aria-hidden="true">
        {/* Cross section - top down macro */}
        <circle cx="28" cy="34" r="17" fill="#e8196f" />
        <circle cx="28" cy="34" r="13" fill="#ff6ba8" />
        <circle cx="28" cy="34" r="9" fill="#fce7f3" opacity=".8" />
        {/* Seeds */}
        {[[22,28],[31,30],[26,38],[20,36],[34,37],[28,24]].map(([cx,cy],i) => (
          <ellipse key={i} cx={cx} cy={cy} rx="1.5" ry="2" fill="#1c1a2e" opacity=".5" transform={`rotate(${i*30},${cx},${cy})`} />
        ))}
        {/* Shine */}
        <ellipse cx="22" cy="28" rx="5" ry="3" fill="white" opacity=".3" transform="rotate(-30,22,28)" />
        {/* Stem */}
        <ellipse cx="28" cy="17" rx="4" ry="2.5" fill="#22a85a" />
        <line x1="28" y1="17" x2="24" y2="7"  stroke="#22a85a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="17" x2="32" y2="6"  stroke="#22a85a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="17" x2="28" y2="5"  stroke="#1a844a" strokeWidth="2"   strokeLinecap="round" />
        <line x1="28" y1="17" x2="20" y2="10" stroke="#1a844a" strokeWidth="2"   strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "items.white.name",
    desc: "items.white.desc",
    href: "/shop",
    bg: "bg-gradient-to-br from-slate-50 to-white",
    shadowColor: "rgba(100, 116, 139, 0.15)",
    borderColor: "#cbd5e1",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" className="w-full h-full group-hover:[transform:rotate(8deg)_scale(1.1)] transition-transform duration-300" aria-hidden="true">
        <circle cx="28" cy="34" r="17" fill="#f43f89" />
        <circle cx="28" cy="34" r="13" fill="white" />
        <circle cx="28" cy="34" r="9"  fill="#f8fafc" opacity=".9" />
        {[[22,28],[31,30],[26,38],[20,36],[34,37],[28,24]].map(([cx,cy],i) => (
          <ellipse key={i} cx={cx} cy={cy} rx="1.5" ry="2" fill="#1c1a2e" opacity=".3" transform={`rotate(${i*30},${cx},${cy})`} />
        ))}
        <ellipse cx="22" cy="28" rx="5" ry="3" fill="white" opacity=".5" transform="rotate(-30,22,28)" />
        <ellipse cx="28" cy="17" rx="4" ry="2.5" fill="#22a85a" />
        <line x1="28" y1="17" x2="24" y2="7"  stroke="#22a85a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="17" x2="32" y2="6"  stroke="#22a85a" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="28" y1="17" x2="28" y2="5"  stroke="#1a844a" strokeWidth="2"   strokeLinecap="round" />
        <line x1="28" y1="17" x2="20" y2="10" stroke="#1a844a" strokeWidth="2"   strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "items.export.name",
    desc: "items.export.desc",
    href: "/shop",
    bg: "bg-gradient-to-br from-cactus-100 to-white",
    shadowColor: "rgba(34, 168, 90, 0.18)",
    borderColor: "#86efac",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" className="w-full h-full group-hover:[transform:translateY(-4px)_scale(1.08)] transition-transform duration-300" aria-hidden="true">
        <rect x="10" y="28" width="36" height="22" rx="5" fill="#22a85a" />
        <rect x="16" y="34" width="24" height="10" rx="2.5" fill="white" opacity=".9" />
        <path d="M18 28 V18 C18 10 38 10 38 18 V28" stroke="#1a844a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="28" cy="39" r="3.5" fill="#22a85a" />
        {/* Gold stars */}
        {[[12,14],[44,14],[28,8]].map(([x,y],i) => (
          <text key={i} x={x} y={y} fontSize="8" fill="#fbbf24" textAnchor="middle" dominantBaseline="middle">★</text>
        ))}
        <ellipse cx="18" cy="32" rx="3" ry="2" fill="white" opacity=".3" />
      </svg>
    ),
  },
  {
    name: "items.discount.name",
    desc: "items.discount.desc",
    href: "/shop",
    bg: "bg-gradient-to-br from-amber-50 to-white",
    shadowColor: "rgba(251, 191, 36, 0.2)",
    borderColor: "#fcd34d",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" className="w-full h-full group-hover:[transform:scale(1.12)] transition-transform duration-300" aria-hidden="true">
        <ellipse cx="18" cy="40" rx="12" ry="12" fill="#f97316" opacity=".85" />
        <ellipse cx="38" cy="42" rx="11" ry="11" fill="#e8196f" opacity=".85" />
        <ellipse cx="28" cy="30" rx="12" ry="12" fill="#fbbf24" />
        {/* % badge */}
        <circle cx="28" cy="30" r="7" fill="white" opacity=".7" />
        <text x="28" y="31" fontSize="8" fill="#92400e" textAnchor="middle" dominantBaseline="middle" fontWeight="900">%</text>
        {/* Shine */}
        <ellipse cx="22" cy="25" rx="4" ry="2" fill="white" opacity=".4" transform="rotate(-25,22,25)" />
      </svg>
    ),
  },
];

export default function CategorySection() {
  const t = useTranslations("home.categories");
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="text-center mb-8 sm:mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-pitaya-500 mb-1">{t("eyebrow")}</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">{t("title")}</h2>
        <p className="text-slate-500 mt-2 text-sm">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.name}
            href={cat.href}
            className={`group ${cat.bg} p-5 sm:p-7 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center gap-3 cursor-pointer`}
            style={{
              borderColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = cat.borderColor;
              (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${cat.shadowColor}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "transparent";
              (e.currentTarget as HTMLElement).style.boxShadow = "";
            }}
          >
            {/* Icon container with subtle glass bg */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm p-3">
              {cat.icon}
            </div>
            <div>
              <p className="font-bold text-dragon-dark text-sm sm:text-base leading-snug">{t(cat.name)}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t(cat.desc)}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
