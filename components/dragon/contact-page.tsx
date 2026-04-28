"use client";

import { useState, type FormEvent } from "react";
import { useApp } from "./app-context";
import { Icon, type IconName } from "./primitives";

interface ContactCard {
  key: "hq" | "factory" | "export";
  addr_vi: string;
  addr_en: string;
  phone: string;
  email: string;
  icon: IconName;
}

const CONTACTS: ContactCard[] = [
  {
    key: "hq",
    addr_vi: "128 Nguyễn Huệ, Q.1, TP.HCM",
    addr_en: "128 Nguyen Hue, D.1, HCMC",
    phone: "+84 28 7300 9988",
    email: "hello@d-dragon.vn",
    icon: "pin",
  },
  {
    key: "factory",
    addr_vi: "KCN Hàm Kiệm, Bình Thuận",
    addr_en: "Ham Kiem IP, Binh Thuan",
    phone: "+84 252 388 6677",
    email: "factory@d-dragon.vn",
    icon: "package",
  },
  {
    key: "export",
    addr_vi: "Tầng 8, Bitexco, Q.1, TP.HCM",
    addr_en: "Floor 8, Bitexco Tower, HCMC",
    phone: "+84 28 7300 2255",
    email: "export@d-dragon.vn",
    icon: "globe",
  },
];

export function ContactPage() {
  const { t, lang, showToast } = useApp();
  const [sent, setSent] = useState(false);
  const titleLines = t("contact_title").split("\n");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    showToast(lang === "vi" ? "Đã gửi tin nhắn" : "Message sent");
    setTimeout(() => setSent(false), 3000);
    e.currentTarget.reset();
  }

  return (
    <>
      <section style={{ background: "var(--cream)", padding: "100px 0 60px" }}>
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: 80,
              alignItems: "end",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>
                {t("contact_eyebrow")}
              </div>
              <h1
                className="display"
                style={{ fontSize: "clamp(52px, 7vw, 96px)", whiteSpace: "pre-line" }}
              >
                {titleLines.map((line, i) => (
                  <div key={line}>
                    {i === 1 ? (
                      <em className="italic" style={{ color: "var(--magenta)" }}>
                        {line}
                      </em>
                    ) : (
                      line
                    )}
                  </div>
                ))}
              </h1>
            </div>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--ink-soft)",
                maxWidth: 440,
              }}
            >
              {t("contact_sub")}
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: "var(--cream)", padding: "40px 0 80px" }}>
        <div className="wrap">
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}
          >
            {CONTACTS.map((c) => (
              <div
                key={c.key}
                style={{
                  padding: 32,
                  background: "var(--cream-light)",
                  border: "1px solid var(--line)",
                  borderRadius: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "var(--pink-soft)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--magenta)",
                    }}
                  >
                    <Icon name={c.icon} size={16} />
                  </div>
                  <div className="eyebrow">{t(`contact_${c.key}`)}</div>
                </div>
                <div
                  className="serif"
                  style={{ fontSize: 22, lineHeight: 1.2, minHeight: 52 }}
                >
                  {lang === "vi" ? c.addr_vi : c.addr_en}
                </div>
                <div
                  style={{
                    borderTop: "1px solid var(--line)",
                    paddingTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <a
                    href={`tel:${c.phone}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 14,
                      color: "var(--ink-soft)",
                    }}
                  >
                    <Icon name="phone" size={14} /> {c.phone}
                  </a>
                  <a
                    href={`mailto:${c.email}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      fontSize: 14,
                      color: "var(--ink-soft)",
                    }}
                  >
                    <Icon name="mail" size={14} /> {c.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "var(--cream-light)", padding: "100px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                {t("contact_form_title")}
              </div>
              <h2 className="h3" style={{ marginBottom: 32, maxWidth: 380 }}>
                {lang === "vi"
                  ? "Điền vào bên dưới — chúng tôi phản hồi trong 4 giờ."
                  : "Drop a line — we respond within 4 hours."}
              </h2>
              <form
                onSubmit={handleSubmit}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
              >
                <div className="field" style={{ gridColumn: "span 2" }}>
                  <label>{t("contact_name")}</label>
                  <input required />
                </div>
                <div className="field">
                  <label>{t("quote_company")}</label>
                  <input />
                </div>
                <div className="field">
                  <label>{t("quote_email")}</label>
                  <input type="email" required />
                </div>
                <div className="field" style={{ gridColumn: "span 2" }}>
                  <label>{t("contact_subject")}</label>
                  <select>
                    <option>
                      {lang === "vi" ? "Yêu cầu báo giá sỉ" : "Wholesale quote"}
                    </option>
                    <option>
                      {lang === "vi" ? "Hợp tác phân phối" : "Distribution partnership"}
                    </option>
                    <option>{lang === "vi" ? "Hỗ trợ đơn hàng" : "Order support"}</option>
                    <option>{lang === "vi" ? "Khác" : "Other"}</option>
                  </select>
                </div>
                <div className="field" style={{ gridColumn: "span 2" }}>
                  <label>{t("contact_message")}</label>
                  <textarea rows={4} required />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    gridColumn: "span 2",
                    justifyContent: "center",
                    marginTop: 8,
                  }}
                  disabled={sent}
                >
                  {sent ? (
                    <>
                      <Icon name="check" size={16} />{" "}
                      {lang === "vi" ? "Đã gửi" : "Sent"}
                    </>
                  ) : (
                    <>
                      {t("contact_send")} <Icon name="arrow" size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div
                style={{
                  aspectRatio: "1/1",
                  borderRadius: 20,
                  background: "linear-gradient(160deg, #EFEADE, #DDD4BE)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                >
                  <defs>
                    <pattern
                      id="contact-grid"
                      width="5"
                      height="5"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 5 0 L 0 0 0 5"
                        stroke="rgba(26,26,26,0.04)"
                        strokeWidth="0.3"
                        fill="none"
                      />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#contact-grid)" />
                  <path
                    d="M 0,40 Q 30,35 50,50 T 100,55"
                    stroke="var(--cream)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 20,0 Q 25,40 45,60 T 55,100"
                    stroke="var(--cream)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 0,70 L 100,72"
                    stroke="var(--cream)"
                    strokeWidth="1"
                    fill="none"
                  />
                  <path
                    d="M 60,0 L 62,100"
                    stroke="var(--cream)"
                    strokeWidth="1"
                    fill="none"
                  />
                  <rect x="15" y="20" width="15" height="12" rx="1" fill="rgba(26,26,26,0.04)" />
                  <rect x="35" y="45" width="18" height="14" rx="1" fill="rgba(26,26,26,0.04)" />
                  <rect x="65" y="30" width="20" height="15" rx="1" fill="rgba(26,26,26,0.04)" />
                  <rect x="30" y="75" width="12" height="10" rx="1" fill="rgba(26,26,26,0.04)" />
                  <rect x="70" y="80" width="20" height="12" rx="1" fill="rgba(26,26,26,0.04)" />
                  <g>
                    <circle cx="50" cy="52" r="10" fill="var(--magenta)" opacity="0.15" />
                    <circle cx="50" cy="52" r="5" fill="var(--magenta)" opacity="0.3" />
                    <circle cx="50" cy="52" r="2.5" fill="var(--magenta)" />
                  </g>
                </svg>
                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    color: "var(--mute)",
                  }}
                >
                  10.7769° N, 106.7009° E
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    background: "var(--ink)",
                    color: "var(--cream-light)",
                    padding: "8px 14px",
                    borderRadius: 100,
                    fontSize: 11,
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    letterSpacing: "0.1em",
                  }}
                >
                  HO CHI MINH HQ
                </div>
              </div>
              <div
                style={{
                  padding: 32,
                  background: "var(--ink)",
                  color: "var(--cream-light)",
                  borderRadius: 20,
                }}
              >
                <div
                  className="eyebrow"
                  style={{ color: "var(--pink-deep)", marginBottom: 12 }}
                >
                  {t("contact_hours")}
                </div>
                <div className="serif" style={{ fontSize: 26, lineHeight: 1.2 }}>
                  {t("contact_hours_val")}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button
                    className="btn btn-sm"
                    style={{ background: "var(--pink)", color: "var(--ink)" }}
                  >
                    <Icon name="chat" size={14} />{" "}
                    {lang === "vi" ? "Chat ngay" : "Live chat"}
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{
                      border: "1px solid rgba(255,255,255,0.3)",
                      color: "var(--cream-light)",
                    }}
                  >
                    <Icon name="phone" size={14} /> WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
