"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { ShoppingCart, Minus, Plus, Trash2, Package, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffectivePrice } from "@/lib/core/pricing/use-effective-price";
import { useProductsQuery } from "@/lib/core/products/use-products";
import { getUnitPrice } from "@/lib/core/products/tier";
import { useCreateOrder } from "@/lib/core/orders/use-create-order";
import { formatVND } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { OrderCreateRequest } from "@/types";

export default function CartPage() {
  const t = useTranslations("cart");
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { cart, cartCount, updateQty, removeItem, clearCart } = useCart();
  const [notes, setNotes] = useState("");

  const { data: productsData, isLoading } = useProductsQuery();
  const products = productsData ?? [];

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

  const { mutate: createOrder, isPending: creatingOrder } = useCreateOrder({
    onSuccess: (order) => {
      clearCart();
      setNotes("");
      toast.success(t("toastOrderCreated", { code: order.orderCode ?? `#${order.id.slice(0, 8)}` }));
      router.push("/shop");
    },
    onError: (msg) => toast.error(msg),
  });

  const handleCreateOrder = () => {
    if (!createOrderBody) return;
    createOrder(createOrderBody);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success(t("toastCartCleared"));
  };

  if (cartCount === 0 && !isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-hero flex flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="blob-pitaya animate-blob absolute top-40 right-[10%] h-[340px] w-[340px] rounded-full" />
          <div className="blob-cactus animate-blob absolute bottom-20 left-[8%] h-[280px] w-[280px] rounded-full" />
        </div>
        <Header />
        <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-20">
          <div className="text-center max-w-sm animate-fade-in-up">
            <div className="w-28 h-28 rounded-full bg-gradient-pitaya-soft flex items-center justify-center mx-auto mb-6 shadow-card-md">
              <ShoppingCart className="w-14 h-14 text-pitaya-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-dragon-dark mb-3 tracking-tight">{t("emptyTitle")}</h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              {t("emptyDescription")}
            </p>
            <Button asChild size="lg" variant="gradient" className="rounded-full px-7">
              <Link href="/shop" className="inline-flex items-center gap-2">
                {t("viewProducts")}
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
    <div className="relative min-h-screen bg-dragon-base overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]">
        <div className="blob-pitaya animate-blob absolute -top-16 right-[8%] h-[300px] w-[300px] rounded-full" />
      </div>
      <Header />
      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-pitaya-600 mb-1 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              {t("backToProducts")}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-dragon-dark flex items-center gap-3 mt-0.5 tracking-tight">
              <span className="w-11 h-11 rounded-2xl bg-gradient-pitaya flex items-center justify-center shadow-pitaya">
                <ShoppingCart className="w-5 h-5 text-white" />
              </span>
              {t("title")}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {t("itemCount", { count: cartCount })}
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
              {t("clearCart")}
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href="/shop">{t("continueShopping")}</Link>
            </Button>
          </div>
        </div>

        {priceLoading && (
          <div className="flex items-center gap-2 text-pitaya-600 text-sm mb-4 py-2">
            <span className="inline-block w-4 h-4 rounded-full border-2 border-pitaya-500 border-t-transparent animate-spin" />
            {t("calculatingPrice")}
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
                              toast.success(t("toastItemRemoved"));
                            }}
                            aria-label={t("removeFromCart")}
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
              {t("notesLabel")} <span className="text-slate-400">{t("optional")}</span>
            </Label>
            <textarea
              id="order-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("notesPlaceholder")}
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
                    {t.rich("totalItems", {
                      count: cartCount,
                      b: (chunks) => <span className="font-medium text-dragon-dark">{chunks}</span>,
                    })}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-pitaya-600 mt-0.5 tabular-nums">
                    {priceLoading ? "—" : formatVND(totalAmount)}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Button size="lg" variant="outline" className="rounded-full px-5 shrink-0" asChild>
                    <Link href="/shop" className="inline-flex items-center gap-2">
                      {t("continueShopping")}
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
                          {t("creatingOrder")}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t("placeOrder")}
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button size="lg" className="rounded-full px-6 shrink-0" asChild>
                      <Link href="/login">
                        {t("loginToOrder")}
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
