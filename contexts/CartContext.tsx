"use client";

import { createContext, use, type ReactNode } from "react";
import { useCartState, type CartSession } from "@/lib/core/cart/use-cart-state";

const CartContext = createContext<CartSession | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const session = useCartState();
  return <CartContext value={session}>{children}</CartContext>;
}

export function useCart(): CartSession {
  const ctx = use(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
