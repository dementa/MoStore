"use client";

import { useEffect, useState } from "react";
import { shareLink } from "@/lib/share";

export function ShareButton({
  title,
  path,
  text,
  imagePath,
}: {
  title: string;
  path: string;
  text?: string;
  /** Picture to share along with the link, e.g. the product card for WhatsApp Status. */
  imagePath?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  // Load the picture ahead of time: phones only allow sharing right after a tap,
  // so there's no time to download it then.
  useEffect(() => {
    if (!imagePath) return;
    let cancelled = false;
    fetch(imagePath)
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => {
        if (blob && !cancelled) setImage(new File([blob], `${path.split("/").pop() || "mostore"}.jpg`, { type: blob.type }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [imagePath, path]);

  async function share() {
    if ((await shareLink({ title, text, path, image })) === "copied") {
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
