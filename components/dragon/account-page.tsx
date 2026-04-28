"use client";

import { useMemo } from "react";
import { useApp } from "./app-context";
import { Icon, type IconName } from "./primitives";
import { useAuth } from "@/contexts/AuthContext";
import { formatShortDate } from "@/lib/utils/date";

type OrderStatus = "delivered" | "shipping" | "processing" | "quote";

interface MockOrder {
  id: string;
  date: string;
  product_vi: string;
  product_en: string;
  volume: number;
  total: number;
  status: OrderStatus;
}

interface MockAddress {
  id: string;
  label_vi: string;
  label_en: string;
  addr_vi: string;
  addr_en: string;
  isDefault: boolean;
}

interface AccountAction {
  key: "profile" | "password" | "addresses" | "billing";
  href: string;
  icon: IconName;
}

const ORDERS: MockOrder[] = [
  {
    id: "DD-2604-118",
    date: "2026-04-22",
    product_vi: "Thanh long ruột đỏ — Long An",
    product_en: "Red Flesh Pitaya — Long An",
    volume: 18,
    total: 612000000,
    status: "shipping",
  },
  {
    id: "DD-2604-094",
    date: "2026-04-10",
    product_vi: "Thanh long ruột trắng — Bình Thuận",
    product_en: "White Flesh Pitaya — Binh Thuan",
    volume: 24,
    total: 768000000,
    status: "delivered",
  },
  {
    id: "DD-2604-082",
    date: "2026-04-02",
    product_vi: "Thanh long ruột vàng Jumbo",
    product_en: "Yellow Pitaya — Jumbo grade",
    volume: 6,
    total: 360000000,
    status: "delivered",
  },
  {
    id: "DD-2604-061",
    date: "2026-03-21",
    product_vi: "Thanh long Organic — Trà Vinh",
    product_en: "Organic Pitaya — Tra Vinh",
    volume: 12,
    total: 540000000,
    status: "processing",
  },
  {
    id: "DD-2604-053",
    date: "2026-03-15",
    product_vi: "Bột thanh long sấy lạnh",
    product_en: "Freeze-dried pitaya powder",
    volume: 2,
    total: 184000000,
    status: "quote",
  },
];

const ADDRESSES: MockAddress[] = [
  {
    id: "addr-rotterdam",
    label_vi: "Kho Rotterdam, Hà Lan",
    label_en: "Rotterdam Warehouse, Netherlands",
    addr_vi: "Maasvlakte 2, Cảng Rotterdam, 3199 LA",
    addr_en: "Maasvlakte 2, Port of Rotterdam, 3199 LA",
    isDefault: true,
  },
  {
    id: "addr-singapore",
    label_vi: "Trung tâm phân phối Singapore",
    label_en: "Singapore Distribution Hub",
    addr_vi: "Tuas South Avenue 5, 637606",
    addr_en: "Tuas South Avenue 5, 637606",
    isDefault: false,
  },
  {
    id: "addr-tokyo",
    label_vi: "Văn phòng Tokyo, Nhật Bản",
    label_en: "Tokyo Office, Japan",
    addr_vi: "Ohta-ku, Heiwajima 6-1-1, 143-0006",
    addr_en: "Ohta-ku, Heiwajima 6-1-1, 143-0006",
    isDefault: false,
  },
];

const ACTIONS: AccountAction[] = [
  { key: "profile", href: "/account/profile", icon: "user" },
  { key: "password", href: "/account/change-password", icon: "check" },
  { key: "addresses", href: "/account#addresses", icon: "pin" },
  { key: "billing", href: "/account#billing", icon: "package" },
];

const STATUS_TONES: Record<OrderStatus, { fg: string; bg: string; border: string }> = {
  delivered: { fg: "var(--leaf)", bg: "rgba(74,107,72,0.12)", border: "var(--leaf-soft)" },
  shipping: { fg: "var(--magenta)", bg: "var(--pink-soft)", border: "var(--pink-deep)" },
  processing: { fg: "#A05000", bg: "#FBEAD8", border: "#D49060" },
  quote: { fg: "var(--ink-soft)", bg: "var(--cream-light)", border: "var(--line)" },
};

function formatVnd(value: number, lang: "vi" | "en") {
  const locale = lang === "vi" ? "vi-VN" : "en-US";
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);
}

export function AccountPage() {
  const { t, lang } = useApp();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const stats = useMemo(() => {
    const totalVolume = ORDERS.reduce((sum, o) => sum + o.volume, 0);
    return [
      { key: "orders", value: String(ORDERS.length).padStart(2, "0"), label: t("account_stat_orders") },
      {
        key: "volume",
        value: totalVolume.toString(),
        label: `${t("account_stat_volume")} (${t("account_stat_volume_unit")})`,
      },
      { key: "countries", value: "12", label: t("account_stat_countries") },
      { key: "since", value: "03", label: t("account_stat_since") },
    ];
  }, [t]);

  if (isLoading) {
    return <AccountLoading message={t("account_loading")} />;
  }

  if (!isAuthenticated || !user) {
    return <AccountSignInPrompt />;
  }

  const displayName = user.displayName || user.email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();
  const company = user.email.split("@")[1]?.split(".")[0] ?? "D-Dragon Partner";

  return (
    <>
      {/* ── HERO ────────────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "100px 0 60px" }}>
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 80,
              alignItems: "end",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 20 }}>
                {t("account_eyebrow")}
              </div>
              <h1
                className="display"
                style={{ fontSize: "clamp(48px, 6.5vw, 96px)" }}
              >
                {t("account_welcome_back")},
                <br />
                <em className="italic" style={{ color: "var(--magenta)" }}>
                  {displayName}
                </em>
                .
              </h1>
            </div>
            <div
              style={{
                background: "var(--cream-light)",
                border: "1px solid var(--line)",
                borderRadius: 24,
                padding: 32,
                display: "flex",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "linear-gradient(135deg, var(--pink-deep), var(--magenta))",
                  color: "var(--cream-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  fontWeight: 600,
                }}
              >
                {initial}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className="serif" style={{ fontSize: 20, lineHeight: 1.2 }}>
                  {company.toUpperCase()}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                  {user.email}
                </div>
                <div
                  className="mono"
                  style={{ marginTop: 8, color: "var(--magenta)" }}
                >
                  {t("account_tier_gold")} • {t("account_member_since")} 2023
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "20px 0 80px" }}>
        <div className="wrap">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
              borderTop: "1px solid var(--line)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.key}
                style={{
                  padding: "32px 28px",
                  borderRight:
                    i < stats.length - 1 ? "1px solid var(--line)" : "none",
                }}
              >
                <div
                  className="serif"
                  style={{
                    fontSize: 56,
                    lineHeight: 1,
                    color: "var(--magenta)",
                    marginBottom: 12,
                  }}
                >
                  {s.value}
                </div>
                <div className="eyebrow">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECENT ORDERS ───────────────────────────────── */}
      <section style={{ background: "var(--cream-light)", padding: "100px 0" }}>
        <div className="wrap">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 40,
              gap: 24,
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                {t("account_orders_eyebrow")}
              </div>
              <h2 className="h2">
                {t("account_orders_title")}
                <em className="italic" style={{ color: "var(--magenta)" }}>
                  .
                </em>
              </h2>
            </div>
            <a href="/products" className="btn btn-ghost" style={{ padding: 0 }}>
              {t("account_orders_view_all")} <Icon name="arrow" size={16} />
            </a>
          </div>

          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: 20,
              overflow: "hidden",
              background: "var(--cream)",
            }}
          >
            <div
              className="mono"
              style={{
                display: "grid",
                gridTemplateColumns: "120px 110px 1fr 110px 160px 140px",
                gap: 24,
                padding: "16px 28px",
                borderBottom: "1px solid var(--line)",
                background: "var(--cream-light)",
                color: "var(--mute)",
              }}
            >
              <div>{t("account_orders_col_id")}</div>
              <div>{t("account_orders_col_date")}</div>
              <div>{t("account_orders_col_product")}</div>
              <div>{t("account_orders_col_volume")}</div>
              <div>{t("account_orders_col_total")}</div>
              <div>{t("account_orders_col_status")}</div>
            </div>
            {ORDERS.map((o, i) => {
              const tone = STATUS_TONES[o.status];
              return (
                <div
                  key={o.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 110px 1fr 110px 160px 140px",
                    gap: 24,
                    padding: "22px 28px",
                    borderBottom:
                      i < ORDERS.length - 1 ? "1px solid var(--line-soft)" : "none",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                      fontSize: 13,
                      color: "var(--ink)",
                    }}
                  >
                    {o.id}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                    {formatShortDate(o.date, lang)}
                  </div>
                  <div className="serif" style={{ fontSize: 16 }}>
                    {lang === "vi" ? o.product_vi : o.product_en}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                    {o.volume} {t("account_stat_volume_unit")}
                  </div>
                  <div
                    className="serif"
                    style={{ fontSize: 16, color: "var(--ink)" }}
                  >
                    ₫{formatVnd(o.total, lang)}
                  </div>
                  <div>
                    <span
                      className="tag"
                      style={{
                        color: tone.fg,
                        background: tone.bg,
                        borderColor: tone.border,
                      }}
                    >
                      {t(`account_status_${o.status}`)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ADDRESSES & ACTIONS ─────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "100px 0" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 60 }}>
            {/* Addresses */}
            <div id="addresses">
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                {t("account_address_eyebrow")}
              </div>
              <h2 className="h3" style={{ marginBottom: 32 }}>
                {t("account_address_title")}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {ADDRESSES.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      padding: 24,
                      border: "1px solid var(--line)",
                      borderRadius: 16,
                      background: "var(--cream-light)",
                      display: "flex",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "var(--pink-soft)",
                        color: "var(--magenta)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name="pin" size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 6,
                        }}
                      >
                        <div className="serif" style={{ fontSize: 18 }}>
                          {lang === "vi" ? a.label_vi : a.label_en}
                        </div>
                        {a.isDefault && (
                          <span
                            className="tag tag-pink"
                            style={{ padding: "3px 8px", fontSize: 9 }}
                          >
                            {t("account_address_default")}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "var(--ink-soft)",
                          lineHeight: 1.5,
                        }}
                      >
                        {lang === "vi" ? a.addr_vi : a.addr_en}
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-cream"
                  style={{ alignSelf: "flex-start", marginTop: 8 }}
                >
                  <Icon name="plus" size={14} /> {t("account_address_add")}
                </button>
              </div>
            </div>

            {/* Actions sidebar */}
            <div
              id="billing"
              style={{
                background: "var(--ink)",
                color: "var(--cream-light)",
                borderRadius: 24,
                padding: 40,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                alignSelf: "start",
              }}
            >
              <div>
                <div
                  className="eyebrow"
                  style={{ color: "var(--pink-deep)", marginBottom: 12 }}
                >
                  {t("account_actions_eyebrow")}
                </div>
                <div className="serif" style={{ fontSize: 28, lineHeight: 1.1 }}>
                  {t("account_actions_title")}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ACTIONS.map((a) => (
                  <a
                    key={a.key}
                    href={a.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 16px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      transition: "background 0.2s, border-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.borderColor = "var(--pink-deep)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "rgba(244,194,215,0.12)",
                        color: "var(--pink)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={a.icon} size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="serif" style={{ fontSize: 16, marginBottom: 2 }}>
                        {t(`account_action_${a.key}`)}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.4 }}>
                        {t(`account_action_${a.key}_desc`)}
                      </div>
                    </div>
                    <Icon name="arrow" size={14} />
                  </a>
                ))}
              </div>

              <button
                onClick={() => logout()}
                className="btn"
                style={{
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: "var(--cream-light)",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <Icon name="close" size={14} /> {t("account_logout")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AccountLoading({ message }: { message: string }) {
  return (
    <section
      style={{
        background: "var(--cream)",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "2px solid var(--line)",
            borderTopColor: "var(--magenta)",
            animation: "ddSpin 0.8s linear infinite",
          }}
        />
        <div className="mono" style={{ color: "var(--mute)" }}>
          {message}
        </div>
      </div>
      <style>{`@keyframes ddSpin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}

function AccountSignInPrompt() {
  const { t } = useApp();
  return (
    <section style={{ background: "var(--cream)", padding: "120px 0" }}>
      <div className="wrap">
        <div
          style={{
            maxWidth: 520,
            margin: "0 auto",
            background: "var(--cream-light)",
            border: "1px solid var(--line)",
            borderRadius: 24,
            padding: 48,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--pink-soft)",
              color: "var(--magenta)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <Icon name="user" size={22} />
          </div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            {t("account_eyebrow")}
          </div>
          <h2 className="h3" style={{ marginBottom: 16 }}>
            {t("account_login_required")}
          </h2>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            <a href="/login" className="btn btn-primary">
              {t("account_login_cta")} <Icon name="arrow" size={16} />
            </a>
            <a href="/register" className="btn btn-cream">
              {t("account_register_cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
