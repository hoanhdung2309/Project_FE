"use client";

import { useApp } from "../app-context";
import { PRODUCTS } from "../data";
import { Icon, Reveal } from "../primitives";
import { ProductCard } from "../product-card";
import { SectionTitle } from "./section-title";

export function Featured() {
  const { t, addToCart, setQuoteOpen, setQuotePrefill } = useApp();
  const featured = PRODUCTS.filter((p) => p.featured);

  return (
    <section
      className="home-section-pad"
      style={{ background: "var(--ink)", color: "var(--cream-light)", padding: "120px 0" }}
    >
      <div className="wrap">
        <div className="home-featured-head">
          <div>
            <div className="eyebrow home-featured-eyebrow">{t("featured_eyebrow")}</div>
            <SectionTitle text={t("featured_title")} italicColor="var(--pink)" />
          </div>
          <div className="home-featured-sub">{t("featured_sub")}</div>
        </div>

        <div className="home-featured-grid">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 80} style={{ color: "var(--ink)" }}>
              <ProductCard
                product={p}
                onAdd={addToCart}
                onQuote={(id) => {
                  setQuotePrefill(id);
                  setQuoteOpen(true);
                }}
              />
            </Reveal>
          ))}
        </div>

        <div className="home-featured-foot">
          <a href="/products" className="btn btn-cream">
            {t("view_all")} <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
