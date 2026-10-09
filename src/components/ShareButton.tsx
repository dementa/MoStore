"use client";

import { useState } from "react";

export function ShareButton({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = new URL(path, window.location.origin).href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <button
      onClick={share}
      className="rounded-full bg-zinc-100 px-5 py-3 text-sm font-semibold hover:bg-zinc-200"
    >
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
