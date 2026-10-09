import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MasonryGrid } from "@/components/MasonryGrid";
import { ProductDetail } from "@/components/ProductDetail";
import { getProduct, products } from "@/lib/products";
import { productMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const product = getProduct((await params).id);
  return product ? productMetadata(product) : {};
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = [
    ...products.filter((p) => p.id !== id && p.category === product.category),
    ...products.filter((p) => p.id !== id && p.category !== product.category),
  ];

  return (
    <>
      <ProductDetail
        product={product}
        categoryHref={`/?category=${product.category.toLowerCase()}`}
      />
      <h2 className="mb-6 text-center text-xl font-semibold">More like this</h2>
      <MasonryGrid products={related} />
    </>
  );
}
