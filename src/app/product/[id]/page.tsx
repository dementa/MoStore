import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MasonryGrid } from "@/components/MasonryGrid";
import { ProductActions } from "@/components/ProductActions";
import { formatPrice, getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
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
      <article className="mx-auto mb-12 grid max-w-5xl overflow-hidden rounded-[32px] shadow-[0_1px_20px_rgba(0,0,0,0.1)] md:grid-cols-2">
        <Image
          src={product.image}
          alt={product.title}
          width={product.width}
          height={product.height}
          sizes="(max-width: 768px) 100vw, 512px"
          priority
          className="h-auto w-full"
        />
        <div className="flex flex-col gap-6 p-8">
          <ProductActions id={product.id} />
          <div>
            <Link
              href={`/?category=${product.category.toLowerCase()}`}
              className="text-sm text-zinc-600 underline-offset-2 hover:underline"
            >
              {product.category}
            </Link>
            <h1 className="mt-1 text-3xl font-semibold">{product.title}</h1>
            <p className="mt-3 text-2xl font-semibold">{formatPrice(product.price)}</p>
            <p className="mt-4 text-zinc-700">{product.description}</p>
          </div>
          <div className="mt-auto flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-zinc-200 text-lg font-bold">
              {product.seller[0]}
            </span>
            <div>
              <p className="font-semibold">{product.seller}</p>
              <p className="text-sm text-zinc-600">Independent seller</p>
            </div>
          </div>
        </div>
      </article>

      <h2 className="mb-6 text-center text-xl font-semibold">More like this</h2>
      <MasonryGrid products={related} />
    </>
  );
}
