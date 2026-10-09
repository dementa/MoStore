export type ProductColor = { name: string; hex: string };

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
  /** Colours the customer can choose from, when the product comes in more than one. */
  colors?: ProductColor[];
};

export const categories = [
  "Fashion",
  "Shoes",
  "Home",
  "Beauty",
  "Tech",
  "Art",
  "Food",
  "Outdoors",
] as const;

export type Category = (typeof categories)[number];

// Catalog until a real backend exists. Most items are placeholders with
// picsum photos (heights vary on purpose so the masonry feed staggers); real
// products carry their own photo and its size.
type SeedItem = Omit<Product, "image" | "width"> & ({ imageSeed: string } | { image: string; width: number });

const seed: SeedItem[] = [
  { id: "blush-pink-mini-tote", title: "Blush Pink Mini Tote", description: "Smooth leather with rolled handles and gold-tone hardware. Fits your phone, wallet and keys.", price: 250000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/blush-pink-mini-tote.jpg", width: 1200, height: 1200 },
  { id: "ceramic-vase", title: "Hand-thrown ceramic vase", description: "Speckled glaze, each one slightly different.", price: 200000, category: "Home", seller: "Clay & Co", height: 720, imageSeed: "vase" },
  { id: "black-chelsea-boots", title: "Black Leather Chelsea Boots", description: "Smooth black leather with elastic sides and a pull tab. Slips on, dresses up or down.", price: 405000, category: "Shoes", seller: "Kicks by D", image: "/products/kicks-by-d/black-chelsea-boots.jpg", width: 556, height: 695 },
  { id: "shea-butter", title: "Whipped shea butter", description: "Raw shea whipped with coconut oil and vanilla.", price: 67000, category: "Beauty", seller: "Glow Naturals", height: 600, imageSeed: "shea" },
  { id: "tangerine-top-handle-bag", title: "Tangerine Top-Handle Bag", description: "Glossy orange leather with a single top handle and a gold turn-lock flap.", price: 265000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/tangerine-top-handle-bag.jpg", width: 1200, height: 1200 },
  { id: "wireless-earbuds", title: "Wireless earbuds", description: "30-hour battery, noise isolation, pocket case.", price: 290000, category: "Tech", seller: "Volt Shop", height: 520, imageSeed: "earbuds" },
  { id: "burnished-brown-chelsea-boots", title: "Burnished Brown Chelsea Boots", description: "Hand-burnished brown leather on a chunky rubber sole that grips in the rain.", price: 425000, category: "Shoes", seller: "Kicks by D", image: "/products/kicks-by-d/burnished-brown-chelsea-boots.jpg", width: 736, height: 1104 },
  { id: "abstract-print", title: "Abstract sunset print", description: "Giclée print on archival paper, A3.", price: 120000, category: "Art", seller: "Studio Nkem", height: 840, imageSeed: "sunsetart" },
  { id: "cobalt-crossbody-satchel", title: "Cobalt Blue Satchel", description: "Zip-top satchel in bold cobalt leather. Carry it by the handles or with the detachable shoulder strap.", price: 290000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/cobalt-crossbody-satchel.jpg", width: 1200, height: 1200 },
  { id: "spice-set", title: "Jollof spice blend set", description: "Three blends, small-batch, no fillers.", price: 81000, category: "Food", seller: "Pepper Pot", height: 640, imageSeed: "spices" },
  { id: "black-wingtip-lug-derby", title: "Black Wingtip Derbies, Lug Sole", description: "Classic brogue detailing on a thick lug sole. Smart enough for the office, tough enough for the street.", price: 390000, category: "Shoes", seller: "Kicks by D", image: "/products/kicks-by-d/black-wingtip-lug-derby.jpg", width: 744, height: 970 },
  { id: "taupe-scarf-tote", title: "Taupe Tote with Silk Scarf", description: "Roomy pebbled-leather tote with a printed silk scarf tied on the handle. Fits a laptop.", price: 305000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/taupe-scarf-tote.jpg", width: 1000, height: 1500 },
  { id: "canvas-backpack", title: "Waxed canvas backpack", description: "Water resistant, leather straps, 20L.", price: 350000, category: "Outdoors", seller: "Trail Goods", height: 780, imageSeed: "backpack" },
  { id: "rattan-lamp", title: "Rattan pendant lamp", description: "Woven shade that throws soft patterned light.", price: 250000, category: "Home", seller: "Nest Living", height: 960, imageSeed: "lamp" },
  { id: "oxblood-chelsea-boots", title: "Oxblood Chelsea Boots", description: "Deep oxblood leather with a slim profile and a stacked heel.", price: 445000, category: "Shoes", seller: "Kicks by D", image: "/products/kicks-by-d/oxblood-chelsea-boots.jpg", width: 700, height: 933 },
  { id: "face-oil", title: "Rosehip face oil", description: "Cold-pressed, for glow and even tone.", price: 96000, category: "Beauty", seller: "Glow Naturals", height: 700, imageSeed: "faceoil" },
  { id: "mech-keyboard", title: "Compact mechanical keyboard", description: "75% layout, hot-swap switches, RGB.", price: 440000, category: "Tech", seller: "Volt Shop", height: 480, imageSeed: "keyboard" },
  { id: "olive-work-tote", title: "Olive Leather Work Tote", description: "Structured olive leather tote, big enough for a laptop and everything else.", price: 325000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/olive-work-tote.jpg", width: 704, height: 1012 },
  { id: "kente-tote", title: "Kente pattern tote", description: "Hand-woven panel on sturdy cotton.", price: 130000, category: "Fashion", seller: "Weave Story", height: 820, imageSeed: "tote" },
  { id: "black-full-brogue-oxfords", title: "Black Full Brogue Oxfords", description: "High-shine black leather Oxfords with full wingtip broguing. Made for weddings and big days.", price: 460000, category: "Shoes", seller: "Kicks by D", image: "/products/kicks-by-d/black-full-brogue-oxfords.jpg", width: 1200, height: 1200 },
  { id: "ivory-charm-tote", title: "Ivory Tote with Gold Charm", description: "Structured ivory leather tote with a gold chain charm. Dressy enough for evenings.", price: 280000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/ivory-charm-tote.jpg", width: 688, height: 1024 },
  { id: "plant-stand", title: "Mid-century plant stand", description: "Solid wood, fits pots up to 25cm.", price: 165000, category: "Home", seller: "Nest Living", height: 880, imageSeed: "plants" },
  { id: "film-camera", title: "Refurbished film camera", description: "35mm point-and-shoot, tested and cleaned.", price: 520000, category: "Tech", seller: "Retro Lens", height: 620, imageSeed: "camera" },
  { id: "moss-suede-mini-tote", title: "Moss Suede Mini Tote", description: "Soft moss-green suede with winged sides and a gold buckle strap.", price: 260000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/moss-suede-mini-tote.jpg", width: 1024, height: 1536 },
  { id: "line-drawing", title: "Minimal line drawing", description: "Framed ink drawing, 30×40cm.", price: 180000, category: "Art", seller: "Studio Nkem", height: 740, imageSeed: "lineart" },
  { id: "tan-wingtip-brogues", title: "Tan Wingtip Brogues", description: "Hand-finished tan leather with a burnished toe and classic wingtip broguing.", price: 370000, category: "Shoes", seller: "Kicks by D", image: "/products/kicks-by-d/tan-wingtip-brogues.jpg", width: 564, height: 870 },
  { id: "coffee-beans", title: "Single-origin coffee beans", description: "Medium roast, notes of cocoa and citrus.", price: 59000, category: "Food", seller: "Daybreak Roasters", height: 560, imageSeed: "coffee" },
  { id: "hammock", title: "Camping hammock", description: "Parachute nylon with tree straps, 300kg rated.", price: 155000, category: "Outdoors", seller: "Trail Goods", height: 680, imageSeed: "hammock" },
  { id: "saddle-top-handle-bag", title: "Saddle Top-Handle Bag", description: "Curved saddle shape with a gold clasp. Comes in red or black.", price: 245000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/saddle-top-handle-bag.jpg", width: 1080, height: 1080, colors: [{ name: "Red", hex: "#9b1c1c" }, { name: "Black", hex: "#171717" }] },
  { id: "silk-scarf", title: "Printed silk scarf", description: "Pure silk twill with hand-rolled edges.", price: 215000, category: "Fashion", seller: "Weave Story", height: 760, imageSeed: "scarf" },
  { id: "chocolate-wingtip-derbies", title: "Chocolate Wingtip Derbies", description: "Rich chocolate-brown leather derbies with brogue detailing and a leather sole.", price: 435000, category: "Shoes", seller: "Kicks by D", image: "/products/kicks-by-d/chocolate-wingtip-derbies.jpg", width: 1122, height: 1402 },
  { id: "candle-set", title: "Soy candle trio", description: "Cedar, fig and amber. 40-hour burn each.", price: 110000, category: "Home", seller: "Clay & Co", height: 540, imageSeed: "candles" },
  { id: "lip-tint", title: "Hibiscus lip tint", description: "Buildable sheer colour, plant-based.", price: 44000, category: "Beauty", seller: "Glow Naturals", height: 820, imageSeed: "lips" },
  { id: "classic-flap-mini-bag", title: "Classic Flap Mini Bag", description: "Pebbled leather mini bag with a top handle. Comes in tan, black or burgundy.", price: 230000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/classic-flap-mini-bag.jpg", width: 1024, height: 1024, colors: [{ name: "Tan", hex: "#c8956a" }, { name: "Black", hex: "#171717" }, { name: "Burgundy", hex: "#5c1a1f" }] },
  { id: "honey-jar", title: "Raw forest honey", description: "Unfiltered honey from local beekeepers.", price: 52000, category: "Food", seller: "Pepper Pot", height: 700, imageSeed: "honey" },
  { id: "pottery-print", title: "Market day photo print", description: "Signed photographic print, 40×50cm.", price: 220000, category: "Art", seller: "Retro Lens", height: 900, imageSeed: "market" },
  { id: "water-bottle", title: "Insulated water bottle", description: "Keeps cold 24h, hot 12h. 750ml.", price: 92000, category: "Outdoors", seller: "Trail Goods", height: 600, imageSeed: "bottle" },
  { id: "dome-bowling-bag", title: "Dome Bowling Bag", description: "Smooth leather bowling bag with a zip top and rolled handles. Comes in black, ivory or chestnut.", price: 350000, category: "Fashion", seller: "Goba Collections", image: "/products/goba-collections/dome-bowling-bag.jpg", width: 1199, height: 1799, colors: [{ name: "Black", hex: "#171717" }, { name: "Ivory", hex: "#efe9dc" }, { name: "Chestnut", hex: "#5a2e22" }] },
  { id: "smart-lamp", title: "Smart desk lamp", description: "Adjustable warmth, USB-C charging base.", price: 235000, category: "Tech", seller: "Volt Shop", height: 760, imageSeed: "desklamp" },
];

export const products: Product[] = seed.map((item) => {
  if (!("imageSeed" in item)) return item;
  const { imageSeed, ...p } = item;
  return { ...p, width: 600, image: `https://picsum.photos/seed/${imageSeed}/600/${p.height}` };
});

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

/** Prices are in Ugandan shillings, e.g. "UGX 250,000". */
export function formatPrice(n: number) {
  // Formatted by hand so server and every browser print the same thing
  // (browsers disagree on "UGX" vs "USh").
  return `UGX ${formatAmount(n)}`;
}

/** The number part of a price, e.g. "250,000". */
export function formatAmount(n: number) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Shown under "Popular on MoStore" on the search screen. Replace with real
// search counts once there's traffic.
export const popularSearches = ["Tote", "Boots", "Brogues", "Leather", "Ceramic", "Lamp", "Coffee", "Print"];
