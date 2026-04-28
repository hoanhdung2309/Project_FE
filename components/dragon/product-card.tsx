"use client";

import Image from "next/image";
import { useState } from "react";
import { useApp } from "./app-context";
import type { Product, ProductCategory } from "./data";
import { formatVND } from "./data";
import { Icon } from "./primitives";

const PRODUCT_PHOTO: Record<ProductCategory, { src: string; alt: string }> = {
  white: { src: "/assets/images/pitaya-white.webp", alt: "Thanh long ruột trắng" },
  red: { src: "/assets/images/pitaya-red.webp", alt: "Thanh long ruột đỏ" },
  yellow: { src: "/assets/images/pitaya-yellow.webp", alt: "Thanh long ruột vàng Ecuador" },
  organic: { src: "/assets/images/pitaya-organic.webp", alt: "Thanh long hữu cơ" },
  processed: { src: "/assets/images/pitaya-processed.webp", alt: "Thanh long da xanh" },
};

export function ProductCard({
  product,
  onAdd,
  onQuote,
}: {
  product: Product;
  onAdd: (product: Product, qty: number) => void;
  onQuote: (id: string) => void;
}) {
  const { lang, t } = useApp();
  const [qty, setQty] = useState(product.minOrder);
  const [hover, setHover] = useState(false);
  const photo = PRODUCT_PHOTO[product.category];
  const name = lang === "vi" ? product.name_vi : product.name_en;
  const desc = lang === "vi" ? product.desc_vi : product.desc_en;
  const cat = lang === "vi" ? product.cat_vi : product.cat_en;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--cream-light)",
        border: "1px solid var(--line)",
        borderRadius: 20,
        overflow: "hidden",
        transition: "all 0.3s",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "0 20px 40px -20px rgba(0,0,0,0.15)" : "none",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "1/1",
          background: `linear-gradient(160deg, #FAF7EF 0%, ${product.color}33 100%)`,
          overflow: "hidden",
        }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{
            objectFit: "cover",
            transition: "transform 0.5s cubic-bezier(.2,.8,.2,1)",
            transform: hover ? "scale(1.06)" : "scale(1)",
          }}
        />
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
          {product.stock === "low" && <span className="tag tag-stock-low">{t("low_stock")}</span>}
          {product.certs.slice(0, 2).map((c) => (
            <span className="tag" key={c}>
              {c}
            </span>
          ))}
        </div>
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <span className="tag" style={{ background: "var(--ink)", color: "var(--cream-light)", borderColor: "var(--ink)" }}>
            {cat}
          </span>
        </div>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="serif" style={{ fontSize: 24, lineHeight: 1.1 }}>
          {name}
        </div>
        <div style={{ fontSize: 13, color: "var(--mute)", lineHeight: 1.5, minHeight: 40 }}>
          {desc.slice(0, 90)}…
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, borderTop: "1px solid var(--line)" }}>
          <div>
            <span className="serif" style={{ fontSize: 28 }}>{formatVND(product.price)}</span>
            <span style={{ fontSize: 12, color: "var(--mute)", marginLeft: 4 }}>{t("per_kg")}</span>
          </div>
          <div style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace", fontSize: 10, letterSpacing: "0.1em", color: "var(--mute)", textTransform: "uppercase" }}>
            {t("min_order")} {product.minOrder}
            {t("kg")}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <div className="qty" style={{ flex: "0 0 auto" }}>
            <button onClick={() => setQty(Math.max(product.minOrder, qty - 10))}>
              <Icon name="minus" size={12} />
            </button>
            <span>
              {qty} {t("kg")}
            </span>
            <button onClick={() => setQty(qty + 10)}>
              <Icon name="plus" size={12} />
            </button>
          </div>
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={() => onAdd(product, qty)}
          >
            {t("add_to_cart")}
          </button>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ padding: "6px 0", fontSize: 12, justifyContent: "flex-start" }}
          onClick={() => onQuote(product.id)}
        >
          {t("request_quote")} →
        </button>
      </div>
    </div>
  );
}
