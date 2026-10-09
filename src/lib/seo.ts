import type { Metadata } from "next";
import { formatPrice, type Product } from "./products";

/**
 * Link-preview tags for a product page, so WhatsApp, Facebook, X and others
 * show the product card image, name and price when the link is shared.
 */
export function productMetadata(product: Product, path: string): Metadata {
  const description = `${formatPrice(product.price)} · ${product.seller}. ${product.description}`;
  const image = { url: `/og/${product.id}`, width: 1200, height: 630, alt: product.title, type: "image/jpeg" };
  return {
    title: product.title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "MoStore", url: path, title: product.title, description, images: [image] },
    twitter: { card: "summary_large_image", title: product.title, description, images: [image.url] },
  };
}
