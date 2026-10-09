import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { StoreHeader } from "@/components/StoreHeader";
import { StorePrompts } from "@/components/StorePrompts";
import { getStore, stores } from "@/lib/stores";

type Props = { params: Promise<{ store: string }> };

export function generateStaticParams() {
  return stores.map((s) => ({ store: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = getStore((await params).store);
  if (!store) return {};
  const icon = (variant: string) => `/${store.slug}/app-icon/${variant}`;

  return {
    title: { default: store.name, template: `%s · ${store.name}` },
    description: store.tagline,
    applicationName: store.name,
    // Points the browser at this store's own manifest, so installing from here
    // installs the store's app, not MoStore.
    manifest: `/${store.slug}/manifest.webmanifest`,
    appleWebApp: { capable: true, title: store.name, statusBarStyle: "default" },
    icons: { icon: icon("192"), apple: icon("180") },
    openGraph: { title: store.name, description: store.tagline, images: [icon("512")] },
  };
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  return { themeColor: getStore((await params).store)?.color ?? "#ffffff" };
}

export default async function StoreLayout({ children, params }: Props & { children: React.ReactNode }) {
  const store = getStore((await params).store);
  if (!store) notFound();

  const brand = {
    "--color-brand": store.color,
    "--color-brand-dark": `color-mix(in srgb, ${store.color} 80%, black)`,
  } as React.CSSProperties;

  return (
    <div style={brand}>
      <StoreHeader store={store} />
      <main className="px-4 pb-16 pt-2">{children}</main>
      <StorePrompts store={store} />
    </div>
  );
}
