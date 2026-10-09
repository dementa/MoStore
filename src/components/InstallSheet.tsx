"use client";

import { useEffect, useState } from "react";
import type { Store } from "@/lib/stores";
import { useInstall } from "@/lib/useInstall";
import { StoreLogo } from "./StoreLogo";

const SHOW_AFTER_MS = 1200;

/**
 * Slides up on its own when a customer opens a store link, offering to install
 * the store's app. Browsers only open their install dialog after a tap, so this
 * sheet is the tap. "Not now" hides it until the customer's next visit.
 */
export function InstallSheet({ store }: { store: Store }) {
  const { installed, canInstall, isIOS, install } = useInstall();
  const [open, setOpen] = useState(false);
  const dismissKey = `mostore:install-dismissed:${store.slug}`;

  useEffect(() => {
    if (installed || !(canInstall || isIOS)) return;
    try {
      if (sessionStorage.getItem(dismissKey)) return;
    } catch {}
    const timer = setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [installed, canInstall, isIOS, dismissKey]);

  useEffect(() => {
    if (installed) setOpen(false);
  }, [installed]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  function dismiss() {
    try {
      sessionStorage.setItem(dismissKey, "1");
    } catch {}
    setOpen(false);
  }

  async function onInstall() {
    const accepted = await install();
    if (accepted) setOpen(false);
    else dismiss();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={dismiss}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md animate-[slide-up_0.3s_ease-out] rounded-t-3xl bg-white px-6 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl sm:mb-6 sm:rounded-3xl"
      >
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-zinc-200" />
        <div className="flex items-center gap-4">
          <StoreLogo store={store} size={64} />
          <div>
            <h2 id="install-title" className="text-lg font-semibold">
              Get the {store.name} app
            </h2>
            <p className="text-sm text-zinc-600">
              Shop faster and hear about new arrivals first. No app store needed.
            </p>
          </div>
        </div>

        {canInstall ? (
          <button
            onClick={onInstall}
            className="mt-6 w-full rounded-full bg-brand py-3.5 font-semibold text-white hover:bg-brand-dark"
          >
            Install
          </button>
        ) : (
          <ol className="mt-6 flex flex-col gap-3 rounded-2xl bg-zinc-100 p-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white font-semibold">1</span>
              <span>
                Tap the <strong>Share</strong> button{" "}
                <svg viewBox="0 0 24 24" className="inline h-5 w-5 fill-sky-600 align-text-bottom" aria-label="Share icon">
                  <path d="M12 2.6 16.7 7.3l-1.4 1.4L13 6.4V15h-2V6.4L8.7 8.7 7.3 7.3 12 2.6ZM5 10h3v2H6v8h12v-8h-2v-2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1Z" />
                </svg>{" "}
                in Safari&apos;s toolbar
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white font-semibold">2</span>
              <span>
                Choose <strong>Add to Home Screen</strong>
              </span>
            </li>
          </ol>
        )}

        <button onClick={dismiss} className="mt-3 w-full rounded-full py-3 text-sm font-semibold text-zinc-600 hover:bg-zinc-100">
          Not now
        </button>
      </div>
    </div>
  );
}
