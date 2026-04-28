"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const PRODUCTS = [
  {
    id: 1,
    name: "products.p1.name",
    price: "12.000đ",
    unit: "/kg",
    badge: "products.p1.badge",
    badgeColor: "bg-cactus-100 text-cactus-700",
    origin: "products.p1.origin",
    pattern: "red" as const,
    skin: "#e8196f",
    flesh: "#ff6ba8",
    inner: "#fce7f3",
  },
  {
    id: 2,
    name: "products.p2.name",
    price: "9.500đ",
    unit: "/kg",
    badge: "products.p2.badge",
    badgeColor: "bg-pitaya-100 text-pitaya-700",
    origin: "products.p2.origin",
    pattern: "red" as const,
    skin: "#db2476",
    flesh: "#f48ab8",
    inner: "#fdf2f8",
  },
  {
    id: 3,
    name: "products.p3.name",
    price: "8.000đ",
    unit: "/kg",
    badge: "products.p3.badge",
    badgeColor: "bg-blue-50 text-blue-600",
    origin: "products.p3.origin",
    pattern: "white" as const,
    skin: "#f43f89",
    flesh: "#fff",
    inner: "#f8fafc",
  },
  {
    id: 4,
    name: "products.p4.name",
    price: "18.000đ",
    unit: "/kg",
    badge: "products.p4.badge",
    badgeColor: "bg-amber-100 text-amber-700",
    origin: "products.p4.origin",
    pattern: "red" as const,
    skin: "#c81d6a",
    flesh: "#f06ba0",
    inner: "#fdf4f8",
  },
  {
    id: 5,
    name: "products.p5.name",
    price: "5.000đ",
    unit: "/kg",
    badge: "products.p5.badge",
    badgeColor: "bg-orange-100 text-orange-700",
    origin: "products.p5.origin",
    pattern: "white" as const,
    skin: "#f97316",
    flesh: "#fed7aa",
    inner: "#fff7ed",
  },
];

/* ── Macro cross-section per product card ── */
function ProductMacro({ skin, flesh, inner, pattern }: {
  skin: string; flesh: string; inner: string; pattern: "red" | "white";
}) {
  const isRed = pattern === "red";
  const seeds = isRed
    ? [[56,50],[70,56],[62,70],[48,66],[76,68],[60,44],[72,80],[44,78],[80,80]]
    : [[56,50],[70,56],[62,70],[48,66],[76,68],[60,44],[72,80],[44,78],[80,80]];

  return (
    <svg viewBox="0 0 140 140" className="w-full h-full drop-shadow-lg" aria-hidden="true">
      {/* Ambient glow */}
      <circle cx="70" cy="70" r="68" fill={skin} opacity=".1" />
      {/* Skin */}
      <circle cx="70" cy="70" r="60" fill={skin} />
      {/* Skin spines */}
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const rd = (v: number) => Math.round(v * 1000) / 1000;
        return <line key={i}
          x1={rd(70 + 44 * Math.cos(rad))} y1={rd(70 + 44 * Math.sin(rad))}
          x2={rd(70 + 60 * Math.cos(rad))} y2={rd(70 + 60 * Math.sin(rad))}
          stroke="white" strokeWidth="2" strokeLinecap="round" opacity=".4" />;
      })}
      {/* Flesh */}
      <circle cx="70" cy="70" r="45" fill={flesh} />
      {/* Inner */}
      <circle cx="70" cy="70" r="32" fill={inner} opacity=".9" />
      {/* Seeds */}
      {seeds.map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="2" ry="3"
          fill="#1c1a2e" opacity={isRed ? ".5" : ".3"}
          transform={`rotate(${(cx * cy) % 180}, ${cx}, ${cy})`} />
      ))}
      {/* Water shine */}
      <ellipse cx="53" cy="53" rx="11" ry="6" fill="white" opacity=".35" transform="rotate(-35,53,53)" />
      <ellipse cx="49" cy="49" rx="5" ry="3" fill="white" opacity=".5" transform="rotate(-35,49,49)" />
      <circle cx="46" cy="46" r="2" fill="white" opacity=".6" />
    </svg>
  );
}

export default function FeaturedProducts() {
  const t = useTranslations("home.featured");
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="bg-white rounded-3xl border border-pitaya-100 shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-pitaya-500 mb-0.5">{t("eyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-dragon-dark">{t("title")}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{t("subtitle")}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                aria-label={dir === "left" ? t("aria.scrollLeft") : t("aria.scrollRight")}
                onClick={() => scroll(dir)}
                className="w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-pitaya-50 hover:border-pitaya-300 transition-all flex items-center justify-center shadow-sm"
              >
                <svg className="w-4 h-4 text-dragon-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  {dir === "left"
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pt-2 pb-3 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="group min-w-[240px] sm:min-w-[265px] bg-white rounded-2xl border border-slate-100 hover:border-pitaya-200 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(232, 25, 111, 0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,.06)";
              }}
            >
              {/* Image area */}
              <div className="h-44 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6 relative overflow-hidden">
                {/* bg glow */}
                <div className="absolute inset-0 opacity-20"
                  style={{ background: `radial-gradient(circle at 60% 40%, ${p.skin} 0%, transparent 65%)` }} />
                <div className="w-32 h-32 sm:w-36 sm:h-36 relative z-10 group-hover:scale-105 transition-transform duration-300">
                  <ProductMacro skin={p.skin} flesh={p.flesh} inner={p.inner} pattern={p.pattern} />
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2.5 flex-1">
                {/* Badge + Origin */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`${p.badgeColor} px-2 py-0.5 rounded-full text-xs font-bold`}>
                    {t(p.badge)}
                  </span>
                  <span className="text-xs text-slate-400">{t(p.origin)}</span>
                </div>

                <h3 className="font-bold text-dragon-dark text-sm leading-snug">{t(p.name)}</h3>

                {/* Price – highlighted pitaya style */}
                <div className="mt-auto">
                  <span className="inline-flex items-center gap-1 bg-pitaya-50 text-pitaya-600 text-xs font-bold px-2 py-0.5 rounded-md mb-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {t("priceFrom")}
                  </span>
                  <p className="text-2xl font-black text-pitaya-600 leading-none">
                    {p.price}
                    <span className="text-xs font-normal text-slate-400 ml-0.5">{p.unit}</span>
                  </p>
                </div>

                {/* Gradient CTA button */}
                <Link
                  href="/shop"
                  className="mt-1 w-full flex items-center justify-center gap-2 text-white font-bold py-2.5 rounded-xl text-sm active:scale-95 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #22a85a 0%, #1a6e3f 100%)",
                    boxShadow: "0 4px 14px rgba(34,168,90,0.35)",
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {t("quickAdd")}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-6 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-pitaya-600 hover:text-pitaya-700 transition-colors"
          >
            {t("viewAll")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
