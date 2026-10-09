import { products } from "./products";

export type Store = {
  slug: string;
  name: string;
  tagline: string;
  /** Brand colour used for the app icon, title bar and buttons. */
  color: string;
  /** Uploaded logo. Without one, the app icon is the store's initials on its colour. */
  logo?: string;
};

// Placeholder stores until owners can sign up. A store's link is mostore.com/<slug>.
export const stores: Store[] = [
  { slug: "goba-collections", name: "Goba Collections", tagline: "Everyday pieces with a story", color: "#7c2d12" },
  { slug: "clay-and-co", name: "Clay & Co", tagline: "Handmade ceramics and candles", color: "#a16207" },
  { slug: "glow-naturals", name: "Glow Naturals", tagline: "Plant-based skincare", color: "#15803d" },
  { slug: "volt-shop", name: "Volt Shop", tagline: "Gadgets that just work", color: "#1d4ed8" },
  { slug: "studio-nkem", name: "Studio Nkem", tagline: "Prints and original drawings", color: "#6d28d9" },
  { slug: "pepper-pot", name: "Pepper Pot", tagline: "Spices and pantry goods", color: "#b91c1c" },
  { slug: "trail-goods", name: "Trail Goods", tagline: "Gear for getting outside", color: "#3f6212" },
  { slug: "nest-living", name: "Nest Living", tagline: "Warm, simple homeware", color: "#9a3412" },
  { slug: "weave-story", name: "Weave Story", tagline: "Woven textiles and accessories", color: "#be185d" },
  { slug: "retro-lens", name: "Retro Lens", tagline: "Film cameras and photography", color: "#334155" },
  { slug: "daybreak-roasters", name: "Daybreak Roasters", tagline: "Small-batch coffee", color: "#78350f" },
];

// Paths that belong to MoStore itself and can never be a store slug.
export const RESERVED_SLUGS = ["api", "cart", "saved", "search", "product", "icons", "sw.js", "manifest.webmanifest"];

export function getStore(slug: string) {
  return stores.find((s) => s.slug === slug);
}

export function getStoreByName(name: string) {
  return stores.find((s) => s.name === name);
}

export function getStoreProducts(store: Store) {
  return products.filter((p) => p.seller === store.name);
}

export function storeInitials(name: string) {
  return name
    .replace(/&/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
