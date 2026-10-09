"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import { useStore } from "./StoreProvider";

export function PinCard({ product }: { product: Product }) {
  const { isSaved, toggleSave, addToCart } = useStore();
  const saved = isSaved(product.id);

  return (
    <div className="group mb-4 break-inside-avoid">
      <div className="relative overflow-hidden rounded-2xl bg-zinc-100">
        <Link href={`/product/${product.id}`} aria-label={product.title}>
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

        <button
          onClick={() => toggleSave(product.id)}
          className={`absolute right-3 top-3 rounded-full px-4 py-3 text-sm font-semibold transition-opacity ${
            saved
              ? "bg-black text-white opacity-100"
              : "bg-brand text-white opacity-0 hover:bg-brand-dark group-hover:opacity-100"
          }`}
        >
          {saved ? "Saved" : "Save"}
        </button>

        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold">
          {formatPrice(product.price)}
        </span>

        <button
          onClick={() => addToCart(product.id)}
          aria-label={`Add ${product.title} to cart`}
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-black" aria-hidden>
            <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z" />
          </svg>
        </button>
      </div>

      <Link href={`/product/${product.id}`} className="block px-1 pt-2">
        <p className="line-clamp-2 text-sm font-semibold leading-snug">{product.title}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-zinc-200 text-[10px] font-bold">
            {product.seller[0]}
          </span>
          {product.seller}
        </p>
      </Link>
    </div>
  );
}
