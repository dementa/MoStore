"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { products } from "@/lib/products";
import type { Store } from "@/lib/stores";
import { useStore } from "./StoreProvider";

const ICONS = {
  home: "M11.3 2.3a1 1 0 0 1 1.4 0l8 7A1 1 0 0 1 21 10v10a2 2 0 0 1-2 2h-4a1 1 0 0 1-1-1v-5h-4v5a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V10a1 1 0 0 1 .3-.7l8-7Z",
  search:
    "M10 2a8 8 0 0 1 6.32 12.9l5.39 5.4-1.42 1.4-5.39-5.38A8 8 0 1 1 10 2Zm0 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z",
  saved: "M6 2h12a1 1 0 0 1 1 1v19l-7-4.5L5 22V3a1 1 0 0 1 1-1Z",
  messages: "M5 3h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-6 4V5a2 2 0 0 1 2-2Z",
  cart: "M7 4V3a5 5 0 0 1 10 0v1h3a1 1 0 0 1 1 1.1l-1.5 15A2 2 0 0 1 17.5 22h-11a2 2 0 0 1-2-1.9L3 5.1A1 1 0 0 1 4 4h3Zm2 0h6V3a3 3 0 0 0-6 0v1Z",
};

type Item = { href: string; label: string; icon: keyof typeof ICONS; badge?: number };

/** Pinterest-style floating buttons along the bottom of the screen, on phones only. */
export function BottomNav({ store }: { store?: Store }) {
  const pathname = usePathname();
  const { cart } = useStore();

  const cartCount = cart.reduce((n, l) => {
    if (!store) return n + l.qty;
    return products.find((p) => p.id === l.id)?.seller === store.name ? n + l.qty : n;
  }, 0);

  const base = store ? `/${store.slug}` : "";
  const items: Item[] = [
    { href: base || "/", label: "Home", icon: "home" },
    { href: `${base}/search`, label: "Search", icon: "search" },
    ...(store ? [] : [{ href: "/saved", label: "Saved", icon: "saved" as const }]),
    { href: `${base}/messages`, label: "Messages", icon: "messages" },
    { href: `${base}/cart`, label: "Cart", icon: "cart", badge: cartCount || undefined },
  ];

  // A chat has its own message bar along the bottom.
  if (pathname.includes("/chat/")) return null;

  return (
    <nav
      aria-label="Main"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center gap-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:hidden"
    >
      {items.map(({ href, label, icon, badge }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={badge ? `${label} (${badge})` : label}
            aria-current={active ? "page" : undefined}
            className="pointer-events-auto relative grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-[0_2px_14px_rgba(0,0,0,0.18)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" className={`h-6 w-6 ${active ? "fill-black" : "fill-zinc-400"}`} aria-hidden>
              <path d={ICONS[icon]} />
            </svg>
            {badge && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
