"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatAmount, formatPrice, type Product } from "@/lib/products";
import { getStoreByName, type Store } from "@/lib/stores";
import { BottomSheet } from "./BottomSheet";
import { StoreLogo } from "./StoreLogo";
import { type ChatMessage, useStore } from "./StoreProvider";

const QUICK_QUESTIONS = [
  "Is this still available?",
  "What's your best price?",
  "Do you deliver to my area?",
  "Can I see more photos?",
];

const time = (at: number) => new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

/**
 * A buyer's conversation with the seller about one product: questions, and
 * price offers for negotiating. Messages stay on this phone until sellers can
 * sign in and reply.
 */
export function ChatView({ product, store, startWithOffer }: { product: Product; store?: Store; startWithOffer?: boolean }) {
  const { chats, sendMessage } = useStore();
  const messages = chats[product.id] ?? [];
  const seller = getStoreByName(product.seller);
  const [text, setText] = useState("");
  const [offering, setOffering] = useState(!!startWithOffer);
  const endRef = useRef<HTMLDivElement>(null);
  const productHref = store ? `/${store.slug}/p/${product.id}` : `/product/${product.id}`;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  function send(body: string) {
    const trimmed = body.trim();
    if (!trimmed) return;
    sendMessage(product.id, { text: trimmed });
    setText("");
  }

  return (
    <>
      <div className="mx-auto flex max-w-2xl flex-col pb-44">
        <Link href={productHref} className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm">
          <Image
            src={product.image}
            alt=""
            width={56}
            height={Math.round((56 * product.height) / product.width)}
            className="h-14 w-14 shrink-0 rounded-2xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{product.title}</p>
            <p className="text-sm text-zinc-600">{formatPrice(product.price)}</p>
          </div>
          {seller && <StoreLogo store={seller} size={36} />}
        </Link>

        <p className="mx-auto mt-4 max-w-xs text-center text-xs text-zinc-500">
          Seller replies are coming soon. For now your messages are saved on this phone.
        </p>

        {messages.length === 0 ? (
          <div className="mt-10 text-center">
            <h1 className="text-xl font-semibold">Ask {product.seller}</h1>
            <p className="mt-1 text-sm text-zinc-600">Ask a question or make an offer on this item.</p>
          </div>
        ) : (
          <ol className="mt-6 flex flex-col gap-2">
            {messages.map((m) => (
              <Bubble key={m.id} message={m} product={product} />
            ))}
          </ol>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-canvas/95 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="shrink-0 rounded-full bg-white px-3.5 py-2 text-sm shadow-sm hover:bg-zinc-50"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
            className="flex items-center gap-2 px-4"
          >
            <button
              type="button"
              onClick={() => setOffering(true)}
              className="shrink-0 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white"
            >
              Make offer
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message"
              aria-label="Message"
              enterKeyHint="send"
              className="min-w-0 flex-1 rounded-full bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={!text.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-white disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {offering && (
        <OfferSheet
          product={product}
          onClose={() => setOffering(false)}
          onOffer={(amount) => {
            sendMessage(product.id, { offer: amount });
            setOffering(false);
          }}
        />
      )}
    </>
  );
}

function Bubble({ message, product }: { message: ChatMessage; product: Product }) {
  const mine = message.from === "buyer";
  const side = mine ? "self-end items-end" : "self-start items-start";

  if (message.offer) {
    const off = Math.round((1 - message.offer / product.price) * 100);
    return (
      <li className={`flex max-w-[80%] flex-col ${side}`}>
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-2 ring-brand">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">Offer</p>
          <p className="mt-1 text-2xl font-semibold">{formatPrice(message.offer)}</p>
          <p className="text-sm text-zinc-600">
            {off > 0 ? `${off}% below ` : ""}
            <span className="line-through">{formatPrice(product.price)}</span>
          </p>
          <p className="mt-3 rounded-full bg-zinc-100 px-3 py-1 text-center text-xs font-semibold text-zinc-600">
            Waiting for {product.seller}
          </p>
        </div>
        <span className="mt-1 px-2 text-[11px] text-zinc-500">{time(message.at)}</span>
      </li>
    );
  }

  return (
    <li className={`flex max-w-[80%] flex-col ${side}`}>
      <p
        className={`whitespace-pre-wrap break-words rounded-3xl px-4 py-2.5 text-sm ${
          mine ? "rounded-br-lg bg-brand text-white" : "rounded-bl-lg bg-white shadow-sm"
        }`}
      >
        {message.text}
      </p>
      <span className="mt-1 px-2 text-[11px] text-zinc-500">{time(message.at)}</span>
    </li>
  );
}

// Offers round to the nearest thousand shillings.
const roundOffer = (n: number) => Math.round(n / 1000) * 1000;

function OfferSheet({
  product,
  onClose,
  onOffer,
}: {
  product: Product;
  onClose: () => void;
  onOffer: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("");
  const value = Number(amount.replace(/\D/g, ""));
  const suggestions = [5, 10, 15].map((pct) => ({ pct, value: roundOffer(product.price * (1 - pct / 100)) }));
  const error = !value
    ? null
    : value >= product.price
      ? "That's the full price. Add it to your cart instead."
      : value < product.price / 2
        ? "That's less than half the price. Sellers rarely accept offers that low."
        : null;
  const canSend = value > 0 && value < product.price;

  return (
    <BottomSheet onClose={onClose} labelledBy="offer-title">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSend) onOffer(value);
        }}
      >
        <h2 id="offer-title" className="text-lg font-semibold">
          Make an offer
        </h2>
        <p className="text-sm text-zinc-600">
          {product.seller} is asking {formatPrice(product.price)}.
        </p>

        <label className="mt-5 flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 focus-within:ring-2 focus-within:ring-brand">
          <span className="text-sm font-semibold text-zinc-500">UGX</span>
          <input
            autoFocus
            inputMode="numeric"
            aria-label="Your offer in UGX"
            placeholder="0"
            value={value ? formatAmount(value) : ""}
            onChange={(e) => setAmount(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-2xl font-semibold outline-none"
          />
        </label>
        {error && <p className="mt-2 text-xs text-zinc-700">{error}</p>}

        <div className="mt-3 flex gap-2">
          {suggestions.map((s) => (
            <button
              key={s.pct}
              type="button"
              onClick={() => setAmount(String(s.value))}
              className={`flex-1 rounded-2xl px-2 py-2 text-center ring-1 ${
                value === s.value ? "bg-zinc-50 ring-2 ring-black" : "ring-zinc-200 hover:bg-zinc-50"
              }`}
            >
              <span className="block text-sm font-semibold">{formatAmount(s.value)}</span>
              <span className="block text-xs text-zinc-600">{s.pct}% off</span>
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className="mt-6 w-full rounded-full bg-brand py-3.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          {canSend ? `Offer ${formatPrice(value)}` : "Send offer"}
        </button>
      </form>
    </BottomSheet>
  );
}
