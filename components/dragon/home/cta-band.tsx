"use client";

import { useApp } from "../app-context";
import { Icon } from "../primitives";

export function CtaBand() {
  const { t, setQuoteOpen } = useApp();

  return (
    <section style={{ background: "var(--pink-soft)", padding: "80px 0", color: "var(--ink)" }}>
      <div className="wrap home-cta-grid">
        <div className="home-cta-text">
          <h3 className="h2 home-cta-title">
            <em className="italic">{t("cta_band_title")}</em>
          </h3>
          <div className="home-cta-sub">{t("cta_band_sub")}</div>
        </div>
        <button className="btn btn-primary" onClick={() => setQuoteOpen(true)}>
          {t("hero_cta_2")} <Icon name="arrow" size={16} />
        </button>
      </div>
    </section>
  );
}
