import { CategoryChips } from "@/components/CategoryChips";
import { MasonryGrid } from "@/components/MasonryGrid";
import { filterProducts } from "@/lib/products";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const results = filterProducts(q, category);

  return (
    <>
      <CategoryChips active={category} />
      {q && (
        <h1 className="mb-4 text-2xl font-semibold">
          Results for &ldquo;{q}&rdquo;
        </h1>
      )}
      {results.length > 0 ? (
        <MasonryGrid products={results} />
      ) : (
        <p className="py-24 text-center text-zinc-500">
          Nothing here yet. Try another search.
        </p>
      )}
    </>
  );
}
