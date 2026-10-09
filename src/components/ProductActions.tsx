"use client";

import { useState } from "react";
import type { ProductColor } from "@/lib/products";
import { ColorPicker } from "./ColorPicker";
import { useStore } from "./StoreProvider";

export function ProductActions({ id, colors }: { id: string; colors?: ProductColor[] }) {
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
    </div>
  );
}
