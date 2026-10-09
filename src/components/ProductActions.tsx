"use client";

import { useStore } from "./StoreProvider";

export function ProductActions({ id }: { id: string }) {
  const { isSaved, toggleSave, addToCart } = useStore();
  const saved = isSaved(id);

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={() => addToCart(id)}
        className="rounded-full bg-zinc-100 px-5 py-3 text-sm font-semibold hover:bg-zinc-200"
      >
        Add to cart
      </button>
      <button
        onClick={() => toggleSave(id)}
        className={`rounded-full px-5 py-3 text-sm font-semibold text-white ${
          saved ? "bg-black" : "bg-brand hover:bg-brand-dark"
        }`}
      >
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
