import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChatView } from "@/components/ChatView";
import { getProduct } from "@/lib/products";
import { getStore } from "@/lib/stores";

type Props = { params: Promise<{ store: string; id: string }>; searchParams: Promise<{ offer?: string }> };

async function load(params: Props["params"]) {
  const { store: slug, id } = await params;
  const store = getStore(slug);
  const product = getProduct(id);
  if (!store || !product || product.seller !== store.name) notFound();
  return { store, product };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await load(params);
  return { title: `Chat about ${product.title}`, robots: { index: false } };
}

export default async function StoreChatPage({ params, searchParams }: Props) {
  const { store, product } = await load(params);
  return <ChatView product={product} store={store} startWithOffer={(await searchParams).offer === "1"} />;
}
