"use client";

import { useEffect, useRef, useState } from "react";
import { useInstall } from "@/lib/useInstall";
import { usePush } from "@/lib/usePush";

export function AppMenu({ appName = "MoStore", store }: { appName?: string; store?: string }) {
  const [open, setOpen] = useState(false);
  const { installed, canInstall, isIOS, install } = useInstall();
  const push = usePush(store);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function run(action: () => Promise<string | null>) {
    setBusy(true);
    setMessage(null);
    try {
      setMessage(await action());
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const enableNotifications = () => run(push.enable);
  const disableNotifications = () => run(async () => (await push.disable(), null));
  const test = () => run(async () => (await push.test(), "Test sent."));
  const pushSupported = push.supported;
  const subscribed = push.subscribed;

  const iosNeedsInstall = isIOS && !installed;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="App and notifications"
        aria-expanded={open}
        className="relative grid h-12 w-12 place-items-center rounded-full hover:bg-zinc-100"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-zinc-700" aria-hidden>
          <path d="M12 2a7 7 0 0 1 7 7v4.6l1.7 2.9A1 1 0 0 1 19.8 18H4.2a1 1 0 0 1-.9-1.5L5 13.6V9a7 7 0 0 1 7-7Zm-3 17h6a3 3 0 0 1-6 0Z" />
        </svg>
        {!subscribed && pushSupported && (
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-brand ring-2 ring-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-40 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
          {!installed && (
            <section className="mb-4 border-b border-zinc-100 pb-4">
              <p className="font-semibold">Get the app</p>
              {canInstall ? (
                <>
                  <p className="mt-1 text-sm text-zinc-600">Add {appName} to your home screen for one-tap shopping.</p>
                  <button
                    onClick={install}
                    className="mt-3 w-full rounded-full bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark"
                  >
                    Install {appName}
                  </button>
                </>
              ) : isIOS ? (
                <p className="mt-1 text-sm text-zinc-600">
                  Tap the Share button in Safari, then <strong>Add to Home Screen</strong>.
                </p>
              ) : (
                <p className="mt-1 text-sm text-zinc-600">
                  Use your browser&apos;s menu and choose <strong>Install app</strong> or{" "}
                  <strong>Add to Home screen</strong>.
                </p>
              )}
            </section>
          )}

          <section>
            <p className="font-semibold">Notifications</p>
            {!pushSupported || iosNeedsInstall ? (
              <p className="mt-1 text-sm text-zinc-600">
                {iosNeedsInstall
                  ? `On iPhone and iPad, add ${appName} to your Home Screen first, then turn on notifications from the app.`
                  : "This browser doesn't support push notifications."}
              </p>
            ) : subscribed ? (
              <>
                <p className="mt-1 text-sm text-zinc-600">
                  {store ? `You'll hear about new arrivals and deals from ${appName}.` : "You'll hear about deals on things you save."}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={test}
                    disabled={busy}
                    className="flex-1 rounded-full bg-zinc-100 py-3 text-sm font-semibold hover:bg-zinc-200 disabled:opacity-60"
                  >
                    Send test
                  </button>
                  <button
                    onClick={disableNotifications}
                    disabled={busy}
                    className="flex-1 rounded-full bg-zinc-100 py-3 text-sm font-semibold hover:bg-zinc-200 disabled:opacity-60"
                  >
                    Turn off
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-zinc-600">
                  {store
                    ? `Get alerts when ${appName} adds new arrivals or runs a deal.`
                    : "Get alerts for price drops and new drops from shops you love."}
                </p>
                <button
                  onClick={enableNotifications}
                  disabled={busy}
                  className="mt-3 w-full rounded-full bg-black py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
                >
                  {busy ? "Turning on…" : "Turn on notifications"}
                </button>
              </>
            )}
            {message && <p className="mt-3 text-sm text-zinc-700">{message}</p>}
          </section>
        </div>
      )}
    </div>
  );
}
