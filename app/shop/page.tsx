"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Minus, Plus, Package, Loader2, AlertCircle, Tag } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { useCart } from "@/contexts/CartContext";
import { useEffectivePrice } from "@/hooks/useEffectivePrice";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Product, PriceTier, ProductResponse } from "@/types";

/** Tier từ API: unitPrice, tierName (backend) */
type ApiTier = { minQuantity: number; unitPrice: number; tierName?: string };

/** Chuyển response API sang Product: priceTiers từ API (unitPrice, tierName) → price, label + maxQuantity */
function apiProductToProduct(res: ProductResponse & { priceTiers?: ApiTier[] }): Product {
  const raw = res.priceTiers ?? (res as { wholesalePrices?: ApiTier[] }).wholesalePrices ?? [];
  const tiers: PriceTier[] = [];
  if (raw.length === 0) {
    tiers.push({ minQuantity: 1, price: res.baseRetailPrice, label: "Lẻ" });
  } else {
    const sorted = [...raw].sort((a, b) => a.minQuantity - b.minQuantity);
    sorted.forEach((t, i) => {
      const next = sorted[i + 1];
      tiers.push({
        minQuantity: t.minQuantity,
        maxQuantity: next ? next.minQuantity - 1 : undefined,
        price: t.unitPrice,
        label: t.tierName ?? `Mức ${i + 1}`,
      });
    });
  }
  return { ...res, priceTiers: tiers };
}

function getActiveTier(tiers: PriceTier[], qty: number): PriceTier | null {
  if (qty === 0 || !tiers.length) return null;
  return (
    [...tiers]
      .reverse()
      .find((t) => qty >= t.minQuantity) ?? tiers[0] ?? null
  );
}

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
  return (
    <div className="rounded-xl border border-slate-100 overflow-hidden text-xs">
      <div className="bg-slate-50 px-3 py-1.5 font-semibold text-slate-500 flex items-center gap-1">
        <Tag className="w-3 h-3" /> Bảng giá theo số lượng
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

export default function ShopPage() {
  /* Fetch products from API */
  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await apiClient.get<(ProductResponse & { priceTiers?: ApiTier[] })[]>("/api/products");
      return data.map(apiProductToProduct);
    },
  });

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
      toast.warning("Vui lòng nhập số lượng trước khi thêm vào giỏ.");
      return;
    }
    addToCartItem(product.id, qty);
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
    toast.success(`Đã thêm ${qty} ${product.unit} "${product.name}" vào giỏ!`);
  }

  return (
    <div className="min-h-screen bg-dragon-base">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dragon-dark">
              Danh sách sản phẩm
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Giá sỉ tự động cập nhật theo số lượng đặt hàng
            </p>
          </div>

          {/* Cart button */}
          <Button variant="outline" className="relative shrink-0" asChild>
            <Link href="/cart">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Giỏ hàng</span>
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
          {["Tất cả", "Ruột Đỏ", "Ruột Trắng", "Xuất Khẩu", "Hàng Dạt", "Chế Biến"].map((cat) => (
            <button
              key={cat}
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200 bg-white hover:border-pitaya-400 hover:text-pitaya-600 transition-all first:bg-pitaya-500 first:text-white first:border-pitaya-500"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <AlertCircle className="w-12 h-12" />
            <p>Không thể tải sản phẩm. Vui lòng thử lại.</p>
          </div>
        )}

        {/* Price loading indicator */}
        {priceLoading && (
          <div className="flex items-center gap-2 text-pitaya-600 text-sm mb-4 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang cập nhật giá theo số lượng...
          </div>
        )}

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product) => {
                const qty = quantities[product.id] ?? 0;
                const activeTier = getActiveTier(product.priceTiers ?? [], qty);
                /* Use server effective price if available, else fallback to tier calc */
                const effectiveItem = priceMap[product.id];
                const displayPrice = effectiveItem
                  ? effectiveItem.unitPrice
                  : activeTier?.price ?? product.priceTiers?.[0]?.price ?? product.baseRetailPrice;
                const displayTierLabel = activeTier?.label;
                const subtotal = displayPrice * qty;

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {/* Product image area */}
                    <div className="relative h-44 bg-gradient-to-br from-pitaya-50 to-white flex items-center justify-center">
                      <Package className="w-20 h-20 text-pitaya-200" strokeWidth={1} />
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
                        <span className="text-xs text-slate-500 shrink-0">Số lượng:</span>
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
                              Giá {displayTierLabel && <span className="font-semibold text-pitaya-600">[{displayTierLabel}]</span>}
                            </p>
                            <p className="text-lg font-extrabold text-pitaya-600">
                              {formatVND(displayPrice)}
                              <span className="text-xs font-normal text-slate-400">/{product.unit}</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Thành tiền</p>
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
                        {qty === 0 ? "Nhập số lượng" : "Thêm nhanh vào giỏ"}
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
