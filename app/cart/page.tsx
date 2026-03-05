"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus, Trash2, Package, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffectivePrice } from "@/hooks/useEffectivePrice";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Product, PriceTier, ProductResponse, OrderCreateRequest, OrderResponse } from "@/types";

type ApiTier = { minQuantity: number; unitPrice: number; tierName?: string };

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

function getUnitPrice(product: Product, qty: number, priceMap: Record<string, { unitPrice: number }>): number {
  const fromApi = priceMap[product.id]?.unitPrice;
  if (fromApi != null) return fromApi;
  const tiers = product.priceTiers ?? [];
  if (!tiers.length) return product.baseRetailPrice;
  const sorted = [...tiers].sort((a, b) => b.minQuantity - a.minQuantity);
  const tier = sorted.find((t) => qty >= t.minQuantity);
  return tier?.price ?? product.baseRetailPrice;
}

export default function CartPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { cart, cartCount, updateQty, removeItem, clearCart } = useCart();
  const [notes, setNotes] = useState("");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await apiClient.get<(ProductResponse & { priceTiers?: ApiTier[] })[]>("/api/products");
      return data.map(apiProductToProduct);
    },
  });

  const cartEntries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const priceItems = cartEntries.map(([productId, quantity]) => ({ productId, quantity }));
  const { priceMap, totalAmount, isLoading: priceLoading } = useEffectivePrice(priceItems);

  const productById = Object.fromEntries(products.map((p) => [p.id, p]));

  const createOrderBody: OrderCreateRequest | null =
    cartEntries.length > 0 && user
      ? {
          userId: user.id,
          notes: notes.trim() || undefined,
          items: cartEntries.map(([productId, quantity]) => ({ productId, quantity })),
        }
      : null;

  const { mutate: createOrder, isPending: creatingOrder } = useMutation({
    mutationFn: async (body: OrderCreateRequest) => {
      const { data } = await apiClient.post<OrderResponse>("/api/orders", body);
      return data;
    },
    onSuccess: (order) => {
      clearCart();
      setNotes("");
      toast.success(`Đơn hàng đã được tạo. Mã đơn: ${order.orderCode ?? `#${order.id.slice(0, 8)}`}`);
      router.push("/shop");
    },
    onError: (err) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Tạo đơn hàng thất bại. Vui lòng thử lại.";
      toast.error(msg);
    },
  });

  const handleCreateOrder = () => {
    if (!createOrderBody) return;
    createOrder(createOrderBody);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Đã xóa toàn bộ giỏ hàng.");
  };

  if (cartCount === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-dragon-base flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pitaya-100 to-pitaya-50 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShoppingCart className="w-12 h-12 text-pitaya-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-dragon-dark mb-2">Giỏ hàng trống</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Bạn chưa thêm sản phẩm nào. Khám phá sản phẩm thanh long VietGAP và thêm vào giỏ nhé!
            </p>
            <Button asChild size="lg" className="rounded-full px-6 shadow-md">
              <Link href="/shop" className="inline-flex items-center gap-2">
                Xem sản phẩm
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dragon-base">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-pitaya-600 mb-1 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              Quay lại sản phẩm
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-dragon-dark flex items-center gap-2 mt-0.5">
              <span className="w-10 h-10 rounded-xl bg-pitaya-500 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </span>
              Giỏ hàng
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {cartCount} sản phẩm trong giỏ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearCart}
              className="text-slate-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Xóa giỏ
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href="/shop">Tiếp tục mua</Link>
            </Button>
          </div>
        </div>

        {priceLoading && (
          <div className="flex items-center gap-2 text-pitaya-600 text-sm mb-4 py-2">
            <span className="inline-block w-4 h-4 rounded-full border-2 border-pitaya-500 border-t-transparent animate-spin" />
            Đang tính giá theo số lượng...
          </div>
        )}

        {/* Cart list */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-sm overflow-hidden rounded-2xl">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse" />
                      <div className="h-3 bg-slate-50 rounded w-1/3 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            cartEntries.map(([productId, qty]) => {
              const product = productById[productId];
              if (!product) return null;
              const unitPrice = getUnitPrice(product, qty, priceMap);
              const lineTotal = unitPrice * qty;
              return (
                <Card
                  key={productId}
                  className="border-0 shadow-sm overflow-hidden rounded-2xl transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4 sm:gap-5 p-4 sm:p-5">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-pitaya-50 to-white flex items-center justify-center shrink-0 border border-pitaya-100">
                        <Package className="w-10 h-10 sm:w-12 sm:h-12 text-pitaya-300" strokeWidth={1.2} />
                      </div>
                      {/* Info + actions */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-dragon-dark text-base truncate pr-2">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {formatVND(unitPrice)}
                            <span className="text-slate-400"> / {product.unit}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Stepper */}
                          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                            <button
                              type="button"
                              onClick={() => updateQty(productId, qty - 1)}
                              className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 active:bg-slate-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-semibold tabular-nums text-dragon-dark">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(productId, qty + 1)}
                              className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-600 active:bg-slate-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {/* Line total */}
                          <span className="w-28 sm:w-32 text-right font-bold text-dragon-dark text-sm sm:text-base tabular-nums">
                            {formatVND(lineTotal)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                            onClick={() => {
                              removeItem(productId);
                              toast.success("Đã xóa khỏi giỏ.");
                            }}
                            aria-label="Xóa khỏi giỏ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Notes (optional) */}
        {!isLoading && cartEntries.length > 0 && (
          <div className="mt-6">
            <Label htmlFor="order-notes" className="text-sm text-slate-600">
              Ghi chú đơn hàng <span className="text-slate-400">(tùy chọn)</span>
            </Label>
            <textarea
              id="order-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
              rows={2}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-dragon-dark placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pitaya-500 focus:border-transparent resize-none"
            />
          </div>
        )}

        {/* Summary + Place order */}
        {!isLoading && cartEntries.length > 0 && (
          <Card className="mt-6 border-0 shadow-md rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-slate-500 text-sm">
                    Tổng cộng <span className="font-medium text-dragon-dark">{cartCount}</span> sản phẩm
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-pitaya-600 mt-0.5 tabular-nums">
                    {priceLoading ? "—" : formatVND(totalAmount)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button size="lg" variant="outline" className="rounded-full px-5 shrink-0" asChild>
                    <Link href="/shop" className="inline-flex items-center gap-2">
                      Tiếp tục mua
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  {isAuthenticated && user ? (
                    <Button
                      size="lg"
                      className="rounded-full px-6 shadow-md shrink-0"
                      disabled={creatingOrder || priceLoading}
                      onClick={handleCreateOrder}
                    >
                      {creatingOrder ? (
                        <>
                          <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Đang tạo đơn...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Đặt hàng
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button size="lg" className="rounded-full px-6 shrink-0" asChild>
                      <Link href="/login">
                        Đăng nhập để đặt hàng
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
