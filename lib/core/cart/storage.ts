export const CART_STORAGE_KEY = "pitaya_cart";

export type CartState = Record<string, number>;

export function loadCart(): CartState {
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

export function saveCart(cart: CartState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}
