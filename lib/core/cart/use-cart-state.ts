"use client";

import { useCallback, useEffect, useState } from "react";
import { loadCart, saveCart, type CartState } from "./storage";

export interface CartSession {
  cart: CartState;
  cartCount: number;
  addItem: (productId: string, quantity: number) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export function useCartState(): CartSession {
  const [cart, setCart] = useState<CartState>({});

  useEffect(() => {
    setCart(loadCart());
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addItem = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) return;
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) + quantity,
    }));
  }, []);

  const updateQty = useCallback((productId: string, quantity: number) => {
    const qty = Math.max(0, quantity);
    setCart((prev) => {
      if (qty === 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: qty };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
  }, []);

  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

  return { cart, cartCount, addItem, updateQty, removeItem, clearCart };
}
