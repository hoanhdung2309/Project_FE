"use client";

import { useApp } from "./app-context";
import { DragonLogo, Icon } from "./primitives";

export type NavActive = "home" | "products" | "about" | "contact" | "account";

export function Nav({ active }: { active?: NavActive }) {
  const { t, lang, setLang, cart, setCartOpen, darkNav } = useApp();
  const cartCount = cart.reduce((s, it) => s + it.qty, 0);
  return (
    <nav
      className="nav"
      style={
        darkNav
          ? undefined
          : {
              background: "var(--cream-light)",
              color: "var(--ink)",
              borderBottom: "1px solid var(--line)",
            }
      }
    >
      <div className="nav-inner">
        <DragonLogo onDark={darkNav} />
        <div className="nav-links">
          <a href="/" className={active === "home" ? "active" : ""}>
            {t("nav_home")}
          </a>
          <a href="/products" className={active === "products" ? "active" : ""}>
            {t("nav_product")}
          </a>
          <a href="/about" className={active === "about" ? "active" : ""}>
            {t("nav_about")}
          </a>
          <a href="/contact" className={active === "contact" ? "active" : ""}>
            {t("nav_contact")}
          </a>
        </div>
        <div className="nav-actions">
          <div className="nav-lang">
            <button className={lang === "vi" ? "active" : ""} onClick={() => setLang("vi")}>
              VI
            </button>
            <span style={{ opacity: 0.3 }}>/</span>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
              EN
            </button>
          </div>
          <a
            href="/account"
            className={`nav-icon-btn${active === "account" ? " active" : ""}`}
            aria-label={t("nav_account")}
          >
            <Icon name="user" size={16} />
            <span>{t("nav_account")}</span>
          </a>
          <button className="nav-icon-btn" onClick={() => setCartOpen(true)}>
            <Icon name="cart" size={16} />
            <span>{t("nav_cart")}</span>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}
