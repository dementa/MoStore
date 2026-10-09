import type { Product } from "@/lib/products";
import { PinCard } from "./PinCard";

export function MasonryGrid({
  products,
  basePath,
  showSeller,
}: {
  products: Product[];
  basePath?: string;
  showSeller?: boolean;
}) {
  return (
    <div className="-mx-2 columns-2 gap-2 sm:mx-0 sm:columns-3 sm:gap-4 lg:columns-4 xl:columns-5 2xl:columns-6">
      {products.map((p) => (
        <PinCard key={p.id} product={p} basePath={basePath} showSeller={showSeller} />
      ))}
    </div>
  );
}
