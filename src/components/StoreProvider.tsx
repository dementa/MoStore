"use client";

import { createContext, useContext, useEffect, useState } from "react";

type CartLine = { id: string; qty: number };

type StoreState = {
  saved: string[];
  cart: CartLine[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  addToCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
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
    addToCart: (id) =>
      setCart((c) => {
        const line = c.find((l) => l.id === id);
        if (line) return c.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
        return [...c, { id, qty: 1 }];
      }),
    setQty: (id, qty) =>
      setCart((c) =>
        qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty } : l)),
      ),
    cartCount: cart.reduce((n, l) => n + l.qty, 0),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
