"use client";

import { useEffect, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

export function AppMenu() {
  const [open, setOpen] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setPushSupported("serviceWorker" in navigator && "PushManager" in window && "Notification" in window);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .then((reg) => reg.pushManager?.getSubscription())
        .then((sub) => setSubscribed(!!sub))
        .catch(() => {});
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setStandalone(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  async function sendTest(sub: PushSubscription) {
    const res = await fetch("/api/push/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Could not send");
  }

  async function enableNotifications() {
    if (!VAPID_PUBLIC_KEY) return setMessage("Notifications aren't set up on this server yet.");
    setBusy(true);
    setMessage(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("Notifications are blocked. You can allow them in your browser's site settings.");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        }));
      setSubscribed(true);
      await sendTest(sub);
      setMessage("You're in! Check for a test notification.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function disableNotifications() {
    setBusy(true);
    const reg = await navigator.serviceWorker.ready;
    await (await reg.pushManager.getSubscription())?.unsubscribe();
    setSubscribed(false);
    setMessage(null);
    setBusy(false);
  }

  async function test() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sendTest(sub);
      setMessage("Test sent.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const iosNeedsInstall = isIOS && !standalone;

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
          {!standalone && (
            <section className="mb-4 border-b border-zinc-100 pb-4">
              <p className="font-semibold">Get the app</p>
              {installEvent ? (
                <>
                  <p className="mt-1 text-sm text-zinc-600">Add MoStore to your home screen for one-tap shopping.</p>
                  <button
                    onClick={install}
                    className="mt-3 w-full rounded-full bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark"
                  >
                    Install MoStore
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
                  ? "On iPhone and iPad, add MoStore to your Home Screen first, then turn on notifications from the app."
                  : "This browser doesn't support push notifications."}
              </p>
            ) : subscribed ? (
              <>
                <p className="mt-1 text-sm text-zinc-600">You&apos;ll hear about deals on things you save.</p>
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
                <p className="mt-1 text-sm text-zinc-600">Get alerts for price drops and new drops from shops you love.</p>
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
