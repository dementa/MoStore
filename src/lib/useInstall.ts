"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

// The browser fires beforeinstallprompt once per page load, so it's captured at
// module level and shared by every component that offers an install button.
let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    installed = true;
    emit();
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useInstall() {
  const event = useSyncExternalStore(subscribe, () => deferred, () => null);
  const justInstalled = useSyncExternalStore(subscribe, () => installed, () => false);
  const [standalone, setStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setStandalone(window.matchMedia("(display-mode: standalone)").matches);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  async function install() {
    if (!deferred) return false;
    const e = deferred;
    deferred = null;
    emit();
    await e.prompt();
    return (await e.userChoice).outcome === "accepted";
  }

  return {
    /** Running as an installed app (or just installed). */
    installed: standalone || justInstalled,
    /** The browser offers a one-tap install (Chrome, Edge, Android). */
    canInstall: !!event,
    isIOS,
    install,
  };
}
