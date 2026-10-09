import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MasonryGrid } from "@/components/MasonryGrid";
import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/products";
import { productMetadata } from "@/lib/seo";
import { getStore, getStoreProducts, stores } from "@/lib/stores";

type Props = { params: Promise<{ store: string; id: string }> };

export function generateStaticParams() {
  return stores.flatMap((s) => getStoreProducts(s).map((p) => ({ store: s.slug, id: p.id })));
}

async function load(params: Props["params"]) {
  const { store: slug, id } = await params;
  const store = getStore(slug);
  const product = getProduct(id);
  if (!store || !product || product.seller !== store.name) notFound();
  return { store, product };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { store, product } = await load(params);
  return productMetadata(product, `/${store.slug}/p/${product.id}`);
}

export default async function StoreProductPage({ params }: Props) {
  const { store, product } = await load(params);
  const more = getStoreProducts(store).filter((p) => p.id !== product.id);

  return (
    <>
      <ProductDetail product={product} productPath={`/${store.slug}/p/${product.id}`} />
      {more.length > 0 && (
        <>
          <h2 className="mb-6 text-center text-xl font-semibold">More from {store.name}</h2>
          <MasonryGrid products={more} basePath={`/${store.slug}/p`} showSeller={false} />
        </>
      )}
    </>
  );
}
