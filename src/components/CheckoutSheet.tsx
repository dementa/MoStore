"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/products";
import { BottomSheet } from "./BottomSheet";

type Method = "mtn" | "airtel" | "bank" | "cod";

const METHODS: {
  id: Method;
  name: string;
  detail: string;
  badge: { text: string; className: string };
  comingSoon?: boolean;
}[] = [
  {
    id: "mtn",
    name: "MTN Mobile Money",
    detail: "Approve the payment on your phone",
    badge: { text: "MTN", className: "bg-yellow-400 text-black" },
  },
  {
    id: "airtel",
    name: "Airtel Money",
    detail: "Approve the payment on your phone",
    badge: { text: "Airtel", className: "bg-red-600 text-white" },
  },
  {
    id: "cod",
    name: "Cash on delivery",
    detail: "Pay when your order arrives",
    badge: { text: "Cash", className: "bg-emerald-600 text-white" },
  },
  {
    id: "bank",
    name: "Bank transfer",
    detail: "Coming soon",
    badge: { text: "Bank", className: "bg-zinc-200 text-zinc-600" },
    comingSoon: true,
  },
];

type Details = { name: string; phone: string; address: string };

const DETAILS_KEY = "mostore:checkout-details";

// Ugandan numbers: 07XXXXXXXX or +256 7XXXXXXXX.
const isPhone = (s: string) => /^(?:0|\+?256)7\d{8}$/.test(s.replace(/[\s-]/g, ""));

/** Asks for delivery details and how the customer wants to pay, then confirms the order. */
export function CheckoutSheet({
  total,
  itemCount,
  onClose,
}: {
  total: number;
  itemCount: number;
  /** `placed` is true once the order went through, so the cart can be emptied. */
  onClose: (placed: boolean) => void;
}) {
  const [details, setDetails] = useState<Details>({ name: "", phone: "", address: "" });
  const [method, setMethod] = useState<Method | null>(null);
  const [momoPhone, setMomoPhone] = useState("");
  const [tried, setTried] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Fill in what the customer typed last time.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DETAILS_KEY);
      if (raw) setDetails((d) => ({ ...d, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  const set = (field: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDetails((d) => ({ ...d, [field]: e.target.value }));

  const isMomo = method === "mtn" || method === "airtel";
  const payPhone = momoPhone || details.phone;
  const errors = {
    name: !details.name.trim() && "Enter your name",
    phone: !isPhone(details.phone) && "Enter a phone number like 0772 123456",
    address: !details.address.trim() && "Enter where we should deliver",
    method: !method && "Choose how you'll pay",
    momoPhone: isMomo && !isPhone(payPhone) && "Enter the mobile money number",
  };
  const valid = !Object.values(errors).some(Boolean);

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!valid) return;
    try {
      const { name, phone, address } = details;
      localStorage.setItem(DETAILS_KEY, JSON.stringify({ name, phone, address }));
    } catch {}
    setPlaced(true);
  }

  if (placed) {
    const chosen = METHODS.find((m) => m.id === method)!;
    return (
      <BottomSheet onClose={() => onClose(true)} labelledBy="checkout-title">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-emerald-600" aria-hidden>
              <path d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7l-9.2 9.2Z" />
            </svg>
          </div>
          <h2 id="checkout-title" className="mt-4 text-lg font-semibold">
            Order placed
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            {isMomo
              ? `Watch for a ${chosen.name} prompt on ${payPhone} to pay ${formatPrice(total)}.`
              : `Have ${formatPrice(total)} ready when your order arrives.`}{" "}
            We&apos;ll call {details.phone} to confirm delivery.
          </p>
        </div>
        <button
          onClick={() => onClose(true)}
          className="mt-6 w-full rounded-full bg-brand py-3.5 font-semibold text-white hover:bg-brand-dark"
        >
          Done
        </button>
      </BottomSheet>
    );
  }

  const field = "w-full rounded-2xl bg-zinc-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand";
  const error = (msg: string | false) => tried && msg && <p className="mt-1 text-xs text-brand">{msg}</p>;

  return (
    <BottomSheet onClose={() => onClose(false)} labelledBy="checkout-title">
      <form onSubmit={placeOrder} noValidate className="flex max-h-[80dvh] flex-col">
        <div className="flex items-baseline justify-between">
          <h2 id="checkout-title" className="text-lg font-semibold">
            Checkout
          </h2>
          <p className="text-sm text-zinc-600">
            {itemCount} {itemCount === 1 ? "item" : "items"} · <strong className="text-black">{formatPrice(total)}</strong>
          </p>
        </div>

        <div className="-mx-6 mt-4 flex flex-col gap-5 overflow-y-auto px-6 pb-1">
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-sm font-semibold">Delivery details</legend>
            <div>
              <input className={field} placeholder="Full name" autoComplete="name" value={details.name} onChange={set("name")} />
              {error(errors.name)}
            </div>
            <div>
              <input
                className={field}
                placeholder="Phone number"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={details.phone}
                onChange={set("phone")}
              />
              {error(errors.phone)}
            </div>
            <div>
              <input
                className={field}
                placeholder="Delivery address, e.g. Plot 12, Ntinda, Kampala"
                autoComplete="street-address"
                value={details.address}
                onChange={set("address")}
              />
              {error(errors.address)}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 flex w-full items-baseline justify-between text-sm font-semibold">
              Payment method
              {method && (
                <button type="button" onClick={() => setMethod(null)} className="text-brand">
                  Change
                </button>
              )}
            </legend>
            <div className="flex flex-col gap-2">
              {/* Once a method is picked the others hide to give its fields room. */}
              {METHODS.filter((m) => !method || m.id === method).map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 rounded-2xl p-3 ring-1 ${
                    m.comingSoon
                      ? "cursor-not-allowed opacity-50 ring-zinc-200"
                      : method === m.id
                        ? "cursor-pointer bg-zinc-50 ring-2 ring-black"
                        : "cursor-pointer ring-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={method === m.id}
                    disabled={m.comingSoon}
                    onChange={() => setMethod(m.id)}
                    className="sr-only"
                  />
                  <span
                    className={`grid h-10 w-12 shrink-0 place-items-center rounded-xl text-xs font-bold ${m.badge.className}`}
                  >
                    {m.badge.text}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{m.name}</span>
                    <span className="block text-xs text-zinc-600">{m.detail}</span>
                  </span>
                  {m.comingSoon ? (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
                      Soon
                    </span>
                  ) : (
                    <span
                      className={`h-5 w-5 shrink-0 rounded-full ring-2 ${
                        method === m.id ? "bg-black ring-black [box-shadow:inset_0_0_0_4px_white]" : "ring-zinc-300"
                      }`}
                    />
                  )}
                </label>
              ))}
            </div>
            {error(errors.method)}

            {isMomo && (
              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold text-zinc-600" htmlFor="momo-phone">
                  {method === "mtn" ? "MTN" : "Airtel"} number to pay from
                </label>
                <input
                  id="momo-phone"
                  className={field}
                  type="tel"
                  inputMode="tel"
                  placeholder={details.phone || "07XX XXXXXX"}
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                />
                <p className="mt-1 text-xs text-zinc-600">Leave empty to use your phone number above.</p>
                {error(errors.momoPhone)}
              </div>
            )}
          </fieldset>
        </div>

        <button
          type="submit"
          className="mt-5 w-full shrink-0 rounded-full bg-brand py-3.5 font-semibold text-white hover:bg-brand-dark"
        >
          {method === "cod" ? "Place order" : `Pay ${formatPrice(total)}`}
        </button>
      </form>
    </BottomSheet>
  );
}
