"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, type Product } from "@/lib/products";
import { getStoreByName } from "@/lib/stores";
import { PinMenu } from "./PinMenu";
import { useStore } from "./StoreProvider";

export function PinCard({
  product,
  basePath = "/product",
  showSeller = true,
}: {
  product: Product;
  /** Where product links point: "/product" in the marketplace, "/<store>/p" inside a store. */
  basePath?: string;
  showSeller?: boolean;
}) {
  const { isSaved, toggleSave, addToCart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const saved = isSaved(product.id);
  const href = `${basePath}/${product.id}`;
  const store = getStoreByName(product.seller);

  return (
    <div className="group mb-3 break-inside-avoid sm:mb-4">
      <div className="relative overflow-hidden rounded-[20px] bg-zinc-100 sm:rounded-2xl">
        <Link href={href} aria-label={product.title}>
          <Image
            src={product.image}
            alt={product.title}
            width={product.width}
            height={product.height}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="h-auto w-full"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40" />
        </Link>

        {/* Hover actions for mouse users; phones use the ⋯ menu instead. */}
        <button
          onClick={() => toggleSave(product.id)}
          className={`absolute right-3 top-3 rounded-full px-4 py-3 text-sm font-semibold transition-opacity ${
            saved
              ? "hidden bg-black text-white opacity-100 sm:block"
              : "hidden bg-brand text-white opacity-0 hover:bg-brand-dark group-hover:opacity-100 sm:block"
          }`}
        >
          {saved ? "Saved" : "Save"}
        </button>
        {saved && (
          <span
            aria-label="Saved"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/80 sm:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden>
              <path d="M6 2h12a1 1 0 0 1 1 1v19l-7-4.5L5 22V3a1 1 0 0 1 1-1Z" />
            </svg>
          </span>
        )}

        <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold sm:bottom-3 sm:left-3 sm:px-3 sm:py-1.5 sm:text-sm">
          {formatPrice(product.price)}
        </span>

        <button
          onClick={() => addToCart(product.id)}
          aria-label={`Add ${product.title} to cart`}
          className="absolute bottom-3 right-3 hidden h-9 w-9 place-items-center rounded-full bg-white/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100 sm:grid"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-black" aria-hidden>
            <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
          </svg>
        </button>
      </div>

      <div className="flex items-start gap-1 px-1 pt-2">
        <div className="min-w-0 flex-1">
          <Link href={href} className="line-clamp-2 text-sm font-medium leading-snug sm:font-semibold">
            {product.title}
          </Link>
          {showSeller && (
            <Link
              href={store ? `/${store.slug}` : href}
              className="mt-1 hidden w-fit items-center gap-1.5 text-xs text-zinc-600 hover:underline sm:flex"
            >
              <span
                className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white"
                style={{ background: store?.color ?? "#71717a" }}
              >
                {product.seller[0]}
              </span>
              {product.seller}
            </Link>
          )}
        </div>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label={`More options for ${product.title}`}
          className="-mr-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full active:bg-zinc-100 sm:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-black" aria-hidden>
            <path d="M5 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <PinMenu
          product={product}
          href={href}
          storeHref={showSeller && store ? `/${store.slug}` : undefined}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
