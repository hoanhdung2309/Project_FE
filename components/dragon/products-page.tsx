"use client";

import { useApp } from "./app-context";
import { PRODUCTS, type Product, type ProductCategory } from "./data";
import { ProductCard } from "./product-card";
import {
  PRICE_MAX,
  PRICE_MIN,
  useProductFilters,
  type SortId,
} from "@/lib/core/products/use-product-filters";

const PRODUCT_CATEGORIES: ReadonlyArray<ProductCategory> = [
  "white",
  "red",
  "yellow",
  "organic",
  "processed",
];

const CATEGORIES: ReadonlyArray<{ id: ProductCategory | "all"; vi: string; en: string }> = [
  { id: "all", vi: "Tất cả", en: "All" },
  { id: "white", vi: "Ruột trắng", en: "White" },
  { id: "red", vi: "Ruột đỏ", en: "Red" },
  { id: "yellow", vi: "Ruột vàng", en: "Yellow" },
  { id: "organic", vi: "Hữu cơ", en: "Organic" },
  { id: "processed", vi: "Chế biến", en: "Processed" },
];

const SIZES: ReadonlyArray<Product["size"]> = ["S", "M", "L", "XL"];
const CERTS_LIST = ["VietGAP", "GlobalGAP", "USDA Organic", "EU Organic", "HACCP", "ISO 22000"];

export function ProductsPage() {
  const { t, lang, addToCart, setQuoteOpen, setQuotePrefill } = useApp();
  const { state, derived, actions } = useProductFilters({
    products: PRODUCTS,
    allCategories: PRODUCT_CATEGORIES,
  });
  const { category, size, cert, priceMax, sort } = state;
  const { counts, filtered, hasResults } = derived;

  function handleQuote(id: string) {
    setQuotePrefill(id);
    setQuoteOpen(true);
  }

  return (
    <>
      <section
        style={{
          background: "var(--cream-light)",
          padding: "80px 0 60px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            D-Dragon Catalog • 2026
          </div>
          <h1 className="h2" style={{ maxWidth: 900 }}>
            {t("prod_title")}
            <em className="italic" style={{ color: "var(--magenta)" }}>
              .
            </em>
          </h1>
          <div
            style={{
              fontSize: 16,
              color: "var(--ink-soft)",
              marginTop: 16,
              maxWidth: 560,
            }}
          >
            {t("prod_sub")}
          </div>
        </div>
      </section>

      <div
        style={{
          background: "var(--cream)",
          borderBottom: "1px solid var(--line)",
          position: "sticky",
          top: 73,
          zIndex: 20,
        }}
      >
        <div className="wrap" style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {CATEGORIES.map((c) => {
            const isActive = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => actions.setCategory(c.id)}
                style={{
                  padding: "20px 0",
                  marginRight: 32,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "var(--ink)" : "var(--mute)",
                  borderBottom: isActive
                    ? "2px solid var(--magenta)"
                    : "2px solid transparent",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                {lang === "vi" ? c.vi : c.en}{" "}
                <span style={{ color: "var(--mute)", marginLeft: 4, fontSize: 12 }}>
                  {counts[c.id]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section style={{ padding: "40px 0 120px" }}>
        <div
          className="wrap"
          style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 48 }}
        >
          <aside>
            <div style={{ position: "sticky", top: 160 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <div className="eyebrow">Filters</div>
                <button
                  onClick={actions.reset}
                  style={{ fontSize: 12, color: "var(--magenta)" }}
                >
                  {t("filter_reset")}
                </button>
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>
                  {t("filter_size")}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {SIZES.map((s) => (
                    <label
                      key={s}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={size.includes(s)}
                        onChange={() => actions.toggleSize(s)}
                        style={{ accentColor: "var(--magenta)" }}
                      />
                      {t(`size_${s.toLowerCase()}`)}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>
                  {t("filter_price")}
                </div>
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={5000}
                  value={priceMax}
                  onChange={(e) => actions.setPriceMax(+e.target.value)}
                  style={{ width: "100%", accentColor: "var(--magenta)" }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "var(--mute)",
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    marginTop: 6,
                  }}
                >
                  <span>20k</span>
                  <span style={{ color: "var(--ink)" }}>
                    ≤ {(priceMax / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 14 }}>
                  {t("filter_cert")}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {CERTS_LIST.map((c) => (
                    <label
                      key={c}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={cert.includes(c)}
                        onChange={() => actions.toggleCert(c)}
                        style={{ accentColor: "var(--magenta)" }}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 13, color: "var(--mute)" }}>
                {filtered.length} {lang === "vi" ? "sản phẩm" : "products"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--mute)",
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {t("filter_sort")}
                </span>
                <select
                  value={sort}
                  onChange={(e) => actions.setSort(e.target.value as SortId)}
                  style={{
                    border: "1px solid var(--line)",
                    padding: "8px 14px",
                    borderRadius: 100,
                    fontSize: 13,
                    background: "var(--cream-light)",
                    cursor: "pointer",
                  }}
                >
                  <option value="featured">{t("sort_featured")}</option>
                  <option value="price_asc">{t("sort_price_asc")}</option>
                  <option value="price_desc">{t("sort_price_desc")}</option>
                  <option value="new">{t("sort_new")}</option>
                </select>
              </div>
            </div>

            {hasResults ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 24,
                }}
              >
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onAdd={addToCart}
                    onQuote={handleQuote}
                  />
                ))}
              </div>
            ) : (
              <div style={{ padding: "80px 0", textAlign: "center", color: "var(--mute)" }}>
                <div
                  className="serif"
                  style={{ fontSize: 32, marginBottom: 8, color: "var(--ink)" }}
                >
                  {lang === "vi" ? "Không tìm thấy sản phẩm" : "No products found"}
                </div>
                <div style={{ fontSize: 14 }}>
                  {lang === "vi" ? "Thử điều chỉnh bộ lọc" : "Try adjusting your filters"}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
