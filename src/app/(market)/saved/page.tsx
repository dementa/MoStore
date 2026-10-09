"use client";

import Link from "next/link";
import { MasonryGrid } from "@/components/MasonryGrid";
import { useStore } from "@/components/StoreProvider";
import { products } from "@/lib/products";

export default function SavedPage() {
  const { saved } = useStore();
  const items = saved
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  return (
    <>
      <h1 className="mb-1 text-center text-3xl font-semibold">Your saves</h1>
      <p className="mb-8 text-center text-sm text-zinc-600">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>
      {items.length > 0 ? (
        <MasonryGrid products={items} />
      ) : (
        <div className="py-20 text-center">
          <p className="text-zinc-600">Tap Save on anything you love and it lands here.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Start exploring
          </Link>
        </div>
      )}
    </>
  );
}
