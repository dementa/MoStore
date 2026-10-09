import { CategoryChips } from "@/components/CategoryChips";
import { MasonryGrid } from "@/components/MasonryGrid";
import type { Spotlight } from "@/components/SpotlightCard";
import { filterProducts } from "@/lib/products";
import { stores } from "@/lib/stores";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const results = filterProducts(q, category);

  // Feature the shops that sell what's on screen (most products first), with
  // the "sell on MoStore" invite second. Not shown on search results.
  const shops: Spotlight[] = stores
    .map((store) => ({ store, count: results.filter((p) => p.seller === store.name).length }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .map(({ store }) => ({ kind: "shop", store }));
  const spotlights: Spotlight[] = q ? [] : [...shops.slice(0, 1), { kind: "sell" }, ...shops.slice(1)];

  return (
    <>
      <CategoryChips active={category} />
      {q && (
        <h1 className="mb-4 text-2xl font-semibold">
          Results for &ldquo;{q}&rdquo;
        </h1>
      )}
      {results.length > 0 ? (
        <MasonryGrid products={results} spotlights={spotlights} />
      ) : (
        <p className="py-24 text-center text-zinc-500">
          Nothing here yet. Try another search.
        </p>
      )}
    </>
  );
}
