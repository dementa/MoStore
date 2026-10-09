import type { Product } from "@/lib/products";
import { PinCard } from "./PinCard";

export function MasonryGrid({ products }: { products: Product[] }) {
  return (
    <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
      {products.map((p) => (
        <PinCard key={p.id} product={p} />
      ))}
    </div>
  );
}
