"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { ShoppingCart, Minus, Plus, Package, Loader2, AlertCircle, Tag } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useEffectivePrice } from "@/lib/core/pricing/use-effective-price";
import { useProductsQuery } from "@/lib/core/products/use-products";
import { getDisplayPrice } from "@/lib/core/products/tier";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Product, PriceTier } from "@/types";

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-20 bg-slate-50 rounded" />
        <div className="h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

function PriceTierTable({ tiers, activeLabel }: { tiers: PriceTier[]; activeLabel?: string }) {
  const t = useTranslations("shop");
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden text-xs">
      <div className="bg-slate-50 px-3 py-1.5 font-semibold text-slate-500 flex items-center gap-1">
        <Tag className="w-3 h-3" /> {t("priceTierTitle")}
      </div>
      {tiers.map((tier) => {
        const isActive = tier.label === activeLabel;
        return (
          <div
            key={`${tier.minQuantity}-${tier.price}`}
            className={`flex items-center justify-between px-3 py-1.5 border-t border-slate-100 transition-colors ${
              isActive
                ? "bg-pitaya-50 text-pitaya-700 font-semibold"
                : "text-slate-600"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-pitaya-500 inline-block" />
              )}
              {tier.label}
              <span className="text-slate-400">
                (≥ {tier.minQuantity.toLocaleString("vi-VN")} {" "}
                {tier.maxQuantity ? `– ${tier.maxQuantity.toLocaleString("vi-VN")}` : "+"})
              </span>
            </span>
            <span className={isActive ? "text-pitaya-600" : ""}>
              {formatVND(tier.price)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const BADGE_COLORS: Record<string, string> = {
  "Lô mới":    "bg-cactus-100 text-cactus-600",
  "Hot":       "bg-pitaya-100 text-pitaya-600",
  "Xuất khẩu":"bg-blue-100 text-blue-600",
  "Mới":       "bg-violet-100 text-violet-600",
};

const CATEGORY_KEYS = [
  "categoryAll",
  "categoryRedFlesh",
  "categoryWhiteFlesh",
  "categoryExport",
  "categoryB",
  "categoryProcessed",
] as const;

export default function ShopPage() {
  const t = useTranslations("shop");
  const { data: productsData, isLoading, isError } = useProductsQuery();
  const products = productsData ?? [];

  /* Per-product quantity state */
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const setQty = useCallback((productId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(0, qty) }));
  }, []);

  const { cartCount, addItem: addToCartItem } = useCart();

  /* Build items array for effective price hook */
  const priceItems = products.map((p) => ({
    productId: p.id,
    quantity: quantities[p.id] ?? 0,
  }));

  const { priceMap, isLoading: priceLoading } = useEffectivePrice(priceItems);

  function addToCart(product: Product) {
    const qty = quantities[product.id] ?? 0;
    if (qty === 0) {
      toast.warning(t("toastEnterQuantity"));
      return;
    }
    addToCartItem(product.id, qty);
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
    toast.success(t("toastAddedToCart", { qty, unit: product.unit, name: product.name }));
  }

  return (
    <div className="relative min-h-screen bg-dragon-base overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]">
        <div className="blob-pitaya animate-blob absolute -top-16 right-[6%] h-[320px] w-[320px] rounded-full" />
        <div className="blob-cactus animate-blob absolute top-24 -left-20 h-[280px] w-[280px] rounded-full" />
      </div>
      <Header />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8 gap-4 animate-fade-in-up">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-pitaya-500 mb-1">{t("eyebrow")}</p>
            <h1 className="text-3xl sm:text-4xl font-black text-dragon-dark tracking-tight">
              {t("titlePrefix")} <span className="text-gradient-pitaya">{t("titleHighlight")}</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2">
              {t("subtitle")}
            </p>
          </div>

          {/* Cart button */}
          <Button variant="outline" className="relative shrink-0" asChild>
            <Link href="/cart">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">{t("cart")}</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pitaya-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORY_KEYS.map((catKey) => (
            <button
              key={catKey}
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200 bg-white hover:border-pitaya-400 hover:text-pitaya-600 transition-all first:bg-pitaya-500 first:text-white first:border-pitaya-500"
            >
              {t(catKey)}
            </button>
          ))}
        </div>

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <AlertCircle className="w-12 h-12" />
            <p>{t("errorLoading")}</p>
          </div>
        )}

        {/* Price loading indicator */}
        {priceLoading && (
          <div className="flex items-center gap-2 text-pitaya-600 text-sm mb-4 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("priceUpdating")}
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => {
                const qty = quantities[product.id] ?? 0;
                const { price: displayPrice, tierLabel: displayTierLabel } =
                  getDisplayPrice(product, qty, priceMap);
                const subtotal = displayPrice * qty;

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover-lift"
                  >
                    {/* Product image area */}
                    <div className="relative h-48 bg-gradient-pitaya-soft flex items-center justify-center overflow-hidden">
                      <div aria-hidden className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/40 blur-2xl" />
                      <Package className="relative w-24 h-24 text-pitaya-300 drop-shadow-sm" strokeWidth={1} />
                      {product.badge && (
                        <span
                          className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold ${
                            BADGE_COLORS[product.badge] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}
                      <Badge
                        className="absolute top-3 right-3"
                        variant="default"
                      >
                        {product.category}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-dragon-dark">{product.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{product.description}</p>
                      </div>

                      {/* Price tier table */}
                      <PriceTierTable
                        tiers={product.priceTiers ?? []}
                        activeLabel={displayTierLabel}
                      />

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 shrink-0">{t("quantityLabel")}</span>
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setQty(product.id, qty - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input
                            type="number"
                            min={0}
                            max={product.stockQuantity}
                            value={qty || ""}
                            placeholder="0"
                            onChange={(e) =>
                              setQty(product.id, parseInt(e.target.value) || 0)
                            }
                            className="w-16 text-center text-sm font-semibold border-x border-slate-200 h-8 focus:outline-none focus:bg-pitaya-50"
                          />
                          <button
                            onClick={() => setQty(product.id, qty + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs text-slate-400">{product.unit}</span>
                      </div>

                      {/* Real-time effective price display */}
                      {qty > 0 && (
                        <div className="bg-pitaya-50 rounded-xl px-3 py-2 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-500">
                              {t("priceLabel")} {displayTierLabel && <span className="font-semibold text-pitaya-600">[{displayTierLabel}]</span>}
                            </p>
                            <p className="text-lg font-extrabold text-pitaya-600">
                              {formatVND(displayPrice)}
                              <span className="text-xs font-normal text-slate-400">/{product.unit}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">{t("subtotal")}</p>
                            <p className="text-sm font-bold text-dragon-dark">
                              {formatVND(subtotal)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Add to cart button */}
                      <Button
                        variant="success"
                        className="w-full"
                        onClick={() => addToCart(product)}
                        disabled={qty === 0}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {qty === 0 ? t("enterQuantity") : t("quickAdd")}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
