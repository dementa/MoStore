"use client";

import { useEffect, useSyncExternalStore } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

type PushState = {
  supported: boolean;
  permission: NotificationPermission;
  subscribed: boolean;
  /** False until the service worker and current subscription have been checked. */
  ready: boolean;
};

// Shared across components, so turning notifications on in one place (the
// popup) updates the others (the bell menu) straight away.
let state: PushState = { supported: false, permission: "default", subscribed: false, ready: false };
const SERVER_STATE = state;
const listeners = new Set<() => void>();
let started = false;

function set(patch: Partial<PushState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function start() {
  if (started) return;
  started = true;
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  if (!("serviceWorker" in navigator)) return set({ ready: true });

  navigator.serviceWorker
    .register("/sw.js", { scope: "/", updateViaCache: "none" })
    .then((reg) => reg.pushManager?.getSubscription())
    .then((sub) =>
      set({ supported, subscribed: !!sub, permission: supported ? Notification.permission : "default", ready: true }),
    )
    .catch(() => set({ ready: true }));
}

function urlBase64ToUint8Array(base64: string) {
  const padded = (base64 + "=".repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

async function sendTest(sub: PushSubscription, store?: string) {
  const res = await fetch("/api/push/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: sub, store }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Could not send");
}

/** Push notifications for MoStore, or for one store when `store` is given. */
export function usePush(store?: string) {
  const current = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);

  useEffect(start, []);

  /** Asks permission, subscribes and sends a welcome notification. Returns a message to show. */
  async function enable() {
    if (!VAPID_PUBLIC_KEY) return "Notifications aren't set up on this server yet.";
    const permission = await Notification.requestPermission();
    set({ permission });
    if (permission !== "granted") {
      return "Notifications are blocked. You can allow them in your browser's site settings.";
    }
    const reg = await navigator.serviceWorker.ready;
    const sub =
      (await reg.pushManager.getSubscription()) ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      }));
    set({ subscribed: true });
    await sendTest(sub, store);
    return "You're in! Check for a test notification.";
  }

  async function disable() {
    const reg = await navigator.serviceWorker.ready;
    await (await reg.pushManager.getSubscription())?.unsubscribe();
    set({ subscribed: false });
  }

  async function test() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) await sendTest(sub, store);
  }

  return { ...current, enable, disable, test };
}
