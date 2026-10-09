"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { A11y, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { formatPrice, type Product } from "@/lib/products";
import type { FeaturedPick } from "@/lib/stores";
import { useStore } from "./StoreProvider";

type Item = { product: Product; badge?: FeaturedPick["badge"] };

function FeaturedCard({ item, basePath }: { item: Item; basePath: string }) {
  const { product, badge } = item;
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);
  const href = `${basePath}/${product.id}`;

  function add() {
    // Bags with colours go in as their first colour; the product page lets customers pick.
    addToCart(product.id, product.colors?.[0]?.name);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="rounded-[28px] bg-black p-2 text-white">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden rounded-[22px] bg-zinc-800">
        <Image src={product.image} alt={product.title} fill sizes="(max-width: 640px) 80vw, 33vw" className="object-cover" />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-black/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md">
            {badge}
          </span>
        )}
      </Link>
      <div className="flex flex-col items-center px-3 pb-4 pt-4 text-center">
        <Link href={href} className="line-clamp-1 text-lg font-semibold hover:underline">
          {product.title}
        </Link>
        <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm text-zinc-400">{product.description}</p>
        <p className="mt-2 text-xl font-semibold">{formatPrice(product.price)}</p>
        <button
          onClick={add}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-800 py-1 pl-4 pr-1 text-sm font-medium hover:bg-zinc-700"
        >
          {added ? "Added to cart" : "Add to cart"}
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-black">
            {added ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="m9.5 16.2-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M2.5 3.5h2.2l2.4 11a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.9-1.4L21 8H6" />
                <circle cx="10" cy="20" r="1.3" />
                <circle cx="17" cy="20" r="1.3" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

function Arrow({ dir, setEl }: { dir: "prev" | "next"; setEl: (el: HTMLButtonElement | null) => void }) {
  return (
    <button
      ref={setEl}
      aria-label={dir === "prev" ? "Previous product" : "Next product"}
      className={`absolute top-[40%] z-10 hidden h-12 w-12 place-items-center rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:bg-zinc-50 disabled:opacity-40 sm:grid ${
        dir === "prev" ? "left-2" : "right-2"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/** "Featured products" slider on a store page: the middle card is full size, its neighbours shrink and fade. */
export function FeaturedCarousel({ items, basePath, storeName }: { items: Item[]; basePath: string; storeName: string }) {
  // Swiper needs the actual elements, which only exist after the first render.
  const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
  const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);
  const [dotsEl, setDotsEl] = useState<HTMLDivElement | null>(null);

  if (items.length < 2) return null;

  return (
    <section className="mb-10" aria-labelledby="featured-title">
      <div className="mb-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Our collection</p>
        <h2 id="featured-title" className="mt-1 text-2xl font-semibold sm:text-4xl">
          Featured products
        </h2>
        <p className="mt-1 text-sm text-zinc-600 sm:text-base">Hand-picked by {storeName}</p>
      </div>

      <div className="featured-swiper relative -mx-4 sm:mx-0">
        <Swiper
          modules={[Navigation, Pagination, Keyboard, A11y]}
          centeredSlides
          // Rewind rather than loop: looping needs more slides than are visible at once.
          rewind
          initialSlide={Math.floor(items.length / 2)}
          grabCursor
          keyboard={{ enabled: true }}
          spaceBetween={12}
          slidesPerView={1.3}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 16 },
            1024: { slidesPerView: 3.2, spaceBetween: 20 },
            1280: { slidesPerView: 3.6, spaceBetween: 24 },
          }}
          navigation={prevEl && nextEl ? { prevEl, nextEl, addIcons: false } : false}
          pagination={dotsEl ? { el: dotsEl, clickable: true } : false}
        >
          {items.map((item) => (
            <SwiperSlide key={item.product.id}>
              <FeaturedCard item={item} basePath={basePath} />
            </SwiperSlide>
          ))}
        </Swiper>
        <Arrow dir="prev" setEl={setPrevEl} />
        <Arrow dir="next" setEl={setNextEl} />
      </div>
      <div ref={setDotsEl} className="featured-dots mt-4 flex justify-center gap-1" />
    </section>
  );
}
