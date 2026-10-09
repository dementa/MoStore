export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  seller: string;
  image: string;
  width: number;
  height: number;
};

export const categories = [
  "Fashion",
  "Home",
  "Beauty",
  "Tech",
  "Art",
  "Food",
  "Outdoors",
] as const;

export type Category = (typeof categories)[number];

// Placeholder catalog until a real backend exists. Heights vary on purpose so
// the masonry feed gets its staggered look.
const seed: Array<Omit<Product, "image" | "width"> & { imageSeed: string }> = [
  { id: "linen-shirt", title: "Oversized linen shirt", description: "Breathable, relaxed fit linen for warm days.", price: 39, category: "Fashion", seller: "Ama Threads", height: 900, imageSeed: "linen" },
  { id: "ceramic-vase", title: "Hand-thrown ceramic vase", description: "Speckled glaze, each one slightly different.", price: 54, category: "Home", seller: "Clay & Co", height: 720, imageSeed: "vase" },
  { id: "shea-butter", title: "Whipped shea butter", description: "Raw shea whipped with coconut oil and vanilla.", price: 18, category: "Beauty", seller: "Glow Naturals", height: 600, imageSeed: "shea" },
  { id: "wireless-earbuds", title: "Wireless earbuds", description: "30-hour battery, noise isolation, pocket case.", price: 79, category: "Tech", seller: "Volt Shop", height: 520, imageSeed: "earbuds" },
  { id: "abstract-print", title: "Abstract sunset print", description: "Giclée print on archival paper, A3.", price: 32, category: "Art", seller: "Studio Nkem", height: 840, imageSeed: "sunsetart" },
  { id: "spice-set", title: "Jollof spice blend set", description: "Three blends, small-batch, no fillers.", price: 22, category: "Food", seller: "Pepper Pot", height: 640, imageSeed: "spices" },
  { id: "canvas-backpack", title: "Waxed canvas backpack", description: "Water resistant, leather straps, 20L.", price: 95, category: "Outdoors", seller: "Trail Goods", height: 780, imageSeed: "backpack" },
  { id: "gold-hoops", title: "Chunky gold hoops", description: "18k gold plated, hypoallergenic posts.", price: 28, category: "Fashion", seller: "Ama Threads", height: 560, imageSeed: "hoops" },
  { id: "rattan-lamp", title: "Rattan pendant lamp", description: "Woven shade that throws soft patterned light.", price: 68, category: "Home", seller: "Nest Living", height: 960, imageSeed: "lamp" },
  { id: "face-oil", title: "Rosehip face oil", description: "Cold-pressed, for glow and even tone.", price: 26, category: "Beauty", seller: "Glow Naturals", height: 700, imageSeed: "faceoil" },
  { id: "mech-keyboard", title: "Compact mechanical keyboard", description: "75% layout, hot-swap switches, RGB.", price: 119, category: "Tech", seller: "Volt Shop", height: 480, imageSeed: "keyboard" },
  { id: "kente-tote", title: "Kente pattern tote", description: "Hand-woven panel on sturdy cotton.", price: 35, category: "Fashion", seller: "Weave Story", height: 820, imageSeed: "tote" },
  { id: "plant-stand", title: "Mid-century plant stand", description: "Solid wood, fits pots up to 25cm.", price: 45, category: "Home", seller: "Nest Living", height: 880, imageSeed: "plants" },
  { id: "film-camera", title: "Refurbished film camera", description: "35mm point-and-shoot, tested and cleaned.", price: 140, category: "Tech", seller: "Retro Lens", height: 620, imageSeed: "camera" },
  { id: "line-drawing", title: "Minimal line drawing", description: "Framed ink drawing, 30×40cm.", price: 48, category: "Art", seller: "Studio Nkem", height: 740, imageSeed: "lineart" },
  { id: "coffee-beans", title: "Single-origin coffee beans", description: "Medium roast, notes of cocoa and citrus.", price: 16, category: "Food", seller: "Daybreak Roasters", height: 560, imageSeed: "coffee" },
  { id: "hammock", title: "Camping hammock", description: "Parachute nylon with tree straps, 300kg rated.", price: 42, category: "Outdoors", seller: "Trail Goods", height: 680, imageSeed: "hammock" },
  { id: "silk-scarf", title: "Printed silk scarf", description: "Pure silk twill with hand-rolled edges.", price: 58, category: "Fashion", seller: "Weave Story", height: 760, imageSeed: "scarf" },
  { id: "candle-set", title: "Soy candle trio", description: "Cedar, fig and amber. 40-hour burn each.", price: 30, category: "Home", seller: "Clay & Co", height: 540, imageSeed: "candles" },
  { id: "lip-tint", title: "Hibiscus lip tint", description: "Buildable sheer colour, plant-based.", price: 12, category: "Beauty", seller: "Glow Naturals", height: 820, imageSeed: "lips" },
  { id: "honey-jar", title: "Raw forest honey", description: "Unfiltered honey from local beekeepers.", price: 14, category: "Food", seller: "Pepper Pot", height: 700, imageSeed: "honey" },
  { id: "pottery-print", title: "Market day photo print", description: "Signed photographic print, 40×50cm.", price: 60, category: "Art", seller: "Retro Lens", height: 900, imageSeed: "market" },
  { id: "water-bottle", title: "Insulated water bottle", description: "Keeps cold 24h, hot 12h. 750ml.", price: 25, category: "Outdoors", seller: "Trail Goods", height: 600, imageSeed: "bottle" },
  { id: "smart-lamp", title: "Smart desk lamp", description: "Adjustable warmth, USB-C charging base.", price: 64, category: "Tech", seller: "Volt Shop", height: 760, imageSeed: "desklamp" },
];

export const products: Product[] = seed.map(({ imageSeed, ...p }) => ({
  ...p,
  width: 600,
  image: `https://picsum.photos/seed/${imageSeed}/600/${p.height}`,
}));

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function filterProducts(query?: string, category?: string) {
  const q = query?.trim().toLowerCase();
  return products.filter((p) => {
    if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
    if (!q) return true;
    return [p.title, p.description, p.seller, p.category].some((s) =>
      s.toLowerCase().includes(q),
    );
  });
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}
