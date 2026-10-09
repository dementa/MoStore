"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartLine = { id: string; qty: number; color?: string };

// One cart line per product and colour.
const isLine = (l: CartLine, id: string, color?: string) => l.id === id && l.color === color;

type StoreState = {
  saved: string[];
  cart: CartLine[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  addToCart: (id: string, color?: string) => void;
  setQty: (id: string, qty: number, color?: string) => void;
  qtyInCart: (id: string, color?: string) => number;
  cartCount: number;
};

const StoreContext = createContext<StoreState | null>(null);
const STORAGE_KEY = "mostore:v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setSaved(data.saved ?? []);
        setCart(data.cart ?? []);
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ saved, cart }));
    } catch {}
  }, [saved, cart, loaded]);

  const value: StoreState = {
    saved,
    cart,
    toggleSave: (id) =>
      setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [id, ...s])),
    isSaved: (id) => saved.includes(id),
    addToCart: (id, color) =>
      setCart((c) => {
        const line = c.find((l) => isLine(l, id, color));
        if (line) return c.map((l) => (isLine(l, id, color) ? { ...l, qty: l.qty + 1 } : l));
        return [...c, color ? { id, qty: 1, color } : { id, qty: 1 }];
      }),
    setQty: (id, qty, color) =>
      setCart((c) =>
        qty <= 0
          ? c.filter((l) => !isLine(l, id, color))
          : c.map((l) => (isLine(l, id, color) ? { ...l, qty } : l)),
      ),
    qtyInCart: (id, color) => cart.find((l) => isLine(l, id, color))?.qty ?? 0,
    cartCount: cart.reduce((n, l) => n + l.qty, 0),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
