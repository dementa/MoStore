import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChatView } from "@/components/ChatView";
import { getProduct } from "@/lib/products";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ offer?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProduct((await params).id);
  return product ? { title: `Chat about ${product.title}`, robots: { index: false } } : {};
}

export default async function ChatPage({ params, searchParams }: Props) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  return <ChatView product={product} startWithOffer={(await searchParams).offer === "1"} />;
}
