import Link from "next/link";
import { notFound } from "next/navigation";
import { MasonryGrid } from "@/components/MasonryGrid";
import { ShareButton } from "@/components/ShareButton";
import { StoreLogo } from "@/components/StoreLogo";
import { getStore, getStoreProducts } from "@/lib/stores";

export default async function StorePage({ params }: { params: Promise<{ store: string }> }) {
  const store = getStore((await params).store);
  if (!store) notFound();
  const items = getStoreProducts(store);

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

      <MasonryGrid products={items} basePath={`/${store.slug}/p`} showSeller={false} />

      <footer className="mt-16 text-center text-xs text-zinc-500">
        Powered by{" "}
        <Link href="/" className="font-semibold hover:underline">
          MoStore
        </Link>
      </footer>
    </>
  );
}
