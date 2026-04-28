"use client";

import { useApp } from "./app-context";
import { formatVND } from "./data";
import { Fruit, Icon } from "./primitives";

export function CartDrawer() {
  const { t, lang, cart, cartOpen, setCartOpen, updateQty, removeFromCart } = useApp();
  const subtotal = cart.reduce((s, it) => s + it.qty * it.product.price, 0);
  const hasItems = cart.length > 0;

  return (
    <>
      <div
        className={`drawer-backdrop ${cartOpen ? "open" : ""}`}
        onClick={() => setCartOpen(false)}
      />
      <aside className={`drawer ${cartOpen ? "open" : ""}`}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow">{t("nav_cart")}</div>
            <div className="serif" style={{ fontSize: 28, marginTop: 4 }}>
              {t("cart_title")}
            </div>
          </div>
          <button onClick={() => setCartOpen(false)}>
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-body">
          {!hasItems ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <div className="serif" style={{ fontSize: 26, marginBottom: 8 }}>
                {t("cart_empty")}
              </div>
              <div style={{ color: "var(--mute)", fontSize: 14 }}>{t("cart_empty_sub")}</div>
            </div>
          ) : (
            cart.map((it) => {
              const name = lang === "vi" ? it.product.name_vi : it.product.name_en;
              return (
                <div className="cart-item" key={it.id}>
                  <div className="cart-item-img">
                    <Fruit variant={it.product.category} size={50} />
                  </div>
                  <div className="cart-item-body">
                    <div className="cart-item-name">{name}</div>
                    <div className="cart-item-meta">
                      {formatVND(it.product.price)} {t("per_kg")}
                    </div>
                    <div className="cart-item-foot">
                      <div className="qty">
                        <button onClick={() => updateQty(it.id, it.qty - 10)}>
                          <Icon name="minus" size={12} />
                        </button>
                        <span>
                          {it.qty} {t("kg")}
                        </span>
                        <button onClick={() => updateQty(it.id, it.qty + 10)}>
                          <Icon name="plus" size={12} />
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>
                          {formatVND(it.qty * it.product.price)}
                        </div>
                        <button
                          onClick={() => removeFromCart(it.id)}
                          style={{ color: "var(--mute)" }}
                        >
                          <Icon name="close" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {hasItems && (
          <div className="drawer-foot">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "var(--mute)",
                marginBottom: 6,
              }}
            >
              <span>{t("cart_subtotal")}</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "var(--mute)",
                marginBottom: 12,
              }}
            >
              <span>{t("cart_shipping")}</span>
              <span>{t("cart_shipping_calc")}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                paddingTop: 12,
                borderTop: "1px solid var(--line)",
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 14 }}>{t("cart_total")}</span>
              <span className="serif" style={{ fontSize: 24 }}>
                {formatVND(subtotal)}
              </span>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              {t("cart_checkout")} <Icon name="arrow" size={16} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
