"use client";

import { useApp } from "../app-context";
import { CERTS } from "../data";
import { Reveal } from "../primitives";
import { SectionTitle } from "./section-title";

export function Certifications() {
  const { t, lang } = useApp();

  return (
    <section
      className="home-section-pad"
      style={{ background: "var(--cream)", padding: "120px 0" }}
    >
      <div className="wrap">
        <div className="home-cert-head">
          <div>
            <div className="eyebrow home-cert-eyebrow">{t("cert_eyebrow")}</div>
            <SectionTitle text={t("cert_title")} italicColor="var(--magenta)" />
          </div>
          <div className="home-cert-sub">{t("cert_sub")}</div>
        </div>

        <div className="home-cert-grid">
          {CERTS.map((c, i) => (
            <Reveal key={c.id} delay={i * 60} className="home-cert-cell">
              <div className="home-cert-since">SINCE {c.since}</div>
              <div className="home-cert-icon-wrap">
                <div className="home-cert-icon">{c.short}</div>
              </div>
              <div>
                <div className="serif home-cert-name">{c.name}</div>
                <div className="home-cert-desc">{lang === "vi" ? c.desc_vi : c.desc_en}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
