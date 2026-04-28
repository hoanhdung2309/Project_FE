"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useApp } from "./app-context";
import { PRODUCTS } from "./data";
import { Icon } from "./primitives";

export function QuoteModal() {
  const { t, lang, quoteOpen, setQuoteOpen, quotePrefill } = useApp();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!quoteOpen) {
      const timer = setTimeout(() => setSent(false), 300);
      return () => clearTimeout(timer);
    }
  }, [quoteOpen]);

  function handleBackdrop(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).classList.contains("modal-backdrop")) {
      setQuoteOpen(false);
    }
  }

  return (
    <div
      className={`modal-backdrop ${quoteOpen ? "open" : ""}`}
      onClick={handleBackdrop}
    >
      <div className="modal" style={{ padding: 40 }}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--pink-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                color: "var(--magenta)",
              }}
            >
              <Icon name="check" size={32} />
            </div>
            <div className="serif" style={{ fontSize: 36, marginBottom: 8 }}>
              {t("quote_sent_title")}
            </div>
            <div style={{ color: "var(--mute)", marginBottom: 24 }}>
              {t("quote_sent_sub")}
            </div>
            <button className="btn btn-cream" onClick={() => setQuoteOpen(false)}>
              {t("cart_continue")}
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 24,
              }}
            >
              <div>
                <div className="eyebrow">{t("nav_quote")}</div>
                <div className="serif" style={{ fontSize: 36, marginTop: 6, lineHeight: 1 }}>
                  {t("quote_title")}
                </div>
                <div
                  style={{ color: "var(--mute)", marginTop: 8, fontSize: 14, maxWidth: 420 }}
                >
                  {t("quote_sub")}
                </div>
              </div>
              <button onClick={() => setQuoteOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
            >
              <div className="field" style={{ gridColumn: "span 2" }}>
                <label>{t("quote_product")}</label>
                <select defaultValue={quotePrefill ?? ""}>
                  <option value="">—</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {lang === "vi" ? p.name_vi : p.name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{t("quote_volume")}</label>
                <input type="text" placeholder="e.g. 20" required />
              </div>
              <div className="field">
                <label>{t("quote_destination")}</label>
                <input
                  type="text"
                  placeholder={lang === "vi" ? "VD: Rotterdam, Hà Lan" : "e.g. Rotterdam, NL"}
                />
              </div>
              <div className="field">
                <label>{t("quote_company")}</label>
                <input type="text" required />
              </div>
              <div className="field">
                <label>{t("quote_phone")}</label>
                <input type="tel" required />
              </div>
              <div className="field" style={{ gridColumn: "span 2" }}>
                <label>{t("quote_email")}</label>
                <input type="email" required />
              </div>
              <div className="field" style={{ gridColumn: "span 2" }}>
                <label>{t("quote_note")}</label>
                <textarea rows={3} />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ gridColumn: "span 2", justifyContent: "center", marginTop: 8 }}
              >
                {t("quote_submit")} <Icon name="arrow" size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
