"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Lang } from "./i18n";
import { I18N } from "./i18n";
import type { Product } from "./data";

export interface CartItem {
  id: string;
  qty: number;
  product: Product;
}

type Accent = "pink" | "magenta" | "leaf" | "gold";

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  cart: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  quoteOpen: boolean;
  setQuoteOpen: (v: boolean) => void;
  quotePrefill: string | null;
  setQuotePrefill: (v: string | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  tweaksOpen: boolean;
  setTweaksOpen: (v: boolean) => void;
  darkNav: boolean;
  setDarkNav: (v: boolean) => void;
  accent: Accent;
  setAccent: (a: Accent) => void;
}

const AppCtx = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = use(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside <DragonAppProvider>");
  return ctx;
}

const ACCENTS: Record<Accent, { main: string; deep: string }> = {
  pink: { main: "#E88BAE", deep: "#C4477A" },
  magenta: { main: "#C4477A", deep: "#8B2F57" },
  leaf: { main: "#4A6B48", deep: "#2D4A2B" },
  gold: { main: "#C9A961", deep: "#8B7438" },
};

export function DragonAppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [darkNav, setDarkNav] = useState(true);
  const [accent, setAccent] = useState<Accent>("pink");

  useEffect(() => {
    const storedLang = localStorage.getItem("dd-lang") as Lang | null;
    if (storedLang === "vi" || storedLang === "en") setLang(storedLang);
    const storedCart = localStorage.getItem("dd-cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {
        // ignore corrupted cart payload
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dd-lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("dd-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const a = ACCENTS[accent];
    document.documentElement.style.setProperty("--pink-deep", a.main);
    document.documentElement.style.setProperty("--magenta", a.deep);
  }, [accent]);

  const t = useCallback((key: string) => I18N[lang][key] ?? key, [lang]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const addToCart = useCallback(
    (product: Product, qty: number) => {
      setCart((prev) => {
        const existing = prev.find((it) => it.id === product.id);
        if (existing) {
          return prev.map((it) =>
            it.id === product.id ? { ...it, qty: it.qty + qty } : it
          );
        }
        return [...prev, { id: product.id, qty, product }];
      });
      showToast(lang === "vi" ? `Đã thêm ${qty} kg` : `Added ${qty} kg`);
    },
    [lang, showToast]
  );

  const updateQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, qty) } : it))
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      lang,
      setLang,
      t,
      cart,
      addToCart,
      updateQty,
      removeFromCart,
      cartOpen,
      setCartOpen,
      quoteOpen,
      setQuoteOpen,
      quotePrefill,
      setQuotePrefill,
      toast,
      showToast,
      tweaksOpen,
      setTweaksOpen,
      darkNav,
      setDarkNav,
      accent,
      setAccent,
    }),
    [
      lang,
      t,
      cart,
      addToCart,
      updateQty,
      removeFromCart,
      cartOpen,
      quoteOpen,
      quotePrefill,
      toast,
      showToast,
      tweaksOpen,
      darkNav,
      accent,
    ]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
