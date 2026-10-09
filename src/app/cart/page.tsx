"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import { formatPrice, products } from "@/lib/products";

export default function CartPage() {
  const { cart, setQty } = useStore();
  const lines = cart.flatMap((l) => {
    const product = products.find((p) => p.id === l.id);
    return product ? [{ ...l, product }] : [];
  });
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-3xl font-semibold">Your cart is empty</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Find something you love
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-[1fr_300px]">
      <section>
        <h1 className="mb-6 text-3xl font-semibold">Cart</h1>
        <ul className="flex flex-col gap-4">
          {lines.map(({ id, qty, product }) => (
            <li key={id} className="flex gap-4">
              <Link href={`/product/${id}`} className="shrink-0">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={96}
                  height={Math.round((96 * product.height) / product.width)}
                  className="h-28 w-24 rounded-2xl object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link href={`/product/${id}`} className="font-semibold hover:underline">
                  {product.title}
                </Link>
                <p className="text-sm text-zinc-600">{product.seller}</p>
                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={() => setQty(id, qty - 1)}
                    aria-label="Decrease quantity"
                    className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 hover:bg-zinc-200"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty(id, qty + 1)}
                    aria-label="Increase quantity"
                    className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 hover:bg-zinc-200"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="font-semibold">{formatPrice(product.price * qty)}</p>
            </li>
          ))}
        </ul>
      </section>

      <aside className="h-fit rounded-3xl bg-zinc-100 p-6 md:mt-14">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-zinc-600">Shipping calculated at checkout.</p>
        <button
          disabled
          className="mt-6 w-full rounded-full bg-brand py-3 text-sm font-semibold text-white opacity-60"
          title="Checkout coming soon"
        >
          Checkout (coming soon)
        </button>
      </aside>
    </div>
  );
}
