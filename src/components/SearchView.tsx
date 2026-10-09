"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, filterProducts, popularSearches, products, type Product } from "@/lib/products";
import { getStoreProducts, stores, type Store } from "@/lib/stores";
import { MasonryGrid } from "./MasonryGrid";

function Tile({ image, label, href, onClick }: { image: string; label: string; href?: string; onClick?: () => void }) {
  const inner = (
    <>
      <Image src={image} alt="" fill sizes="50vw" className="object-cover" />
      <span className="absolute inset-0 bg-black/45" />
      <span className="relative px-3 text-center text-lg font-semibold leading-tight text-white">{label}</span>
    </>
  );
  const className =
    "relative grid aspect-[2/1] place-items-center overflow-hidden rounded-2xl bg-zinc-200 active:scale-[0.98]";
  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-center text-lg font-semibold">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{children}</div>
    </section>
  );
}

/** Pinterest-style search screen for the marketplace, or for one store when `store` is given. */
export function SearchView({ store }: { store?: Store }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const q = query.trim();

  const scope: Product[] = store ? getStoreProducts(store) : products;
  const firstMatch = (term: string) => scope.find((p) => filterProducts(term).includes(p));
  const results = q ? filterProducts(q).filter((p) => scope.includes(p)) : [];
  const matchingShops = !store && q ? stores.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())) : [];

  // Keep the URL in step with the search box, so results survive back/refresh.
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [q, pathname, router]);

  const base = store ? `/${store.slug}` : "/";
  const shopCategories = categories.filter((c) => scope.some((p) => p.category === c));
  const shopImage = (s: Store) => getStoreProducts(s)[0]?.image;

  return (
    <div className="mx-auto max-w-5xl">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          (document.activeElement as HTMLElement | null)?.blur();
        }}
      >
        <label className="flex h-14 items-center gap-3 rounded-2xl border-2 border-zinc-300 px-4 focus-within:border-zinc-500">
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 fill-black" aria-hidden>
            <path d="M10 2a8 8 0 0 1 6.32 12.9l5.39 5.4-1.42 1.4-5.39-5.38A8 8 0 1 1 10 2Zm0 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" />
          </svg>
          <input
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={store ? `Search ${store.name}` : "Search MoStore"}
            aria-label="Search"
            className="w-full bg-transparent text-base outline-none placeholder:text-zinc-500 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-zinc-200"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-black" aria-hidden>
                <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z" />
              </svg>
            </button>
          )}
        </label>
      </form>

      {q ? (
        <div className="mt-6">
          {matchingShops.length > 0 && (
            <div className="no-scrollbar mb-6 flex gap-3 overflow-x-auto">
              {matchingShops.map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="flex shrink-0 items-center gap-2 rounded-full bg-zinc-100 py-1.5 pl-1.5 pr-4"
                >
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white"
                    style={{ background: s.color }}
                  >
                    {s.name[0]}
                  </span>
                  <span className="text-sm font-semibold">{s.name}</span>
                </Link>
              ))}
            </div>
          )}
          {results.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-zinc-600">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              <MasonryGrid
                products={results}
                basePath={store ? `/${store.slug}/p` : undefined}
                showSeller={!store}
              />
            </>
          ) : (
            matchingShops.length === 0 && (
              <p className="py-16 text-center text-zinc-500">No results for &ldquo;{q}&rdquo;. Try another word.</p>
            )
          )}
        </div>
      ) : (
        <>
          {shopCategories.length > 1 && (
            <Section title="Ideas for you">
              {shopCategories.map((c) => {
                const image = scope.find((p) => p.category === c)?.image;
                return image ? (
                  <Tile key={c} image={image} label={c} href={`${base}?category=${c.toLowerCase()}`} />
                ) : null;
              })}
            </Section>
          )}

          {store ? (
            <Section title={`Popular in ${store.name}`}>
              {scope.slice(0, 8).map((p) => (
                <Tile key={p.id} image={p.image} label={p.title} href={`/${store.slug}/p/${p.id}`} />
              ))}
            </Section>
          ) : (
            <>
              <Section title="Popular on MoStore">
                {popularSearches.map((term) => {
                  const image = firstMatch(term)?.image;
                  return image ? <Tile key={term} image={image} label={term} onClick={() => setQuery(term)} /> : null;
                })}
              </Section>
              <Section title="Shops on MoStore">
                {stores.map((s) => {
                  const image = shopImage(s);
                  return image ? <Tile key={s.slug} image={image} label={s.name} href={`/${s.slug}`} /> : null;
                })}
              </Section>
            </>
          )}
        </>
      )}
    </div>
  );
}
