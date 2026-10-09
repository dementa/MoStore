import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SearchView } from "@/components/SearchView";
import { getStore } from "@/lib/stores";

export const metadata: Metadata = { title: "Search" };

export default async function StoreSearchPage({ params }: { params: Promise<{ store: string }> }) {
  const store = getStore((await params).store);
  if (!store) notFound();
  return (
    <Suspense>
      <SearchView store={store} />
    </Suspense>
  );
}
