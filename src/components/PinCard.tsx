"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, type Product } from "@/lib/products";
import { getStoreByName } from "@/lib/stores";
import { ColorPicker } from "./ColorPicker";
import { useStore } from "./StoreProvider";

const SHARE =
  "M12 2.6 16.7 7.3l-1.4 1.4L13 6.4V15h-2V6.4L8.7 8.7 7.3 7.3 12 2.6ZM5 10h3v2H6v8h12v-8h-2v-2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1Z";
const CHECK = "m9.5 16.2-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z";

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
  const { addToCart, qtyInCart } = useStore();
  const [copied, setCopied] = useState(false);
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const qty = qtyInCart(product.id, color);
  const href = `${basePath}/${product.id}`;
  const store = getStoreByName(product.seller);

  async function share() {
    const url = new URL(href, window.location.origin).href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, text: `${product.title} · ${formatPrice(product.price)}`, url });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="mb-2 break-inside-avoid rounded-[20px] bg-white p-1.5 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_10px_28px_rgba(15,23,42,0.12)] sm:mb-4 sm:rounded-3xl sm:p-2">
      <div className="relative overflow-hidden rounded-[16px] bg-zinc-100 sm:rounded-[18px]">
        <Link href={href} aria-label={product.title}>
          <Image
            src={product.image}
            alt={product.title}
            width={product.width}
            height={product.height}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="h-auto w-full"
          />
        </Link>
        <button
          onClick={share}
          aria-label={copied ? "Link copied" : `Share ${product.title}`}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm active:scale-90 sm:h-10 sm:w-10"
        >
          <svg viewBox="0 0 24 24" className={`h-5 w-5 ${copied ? "fill-green-600" : "fill-black"}`} aria-hidden>
            <path d={copied ? CHECK : SHARE} />
          </svg>
        </button>
      </div>

      <div className="px-1.5 pb-1 pt-2.5 sm:px-2 sm:pt-3">
        {showSeller && store && (
          <Link
            href={`/${store.slug}`}
            className="mb-0.5 block truncate text-xs font-medium text-zinc-500 hover:underline"
          >
            {store.name}
          </Link>
        )}
        <Link href={href} className="line-clamp-2 text-sm font-medium leading-snug sm:text-base">
          {product.title}
        </Link>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="text-base font-bold sm:text-lg">{formatPrice(product.price)}</p>
          <button
            onClick={() => addToCart(product.id, color)}
            aria-label={
              qty === 0
                ? `Add ${product.title}${color ? ` (${color})` : ""} to cart`
                : `${qty} in cart. Add one more ${product.title}`
            }
            className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors active:scale-90 sm:h-10 sm:w-10 ${
              qty === 0 ? "bg-brand/10 text-brand-dark hover:bg-brand hover:text-white" : "bg-brand text-white"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M2.5 3.5h2.2l2.4 11a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.9-1.4L21 8H6" />
              <circle cx="10" cy="20" r="1.3" />
              <circle cx="17" cy="20" r="1.3" />
            </svg>
            {qty > 0 && (
              <span
                aria-live="polite"
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-black px-1 text-[11px] font-bold text-white ring-2 ring-white"
              >
                {qty}
              </span>
            )}
          </button>
        </div>
        <div className="hidden sm:block">
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{product.description}</p>
        </div>
        {product.colors && color && <ColorPicker colors={product.colors} value={color} onChange={setColor} />}
      </div>
    </div>
  );
}
