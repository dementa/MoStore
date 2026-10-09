import type { Product } from "@/lib/products";
import { PinCard } from "./PinCard";
import { SpotlightCard, type Spotlight } from "./SpotlightCard";

// Spotlights go after the 4th product, then after every 8 more.
const FIRST_SPOTLIGHT = 4;
const SPOTLIGHT_EVERY = 8;

export function MasonryGrid({
  products,
  basePath,
  showSeller,
  spotlights = [],
}: {
  products: Product[];
  basePath?: string;
  showSeller?: boolean;
  /** Promo cards to mix in among the products. */
  spotlights?: Spotlight[];
}) {
  const items: React.ReactNode[] = [];
  let next = 0;
  products.forEach((p, i) => {
    items.push(<PinCard key={p.id} product={p} basePath={basePath} showSeller={showSeller} />);
    const after = i + 1;
    const due = after >= FIRST_SPOTLIGHT && (after - FIRST_SPOTLIGHT) % SPOTLIGHT_EVERY === 0;
    if (due && next < spotlights.length && after < products.length) {
      const s = spotlights[next++];
      items.push(<SpotlightCard key={s.kind === "shop" ? `shop-${s.store.slug}` : "sell"} spotlight={s} />);
    }
  });

  return (
    <div className="-mx-2 columns-2 gap-2 sm:mx-0 sm:columns-3 sm:gap-4 lg:columns-4 xl:columns-5 2xl:columns-6">
      {items}
    </div>
  );
}
