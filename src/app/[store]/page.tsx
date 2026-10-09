import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryChips } from "@/components/CategoryChips";
import { MasonryGrid } from "@/components/MasonryGrid";
import { ShareButton } from "@/components/ShareButton";
import { StoreLogo } from "@/components/StoreLogo";
import { categories, filterProducts } from "@/lib/products";
import { getStore, getStoreProducts, storeCover } from "@/lib/stores";

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
  const cover = storeCover(store);

  return (
    <>
      <section className="mb-10 flex flex-col items-center text-center">
        <div
          className="relative h-44 w-full overflow-hidden rounded-[28px] sm:h-72"
          style={{ background: store.color }}
        >
          {cover && (
            <Image src={cover} alt="" fill priority sizes="100vw" className="object-cover" />
          )}
          <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
        {/* Logo overlaps the bottom edge of the cover, like a profile photo. */}
        <div className="relative -mt-14 rounded-full ring-[6px] ring-canvas sm:-mt-16">
          <StoreLogo store={store} size={112} />
        </div>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{store.name}</h1>
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
