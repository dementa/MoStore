"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, products } from "@/lib/products";
import type { Store } from "@/lib/stores";
import { useStore } from "./StoreProvider";

/** Every product the buyer has chatted about, newest first. Inside a store, only that store's products. */
export function ChatInbox({ store }: { store?: Store }) {
  const { chats } = useStore();
  const threads = Object.entries(chats)
    .flatMap(([id, messages]) => {
      const product = products.find((p) => p.id === id);
      const last = messages.at(-1);
      if (!product || !last || (store && product.seller !== store.name)) return [];
      return [{ product, last }];
    })
    .sort((a, b) => b.last.at - a.last.at);
  const chatHref = (id: string) => (store ? `/${store.slug}/chat/${id}` : `/chat/${id}`);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-semibold">Messages</h1>
      {threads.length === 0 ? (
        <p className="py-16 text-center text-zinc-600">
          No chats yet. Tap <strong>Chat with seller</strong> on any product to ask a question or make an offer.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {threads.map(({ product, last }) => (
            <li key={product.id}>
              <Link href={chatHref(product.id)} className="flex items-center gap-3 rounded-3xl bg-white p-3 hover:shadow-sm">
                <Image
                  src={product.image}
                  alt=""
                  width={56}
                  height={Math.round((56 * product.height) / product.width)}
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-semibold">{product.seller}</p>
                    <span className="shrink-0 text-xs text-zinc-500">
                      {new Date(last.at).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="truncate text-sm text-zinc-600">{product.title}</p>
                  <p className="truncate text-sm">
                    {last.offer ? `You offered ${formatPrice(last.offer)}` : last.text}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
