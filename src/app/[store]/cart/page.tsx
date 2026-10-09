import { notFound } from "next/navigation";
import { CartView } from "@/components/CartView";
import { getStore } from "@/lib/stores";

export default async function StoreCartPage({ params }: { params: Promise<{ store: string }> }) {
  const store = getStore((await params).store);
  if (!store) notFound();
  return <CartView store={store} />;
}
