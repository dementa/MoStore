"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { shareLink } from "@/lib/share";
import { getStoreProducts, storeCover, type Store } from "@/lib/stores";
import { StoreLogo } from "./StoreLogo";
import { useStore } from "./StoreProvider";

const HEART =
  "M12 21s-7.5-4.6-9.6-9.3C.9 8.3 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.5.8-1.3 2.3-2.5 4.4-2.5 3.6 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21Z";

/** A shop with its cover photo, a follow heart, and Visit / Share buttons. */
export function ShopCard({ store }: { store: Store }) {
  const { isFollowing, toggleFollow } = useStore();
  const [copied, setCopied] = useState(false);
  const following = isFollowing(store.slug);
  const items = getStoreProducts(store);
  const cover = storeCover(store);

  async function share() {
    const text = `${store.name}: ${store.tagline}`;
    if ((await shareLink({ title: store.name, text, path: `/${store.slug}` })) === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <div className="overflow-hidden rounded-[26px] bg-white p-2 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-zinc-800">
        <Link href={`/${store.slug}`} className="absolute inset-0" aria-label={`Visit ${store.name}`}>
          {cover && <Image src={cover} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />}
          <span className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-black/65 to-transparent" />
          <span className="absolute left-3 top-3 flex items-center gap-2.5 pr-14 text-white">
            <span className="rounded-full ring-2 ring-white/80">
              <StoreLogo store={store} size={40} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-semibold leading-tight">{store.name}</span>
              <span className="block truncate text-xs text-white/75">
                @{store.slug} · {items.length} products
              </span>
            </span>
          </span>
        </Link>
        <button
          onClick={() => toggleFollow(store.slug)}
          aria-pressed={following}
          aria-label={following ? `Unfollow ${store.name}` : `Follow ${store.name}`}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-black/35 backdrop-blur active:scale-90"
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-5 w-5 ${following ? "fill-red-500 stroke-red-500" : "fill-none stroke-white"}`}
            strokeWidth="2"
            aria-hidden
          >
            <path d={HEART} />
          </svg>
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-2">
        <Link
          href={`/${store.slug}`}
          className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-100 text-sm font-medium hover:bg-zinc-200"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 14.5 15 9M10 9h5v5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Visit shop
        </Link>
        <button
          onClick={share}
          className="h-11 rounded-2xl bg-black text-sm font-medium text-white hover:bg-zinc-800"
        >
          {copied ? "Link copied" : "Share shop"}
        </button>
      </div>
    </div>
  );
}
