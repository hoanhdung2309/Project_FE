"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const SLIDES = [
  {
    id: 1,
    eyebrow: "Cam kết",
    headlineThin: "Chất Lượng",
    headlineBold: "VietGAP",
    headlineSub: "Chuẩn Quốc Tế",
    sub: "Giá ưu đãi tự động theo số lượng sỉ. Giao hàng toàn quốc trong 24h.",
    cta: "Xem bảng giá sỉ hôm nay",
    ctaHref: "/shop",
    ctaSecondary: "Tìm hiểu thêm",
    ctaSecondaryHref: "/about",
    gradient: "from-[#fff0f7] via-pitaya-50 to-white",
    accentColor: "#e8196f",
    tag: { text: "Lô mới về", color: "bg-cactus-500" },
    pattern: "red" as const,
  },
  {
    id: 2,
    eyebrow: "Nông trại",
    headlineThin: "Hàng Xuất Khẩu",
    headlineBold: "GlobalGAP",
    headlineSub: "Bình Thuận",
    sub: "Tiêu chuẩn xuất khẩu Châu Âu & Nhật Bản. Tỷ lệ loại 1 trên 90%.",
    cta: "Xem sản phẩm xuất khẩu",
    ctaHref: "/shop",
    ctaSecondary: "Về chúng tôi",
    ctaSecondaryHref: "/about",
    gradient: "from-[#f0fff4] via-cactus-100 to-white",
    accentColor: "#22a85a",
    tag: { text: "VietGAP", color: "bg-pitaya-500" },
    pattern: "white" as const,
  },
];

/* ── Macro cross-section SVG ── */
function MacroFruitSVG({ pattern }: { pattern: "red" | "white" }) {
  const isRed = pattern === "red";
  const skin = isRed ? "#e8196f" : "#f43f89";
  const flesh = isRed ? "#ff6ba8" : "#fff";
  const innerFlesh = isRed ? "#fce7f3" : "#f8fafc";
  const seedColor = "#1c1a2e";

  /* Seed positions scattered organically */
  const seeds = isRed
    ? [[88,75],[108,82],[97,100],[78,96],[115,99],[92,65],[103,115],[74,112],[118,112],[88,125],[110,130]]
    : [[90,78],[107,85],[96,102],[79,97],[113,101],[93,68],[102,118],[75,113],[117,114],[89,128],[111,132]];

  return (
    <svg viewBox="0 0 220 220" className="w-full h-full drop-shadow-2xl" aria-hidden="true">
      {/* Outer glow */}
      <circle cx="110" cy="110" r="105" fill={skin} opacity=".08" />

      {/* Skin ring */}
      <circle cx="110" cy="110" r="95" fill={skin} />

      {/* Skin texture stripes */}
      {[0,36,72,108,144,180,216,252,288,324].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const r = (v: number) => Math.round(v * 1000) / 1000;
        const x1 = r(110 + 72 * Math.cos(rad));
        const y1 = r(110 + 72 * Math.sin(rad));
        const x2 = r(110 + 95 * Math.cos(rad));
        const y2 = r(110 + 95 * Math.sin(rad));
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="3" strokeLinecap="round" opacity=".4" />;
      })}

      {/* Flesh base */}
      <circle cx="110" cy="110" r="72" fill={flesh} />

      {/* Inner flesh */}
      <circle cx="110" cy="110" r="55" fill={innerFlesh} opacity=".8" />

      {/* Seeds */}
      {seeds.map(([cx, cy], i) => (
        <ellipse
          key={i}
          cx={cx} cy={cy}
          rx="3" ry="4.5"
          fill={seedColor}
          opacity={isRed ? "0.55" : "0.35"}
          transform={`rotate(${(cx + cy) * 2.3}, ${cx}, ${cy})`}
        />
      ))}

      {/* Water shine highlights */}
      <ellipse cx="88" cy="88" rx="18" ry="10" fill="white" opacity=".35"
        transform="rotate(-35, 88, 88)" />
      <ellipse cx="82" cy="82" rx="8" ry="4" fill="white" opacity=".5"
        transform="rotate(-35, 82, 82)" />

      {/* Small highlight dot */}
      <circle cx="78" cy="76" r="3" fill="white" opacity=".6" />

      {/* Center cavity hint */}
      <circle cx="110" cy="110" r="8" fill={skin} opacity=".12" />
    </svg>
  );
}

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((index: number) => {
    setFading(true);
    setTimeout(() => { setCurrent(index); setFading(false); }, 200);
  }, []);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-14 sm:pt-8 sm:pb-16">
      <div
        className={`relative bg-gradient-to-br ${slide.gradient} rounded-3xl border border-pitaya-100 shadow-2xl`}
        style={{ minHeight: "380px" }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-30 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full"
            style={{ background: `radial-gradient(circle, ${slide.accentColor}30 0%, transparent 70%)` }} />
        </div>

        {/* Content grid */}
        <div className={`grid md:grid-cols-2 h-full transition-opacity duration-200 ${fading ? "opacity-0" : "opacity-100"}`}>

          {/* ── Text side ── */}
          <div className="flex flex-col justify-center p-8 sm:p-12 gap-5 relative z-10">
            {/* Tag */}
            <span className={`self-start ${slide.tag.color} text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm`}>
              {slide.tag.text}
            </span>

            {/* Typography: thin eyebrow + mixed-weight headline */}
            <div>
              <p className="text-xs sm:text-sm font-light tracking-[0.22em] uppercase text-slate-400 mb-1">
                {slide.eyebrow}
              </p>
              <h1 className="leading-none">
                <span className="block text-3xl sm:text-4xl lg:text-5xl font-thin text-dragon-dark tracking-tight">
                  {slide.headlineThin}
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight"
                  style={{ color: slide.accentColor }}>
                  {slide.headlineBold}
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dragon-dark">
                  {slide.headlineSub}
                </span>
              </h1>
            </div>

            <p className="text-slate-500 text-sm sm:text-base max-w-sm leading-relaxed">{slide.sub}</p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.ctaHref}
                className="bg-pitaya-500 text-white font-bold px-6 py-3 rounded-full hover:bg-pitaya-600 active:scale-95 transition-all shadow-lg shadow-pitaya-200 text-sm"
              >
                {slide.cta}
              </Link>
              <Link
                href={slide.ctaSecondaryHref}
                className="border-2 border-slate-200 text-slate-600 font-semibold px-5 py-3 rounded-full hover:border-pitaya-300 hover:text-pitaya-600 transition-all text-sm"
              >
                {slide.ctaSecondary}
              </Link>
            </div>
          </div>

          {/* ── Visual side: macro fruit overflowing ── */}
          <div className="hidden md:flex items-end justify-center relative overflow-visible">
            {/* Decorative circle behind fruit */}
            <div
              className="absolute w-64 h-64 rounded-full opacity-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ background: `radial-gradient(circle, ${slide.accentColor} 0%, transparent 70%)` }}
            />
            {/* Fruit SVG — overflows section bottom */}
            <div className="relative w-60 h-60 lg:w-72 lg:h-72 mb-0 translate-y-10">
              <MacroFruitSVG pattern={slide.pattern} />
            </div>
          </div>
        </div>

        {/* Prev / Next */}
        {[
          { label: "Slide trước", action: prev, side: "left-3" },
          { label: "Slide tiếp", action: next, side: "right-3" },
        ].map(({ label, action, side }) => (
          <button
            key={label}
            aria-label={label}
            onClick={action}
            className={`absolute ${side} top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md border border-slate-100 flex items-center justify-center transition-all hover:shadow-lg z-20`}
          >
            <svg className="w-4 h-4 text-dragon-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {side.startsWith("left")
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />}
            </svg>
          </button>
        ))}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-pitaya-500 w-6" : "bg-pitaya-200 w-2 hover:bg-pitaya-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
