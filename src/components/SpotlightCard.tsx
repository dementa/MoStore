import Image from "next/image";
import Link from "next/link";
import { getStoreProducts, storeCover, type Store } from "@/lib/stores";

export type Spotlight = { kind: "shop"; store: Store } | { kind: "sell" };

const SELL_IMAGE = "https://picsum.photos/seed/marketstall/600/750?grayscale";

/** Dark promo card mixed into the feed: a featured shop, or an invite to sell on MoStore. */
export function SpotlightCard({ spotlight }: { spotlight: Spotlight }) {
  const content =
    spotlight.kind === "shop"
      ? {
          eyebrow: "Featured shop",
          title: spotlight.store.name,
          text: `${spotlight.store.tagline}. ${getStoreProducts(spotlight.store).length} products, and its own app.`,
          image: storeCover(spotlight.store),
          href: `/${spotlight.store.slug}`,
          cta: "Visit shop",
        }
      : {
          eyebrow: "For shop owners",
          title: "Open your store on MoStore",
          text: "Your own link and app, and notifications to bring customers back.",
          image: SELL_IMAGE,
          href: "/sell",
          cta: "Get started",
        };

  return (
    <div className="mb-2 break-inside-avoid rounded-[22px] bg-black p-1.5 text-white sm:mb-4 sm:rounded-[28px] sm:p-2">
      {content.image && (
        <Link href={content.href} tabIndex={-1} aria-hidden className="relative block aspect-[4/5] overflow-hidden rounded-[17px] sm:rounded-[22px]">
          <Image src={content.image} alt="" fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover" />
        </Link>
      )}
      <div className="flex flex-col items-center px-2 pb-3 pt-3 text-center sm:px-4 sm:pb-4 sm:pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 sm:text-xs">{content.eyebrow}</p>
        <h3 className="mt-1 text-base font-semibold leading-tight sm:text-xl">{content.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-xs text-zinc-400 sm:text-sm">{content.text}</p>
        <Link
          href={content.href}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-800 py-1 pl-4 pr-1 text-xs font-medium hover:bg-zinc-700 sm:text-sm"
        >
          {content.cta}
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black sm:h-8 sm:w-8">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
