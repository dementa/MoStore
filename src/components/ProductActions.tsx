"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductColor } from "@/lib/products";
import { ColorPicker } from "./ColorPicker";
import { useStore } from "./StoreProvider";

export function ProductActions({
  id,
  colors,
  chatHref,
}: {
  id: string;
  colors?: ProductColor[];
  chatHref: string;
}) {
  const { isSaved, toggleSave, addToCart } = useStore();
  const [color, setColor] = useState(colors?.[0]?.name);
  const [added, setAdded] = useState(false);
  const saved = isSaved(id);

  function add() {
    addToCart(id, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4">
      {colors && color && <ColorPicker colors={colors} value={color} onChange={setColor} size="lg" />}
      <div className="flex items-center gap-2">
        <button
          onClick={add}
          className="flex-1 rounded-full bg-brand px-5 py-3.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {added ? "Added to cart ✓" : color ? `Add ${color} to cart` : "Add to cart"}
        </button>
        <button
          onClick={() => toggleSave(id)}
          className={`rounded-full px-5 py-3.5 text-sm font-semibold ${
            saved ? "bg-black text-white" : "bg-zinc-100 hover:bg-zinc-200"
          }`}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <div className="flex gap-2">
        <Link
          href={chatHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-100 px-4 py-3 text-sm font-semibold hover:bg-zinc-200"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M5 3h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-6 4V5a2 2 0 0 1 2-2Z" />
          </svg>
          Chat with seller
        </Link>
        <Link
          href={`${chatHref}?offer=1`}
          className="flex-1 rounded-full bg-zinc-100 px-4 py-3 text-center text-sm font-semibold hover:bg-zinc-200"
        >
          Make an offer
        </Link>
      </div>
    </div>
  );
}
