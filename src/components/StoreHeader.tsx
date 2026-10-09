"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { products } from "@/lib/products";
import type { Store } from "@/lib/stores";
import { AppMenu } from "./AppMenu";
import { BackButton } from "./BackButton";
import { StoreLogo } from "./StoreLogo";
import { useStore } from "./StoreProvider";

export function StoreHeader({ store }: { store: Store }) {
  const { cart } = useStore();
  const home = `/${store.slug}`;
  const pathname = usePathname();
  const count = cart.reduce((n, l) => {
    const p = products.find((x) => x.id === l.id);
    return p?.seller === store.name ? n + l.qty : n;
  }, 0);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 bg-canvas px-4 py-3">
      {pathname !== home && <BackButton fallback={home} />}
      <Link href={`/${store.slug}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-full py-1 pr-3">
        <StoreLogo store={store} size={40} />
        <span className="truncate text-lg font-semibold">{store.name}</span>
      </Link>
      <AppMenu appName={store.name} store={store.slug} />
      <Link
        href={`/${store.slug}/cart`}
        aria-label={`Cart (${count})`}
        className="relative hidden h-12 w-12 shrink-0 place-items-center rounded-full hover:bg-white sm:grid"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-zinc-700" aria-hidden>
          <path d="M7 4V3a5 5 0 0 1 10 0v1h3a1 1 0 0 1 1 1.1l-1.5 15A2 2 0 0 1 17.5 22h-11a2 2 0 0 1-2-1.9L3 5.1A1 1 0 0 1 4 4h3Zm2 0h6V3a3 3 0 0 0-6 0v1Z" />
        </svg>
        {count > 0 && (
          <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
            {count}
          </span>
        )}
      </Link>
    </header>
  );
}
