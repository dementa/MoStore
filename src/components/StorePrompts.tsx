"use client";

import { useEffect, useState } from "react";
import type { Store } from "@/lib/stores";
import { useInstall } from "@/lib/useInstall";
import { usePush } from "@/lib/usePush";
import { BottomSheet } from "./BottomSheet";
import { StoreLogo } from "./StoreLogo";

const SHOW_AFTER_MS = 1500;

type Step = "install" | "notify";

/**
 * The popups a customer sees on a store link: first "install the app", then
 * "turn on notifications". Browsers only open their own install and permission
 * dialogs after a tap, so each popup's main button is that tap. "Not now" hides
 * a popup until the customer's next visit.
 */
export function StorePrompts({ store }: { store: Store }) {
  const { installed, canInstall, isIOS, install } = useInstall();
  const push = usePush(store.slug);
  const [step, setStep] = useState<Step | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const key = (s: Step) => `mostore:${s}-dismissed:${store.slug}`;
  const wasDismissed = (s: Step) => {
    try {
      return !!sessionStorage.getItem(key(s));
    } catch {
      return false;
    }
  };

  const wantsInstall = !installed && (canInstall || isIOS);
  // iPhone only allows notifications inside the installed app.
  const wantsNotify =
    push.ready && push.supported && !push.subscribed && push.permission === "default" && !(isIOS && !installed);

  const nextAfterInstall = (): Step | null => (wantsNotify && !wasDismissed("notify") ? "notify" : null);

  useEffect(() => {
    if (step) return;
    const timer = setTimeout(() => {
      if (wantsInstall && !wasDismissed("install")) setStep("install");
      else setStep(nextAfterInstall());
    }, SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  });

  function dismiss() {
    if (!step) return;
    try {
      sessionStorage.setItem(key(step), "1");
    } catch {}
    setMessage(null);
    setStep(step === "install" ? nextAfterInstall() : null);
  }

  async function onInstall() {
    const accepted = await install();
    // Installed from this tab: move straight on to notifications.
    if (accepted) setStep(nextAfterInstall());
    else dismiss();
  }

  async function onEnable() {
    setBusy(true);
    try {
      const result = await push.enable();
      if (Notification.permission === "granted") setStep(null);
      else setMessage(result);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (!step) return null;

  return (
    <BottomSheet key={step} onClose={dismiss} labelledBy="prompt-title">
      {step === "install" ? (
        <>
          <div className="flex items-center gap-4">
            <StoreLogo store={store} size={64} />
            <div>
              <h2 id="prompt-title" className="text-lg font-semibold">
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
                  <svg
                    viewBox="0 0 24 24"
                    className="inline h-5 w-5 fill-sky-600 align-text-bottom"
                    aria-label="Share icon"
                  >
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
        </>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <StoreLogo store={store} size={64} />
              <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-white shadow">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-brand" aria-hidden>
                  <path d="M12 2a7 7 0 0 1 7 7v4.6l1.7 2.9A1 1 0 0 1 19.8 18H4.2a1 1 0 0 1-.9-1.5L5 13.6V9a7 7 0 0 1 7-7Zm-3 17h6a3 3 0 0 1-6 0Z" />
                </svg>
              </span>
            </div>
            <div>
              <h2 id="prompt-title" className="text-lg font-semibold">
                Turn on notifications?
              </h2>
              <p className="text-sm text-zinc-600">
                Be first to know when {store.name} adds new arrivals or runs a deal.
              </p>
            </div>
          </div>
          <button
            onClick={onEnable}
            disabled={busy}
            className="mt-6 w-full rounded-full bg-brand py-3.5 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {busy ? "Turning on…" : "Turn on"}
          </button>
          {message && <p className="mt-3 text-center text-sm text-zinc-700">{message}</p>}
        </>
      )}

      <button
        onClick={dismiss}
        className="mt-3 w-full rounded-full py-3 text-sm font-semibold text-zinc-600 hover:bg-zinc-100"
      >
        Not now
      </button>
    </BottomSheet>
  );
}
