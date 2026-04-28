"use client";

import { useApp } from "./app-context";
import { PitayaMark } from "./primitives";

export function Footer() {
  const { t, lang } = useApp();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <PitayaMark size={36} />
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.04em" }}>D-Dragon</span>
            </div>
            <div className="footer-tagline">{t("footer_tagline")}</div>
            <div style={{ fontSize: 12, opacity: 0.5, marginTop: 16 }}>{t("footer_rights")}</div>
          </div>
          <div>
            <h5>{t("footer_shop")}</h5>
            <ul>
              <li><a href="/products">{lang === "vi" ? "Thanh long tươi" : "Fresh pitaya"}</a></li>
              <li><a href="/products">{lang === "vi" ? "Sản phẩm hữu cơ" : "Organic line"}</a></li>
              <li><a href="/products">{lang === "vi" ? "Chế biến" : "Processed"}</a></li>
              <li><a href="/products">{t("nav_quote")}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t("footer_company")}</h5>
            <ul>
              <li><a href="/about">{t("nav_about")}</a></li>
              <li><a href="/about">{lang === "vi" ? "Nông trại" : "Our farms"}</a></li>
              <li><a href="/about">{lang === "vi" ? "Chứng nhận" : "Certifications"}</a></li>
              <li><a href="/contact">{lang === "vi" ? "Tuyển dụng" : "Careers"}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t("footer_support")}</h5>
            <ul>
              <li><a href="/contact">{t("nav_contact")}</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>{t("nav_track")}</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>FAQ</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>{lang === "vi" ? "Chính sách" : "Policies"}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t("footer_follow")}</h5>
            <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>{t("footer_newsletter")}</div>
            <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
              <input placeholder={t("footer_email_ph")} />
              <button type="submit">{t("footer_subscribe")} →</button>
            </form>
            <div className="footer-social">
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11.1 22 14.3V21h-4v-5.95c0-1.42-.03-3.25-1.98-3.25-1.98 0-2.28 1.55-2.28 3.15V21h-4z" />
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} aria-label="WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.47 14.38c-.3-.15-1.74-.86-2.01-.96-.27-.1-.46-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.57-.48-.49-.66-.5-.17-.01-.37-.01-.56-.01-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3.01.15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.74-.71 1.98-1.4.24-.69.24-1.28.17-1.4-.07-.13-.27-.2-.56-.35zM12.04 2.5C6.84 2.5 2.6 6.74 2.6 11.94c0 1.66.43 3.27 1.26 4.69L2.5 21.5l5.04-1.32a9.4 9.4 0 0 0 4.5 1.15h.01c5.2 0 9.43-4.24 9.43-9.43 0-2.52-.98-4.89-2.76-6.67a9.36 9.36 0 0 0-6.68-2.73zm0 17.21h-.01a7.78 7.78 0 0 1-3.97-1.09l-.28-.17-2.99.78.8-2.92-.18-.3a7.79 7.79 0 0 1-1.19-4.13c0-4.31 3.51-7.81 7.83-7.81 2.09 0 4.05.81 5.53 2.29a7.76 7.76 0 0 1 2.29 5.53c0 4.31-3.51 7.82-7.83 7.82z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>Ho Chi Minh City • Binh Thuan • Long An</div>
          <div>hello@d-dragon.vn • +84 28 7300 9988</div>
        </div>
      </div>
    </footer>
  );
}
