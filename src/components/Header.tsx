"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AppMenu } from "./AppMenu";
import { useStore } from "./StoreProvider";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const { cartCount } = useStore();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  const navPill = (href: string, label: string) => (
    <Link
      href={href}
      className={`hidden rounded-full px-4 py-3 text-sm font-semibold sm:block ${
        pathname === href ? "bg-black text-white" : "hover:bg-zinc-100"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 bg-white px-4 py-3">
      <Link
        href="/"
        aria-label="MoStore home"
        className="flex h-12 shrink-0 items-center gap-2 rounded-full sm:w-12 sm:justify-center sm:hover:bg-zinc-100"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-lg font-black text-white">
          M
        </span>
        <span className="text-2xl font-bold tracking-tight sm:hidden">MoStore</span>
      </Link>
      <div className="flex-1 sm:hidden" />
      {navPill("/", "Shop")}
      {navPill("/saved", "Saved")}

      <form onSubmit={onSubmit} className="hidden flex-1 sm:block">
        <label className="flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-3 focus-within:ring-4 focus-within:ring-sky-200">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-zinc-500" aria-hidden>
            <path d="M10 2a8 8 0 0 1 6.32 12.9l5.39 5.4-1.42 1.4-5.39-5.38A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, shops and ideas"
            className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
          />
        </label>
      </form>

      <AppMenu />
      <Link
        href="/cart"
        aria-label={`Cart (${cartCount})`}
        className="relative hidden h-12 w-12 shrink-0 place-items-center rounded-full hover:bg-zinc-100 sm:grid"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-zinc-700" aria-hidden>
          <path d="M7 4V3a5 5 0 0 1 10 0v1h3a1 1 0 0 1 1 1.1l-1.5 15A2 2 0 0 1 17.5 22h-11a2 2 0 0 1-2-1.9L3 5.1A1 1 0 0 1 4 4h3Zm2 0h6V3a3 3 0 0 0-6 0v1Z" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
            {cartCount}
          </span>
        )}
      </Link>
    </header>
  );
}
