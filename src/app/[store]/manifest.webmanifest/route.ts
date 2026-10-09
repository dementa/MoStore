import { getStore, stores } from "@/lib/stores";

export function generateStaticParams() {
  return stores.map((s) => ({ store: s.slug }));
}

// Each store's own app manifest: installing from a store link gives the
// customer an app with the store's name and icon that opens on the store.
export async function GET(_req: Request, { params }: { params: Promise<{ store: string }> }) {
  const store = getStore((await params).store);
  if (!store) return new Response("Not found", { status: 404 });

  const base = `/${store.slug}`;
  const icon = (variant: string) => `${base}/app-icon/${variant}`;

  return Response.json(
    {
      name: store.name,
      short_name: store.name,
      description: store.tagline,
      id: base,
      start_url: base,
      // No trailing slash, so the start page itself is inside the scope.
      scope: base,
      display: "standalone",
      background_color: "#ffffff",
      theme_color: store.color,
      categories: ["shopping"],
      icons: [
        { src: icon("192"), sizes: "192x192", type: "image/png", purpose: "any" },
        { src: icon("512"), sizes: "512x512", type: "image/png", purpose: "any" },
        { src: icon("maskable-512"), sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
      shortcuts: [{ name: "Cart", url: `${base}/cart`, icons: [{ src: icon("192"), sizes: "192x192" }] }],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
