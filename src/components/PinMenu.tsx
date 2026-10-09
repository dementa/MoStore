"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, type Product } from "@/lib/products";
import { BottomSheet } from "./BottomSheet";
import { useStore } from "./StoreProvider";

/** The ⋯ sheet under a pin on phones: save, add to cart, share, visit the shop. */
export function PinMenu({
  product,
  href,
  storeHref,
  onClose,
}: {
  product: Product;
  href: string;
  storeHref?: string;
  onClose: () => void;
}) {
  const { isSaved, toggleSave, addToCart } = useStore();
  const [note, setNote] = useState<string | null>(null);
  const saved = isSaved(product.id);
  const titleId = `pin-menu-${product.id}`;

  function flash(text: string) {
    setNote(text);
    setTimeout(onClose, 700);
  }

  async function share() {
    const url = new URL(href, window.location.origin).href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url });
      } catch {}
      return onClose();
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch {}
  }

  const row = "w-full rounded-xl px-3 py-3.5 text-left text-base font-semibold active:bg-zinc-100";

  return (
    <BottomSheet onClose={onClose} labelledBy={titleId}>
      <div className="mb-4 flex items-center gap-3">
        <Image
          src={product.image}
          alt=""
          width={56}
          height={Math.round((56 * product.height) / product.width)}
          className="h-16 w-14 rounded-xl object-cover"
        />
        <div className="min-w-0">
          <p id={titleId} className="truncate font-semibold">
            {product.title}
          </p>
          <p className="text-sm text-zinc-600">{formatPrice(product.price)}</p>
        </div>
      </div>

      {note ? (
        <p className="py-8 text-center font-semibold">{note}</p>
      ) : (
        <div className="-mx-3 flex flex-col">
          <button
            className={row}
            onClick={() => {
              toggleSave(product.id);
              flash(saved ? "Removed from Saved" : "Saved");
            }}
          >
            {saved ? "Remove from Saved" : "Save"}
          </button>
          <button
            className={row}
            onClick={() => {
              addToCart(product.id);
              flash("Added to cart");
            }}
          >
            Add to cart
          </button>
          <button className={row} onClick={share}>
            Share
          </button>
          {storeHref && (
            <Link href={storeHref} className={row} onClick={onClose}>
              Visit {product.seller}
            </Link>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
