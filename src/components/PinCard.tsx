"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatAmount, formatPrice, type Product } from "@/lib/products";
import { shareLink } from "@/lib/share";
import { getStoreByName } from "@/lib/stores";
import { ColorPicker } from "./ColorPicker";
import { useStore } from "./StoreProvider";

const SHARE =
  "M12 2.6 16.7 7.3l-1.4 1.4L13 6.4V15h-2V6.4L8.7 8.7 7.3 7.3 12 2.6ZM5 10h3v2H6v8h12v-8h-2v-2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1Z";
const CHECK = "m9.5 16.2-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z";

/**
 * Product card: name and shop on top, then the photo with the price over its
 * bottom edge and an add-to-cart button beside it.
 */
export function PinCard({
  product,
  basePath = "/product",
  showSeller = true,
}: {
  product: Product;
  /** Where product links point: "/product" in the marketplace, "/<store>/p" inside a store. */
  basePath?: string;
  /** Inside a store the subtitle is the category instead of the shop name. */
  showSeller?: boolean;
}) {
  const { addToCart, qtyInCart } = useStore();
  const [copied, setCopied] = useState(false);
  const [color, setColor] = useState(product.colors?.[0]?.name);
  const qty = qtyInCart(product.id, color);
  const href = `${basePath}/${product.id}`;
  const store = getStoreByName(product.seller);

  async function share() {
    const text = `${product.title} · ${formatPrice(product.price)}`;
    if ((await shareLink({ title: product.title, text, path: href })) === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="mb-2 break-inside-avoid rounded-[22px] bg-white p-1.5 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_10px_28px_rgba(15,23,42,0.12)] sm:mb-4 sm:rounded-[28px] sm:p-2">
      <div className="px-2 pb-2.5 pt-2 sm:px-3 sm:pb-3 sm:pt-3">
        <Link href={href} className="line-clamp-2 text-base font-semibold leading-tight sm:text-xl">
          {product.title}
        </Link>
        {showSeller && store ? (
          <Link
            href={`/${store.slug}`}
            className="mt-1 block truncate text-xs text-zinc-500 hover:underline sm:text-sm"
          >
            {store.name}
          </Link>
        ) : (
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{product.category}</p>
        )}
      </div>

      <div className="relative overflow-hidden rounded-[17px] bg-zinc-100 sm:rounded-[22px]">
        <Link href={href} aria-label={product.title}>
          <Image
            src={product.image}
            alt={product.title}
            width={product.width}
            height={product.height}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="h-auto w-full"
          />
          {/* Darkens the bottom so the price stays readable on light photos. */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
        </Link>

        <button
          onClick={share}
          aria-label={copied ? "Link copied" : `Share ${product.title}`}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-white/50 bg-black/10 shadow-[0_4px_14px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-md backdrop-saturate-150 transition-colors hover:bg-white/25 active:scale-90 sm:h-10 sm:w-10"
        >
          {/* Frosted glass: blurred, see-through, with a light edge; the faint dark tint keeps the white icon readable on pale photos. */}
          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)] sm:h-5 sm:w-5 ${copied ? "fill-green-300" : "fill-white"}`}
            aria-hidden
          >
            <path d={copied ? CHECK : SHARE} />
          </svg>
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5 sm:p-3">
          <p className="leading-none text-white drop-shadow-sm">
            <span className="block text-[10px] font-semibold tracking-wide opacity-90 sm:text-xs">UGX</span>
            <span className="text-xl font-semibold tracking-tight sm:text-3xl">{formatAmount(product.price)}</span>
          </p>
          <button
            onClick={() => addToCart(product.id, color)}
            aria-label={
              qty === 0
                ? `Add ${product.title}${color ? ` (${color})` : ""} to cart`
                : `${qty} in cart. Add one more ${product.title}`
            }
            className={`pointer-events-auto relative grid h-9 w-9 shrink-0 place-items-center rounded-full shadow-sm transition-colors active:scale-90 sm:h-11 sm:w-11 ${
              qty === 0 ? "bg-white text-brand-dark hover:bg-brand hover:text-white" : "bg-brand text-white"
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
      </div>

      {product.colors && color && (
        <div className="px-2 pb-1 sm:px-3">
          <ColorPicker colors={product.colors} value={color} onChange={setColor} />
        </div>
      )}
    </div>
  );
}
