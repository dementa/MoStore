import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryChips } from "@/components/CategoryChips";
import { MasonryGrid } from "@/components/MasonryGrid";
import { ShareButton } from "@/components/ShareButton";
import { StoreLogo } from "@/components/StoreLogo";
import { categories, filterProducts } from "@/lib/products";
import { getStore, getStoreProducts } from "@/lib/stores";

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const store = getStore((await params).store);
  if (!store) notFound();
  const { category } = await searchParams;
  const items = getStoreProducts(store);
  const shown = category ? filterProducts(undefined, category).filter((p) => items.includes(p)) : items;
  const storeCategories = categories.filter((c) => items.some((p) => p.category === c));

  return (
    <>
      <section className="mb-10 flex flex-col items-center pt-6 text-center">
        <StoreLogo store={store} size={112} />
        <h1 className="mt-4 text-4xl font-semibold">{store.name}</h1>
        <p className="mt-2 text-zinc-600">{store.tagline}</p>
        <p className="mt-1 text-sm font-semibold">
          {items.length} {items.length === 1 ? "product" : "products"}
        </p>
        <div className="mt-5">
          <ShareButton title={store.name} path={`/${store.slug}`} />
        </div>
      </section>

      {storeCategories.length > 1 && (
        <CategoryChips base={`/${store.slug}`} categories={storeCategories} active={category} />
      )}
      <MasonryGrid products={shown} basePath={`/${store.slug}/p`} showSeller={false} />

      <footer className="mt-16 text-center text-xs text-zinc-500">
        Powered by{" "}
        <Link href="/" className="font-semibold hover:underline">
          MoStore
        </Link>
      </footer>
    </>
  );
}
