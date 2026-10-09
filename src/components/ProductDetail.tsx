import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Product } from "@/lib/products";
import { getStoreByName } from "@/lib/stores";
import { ProductActions } from "./ProductActions";
import { ShareButton } from "./ShareButton";
import { StoreLogo } from "./StoreLogo";

export function ProductDetail({
  product,
  categoryHref,
  productPath,
}: {
  product: Product;
  /** This page's path, for sharing. */
  productPath: string;
  /** Omit inside a store, where there's no category feed to go back to. */
  categoryHref?: string;
}) {
  const store = getStoreByName(product.seller);

  return (
    <article className="mx-auto mb-12 grid max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-[0_1px_20px_rgba(0,0,0,0.1)] md:grid-cols-2">
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
        <div>
          <div className="flex items-center justify-between gap-4">
            {categoryHref ? (
              <Link href={categoryHref} className="text-sm text-zinc-600 underline-offset-2 hover:underline">
                {product.category}
              </Link>
            ) : (
              <p className="text-sm text-zinc-600">{product.category}</p>
            )}
            <ShareButton
              title={product.title}
              text={`${product.title} · ${formatPrice(product.price)}`}
              path={productPath}
              imagePath={`/og/${product.id}`}
            />
          </div>
          <h1 className="mt-1 text-3xl font-semibold">{product.title}</h1>
          <p className="mt-3 text-2xl font-semibold">{formatPrice(product.price)}</p>
          <p className="mt-4 text-zinc-700">{product.description}</p>
        </div>
        <ProductActions id={product.id} colors={product.colors} />
        {store && (
          <Link href={`/${store.slug}`} className="group mt-auto flex items-center gap-3">
            <StoreLogo store={store} size={48} />
            <div>
              <p className="font-semibold group-hover:underline">{store.name}</p>
              <p className="text-sm text-zinc-600">{store.tagline}</p>
            </div>
          </Link>
        )}
      </div>
    </article>
  );
}
