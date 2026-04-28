"use client";

import Image from "next/image";
import { useApp } from "../app-context";
import { Icon } from "../primitives";

const STATS_KEYS = ["hero_stat_1", "hero_stat_2", "hero_stat_3", "hero_stat_4"] as const;
const STAT_VALUES = ["12,400", "28", "120+", "15"] as const;

const HERO_FRUIT = {
  src: "/assets/images/hero-pitaya.webp",
  alt: "Thanh long ruột đỏ tươi căng mọng — D-Dragon",
  width: 925,
  height: 557,
} as const;

export function Hero() {
  const { t, setQuoteOpen } = useApp();

  return (
    <section style={{ background: "var(--cream)", paddingBottom: 80 }}>
      <div className="wrap" style={{ paddingTop: 40 }}>
        <div className="home-hero-grid">
          <div>
            <div className="eyebrow home-hero-eyebrow">{t("hero_eyebrow")}</div>
            <h1 className="display home-hero-title">
              <span className="line">{t("hero_title_1")}</span>
              <span className="line">
                <em className="italic">{t("hero_title_2")}</em>
              </span>
              <span className="line">{t("hero_title_3")}</span>
              <span className="line">{t("hero_title_4")}</span>
            </h1>
            <p className="home-hero-sub">{t("hero_sub")}</p>
            <div className="home-hero-actions">
              <a href="/products" className="btn btn-primary">
                {t("hero_cta_1")} <Icon name="arrow" size={16} />
              </a>
              <button className="btn btn-outline" onClick={() => setQuoteOpen(true)}>
                {t("hero_cta_2")}
              </button>
            </div>
          </div>

          <div className="home-hero-art">
            <div className="home-hero-fruit-single">
              <Image
                src={HERO_FRUIT.src}
                alt={HERO_FRUIT.alt}
                fill
                sizes="(max-width: 1024px) 80vw, 45vw"
                className="hero-fruit-img"
                priority
              />
            </div>
          </div>
          <svg viewBox="0 0 200 200" className="home-hero-ring" aria-hidden="true">
            <defs>
              <path id="circ" d="M 100,100 m -86,0 a 86,86 0 1,1 172,0 a 86,86 0 1,1 -172,0" />
            </defs>
            <text
              fontSize="9"
              fontFamily="ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
              letterSpacing="3.5"
              fill="var(--ink-soft)"
            >
              <textPath href="#circ">
                PREMIUM PITAYA • SINCE 2011 • PREMIUM PITAYA • SINCE 2011 •{" "}
              </textPath>
            </text>
          </svg>
        </div>

        <div className="home-hero-stats">
          {STATS_KEYS.map((key, i) => (
            <div key={key} className="home-stat">
              <div className="home-stat-num">{STAT_VALUES[i]}</div>
              <div className="home-stat-label">{t(key)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
