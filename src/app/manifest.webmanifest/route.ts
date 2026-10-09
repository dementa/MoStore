import type { MetadataRoute } from "next";

// MoStore's own manifest. Served as a route (not the manifest.ts convention) so
// store pages can point at their own manifest instead.
export const dynamic = "force-static";

export function GET() {
  const manifest: MetadataRoute.Manifest = {
    name: "MoStore",
    short_name: "MoStore",
    description: "E-commerce for every one. Discover, save and shop.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Saved", url: "/saved", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Cart", url: "/cart", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
  return Response.json(manifest, { headers: { "Content-Type": "application/manifest+json" } });
}
