"use client";

import { useState } from "react";
import { shareLink } from "@/lib/share";

export function ShareButton({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if ((await shareLink({ title, path })) === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
