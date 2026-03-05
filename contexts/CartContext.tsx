"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "pitaya_cart";

type CartState = Record<string, number>;

interface CartContextValue {
  cart: CartState;
  cartCount: number;
  addItem: (productId: string, quantity: number) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: CartState = {};
    for (const [id, val] of Object.entries(parsed)) {
      const n = Number(val);
      if (typeof id === "string" && Number.isInteger(n) && n > 0) out[id] = n;
    }
    return out;
  } catch {
    return {};
  }
}

function saveCart(cart: CartState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
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

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addItem,
        updateQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
