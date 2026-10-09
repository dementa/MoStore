import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sell on MoStore",
  description: "Open your own store on MoStore: your own link, your own app, and notifications to bring customers back.",
};

const BENEFITS = [
  {
    title: "Your own link",
    text: "Share mostore.com/your-shop on WhatsApp, Instagram or TikTok. Customers land straight in your store.",
  },
  {
    title: "Your own app",
    text: "Customers install your shop on their phone with your name and logo. No app store needed.",
  },
  {
    title: "Bring customers back",
    text: "Send notifications about new arrivals and deals to everyone who turned them on.",
  },
];

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <section className="rounded-[28px] bg-black px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">For shop owners</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">Open your store on MoStore</h1>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">
          List your products, share one link, and sell to customers who can install your shop like an app.
        </p>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-800 px-5 py-3 text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-amber-400" aria-hidden />
          Store sign-up opens soon
        </p>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {BENEFITS.map((b) => (
          <div key={b.title} className="rounded-[24px] bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
            <h2 className="font-semibold">{b.title}</h2>
            <p className="mt-1.5 text-sm text-zinc-600">{b.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-zinc-600">See what your store could look like:</p>
        <Link
          href="/goba-collections"
          className="inline-flex items-center gap-2 rounded-full bg-white py-1 pl-5 pr-1 text-sm font-semibold shadow-sm hover:bg-zinc-50"
        >
          Visit Goba Collections
          <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
