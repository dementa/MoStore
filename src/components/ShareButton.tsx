"use client";

import { useEffect, useState } from "react";
import { shareLink } from "@/lib/share";
import { useShareImage } from "@/lib/useShareImage";

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
  const [label, setLabel] = useState<"Share" | "Link copied" | "Tap again to share">("Share");
  const shareImage = useShareImage(imagePath ?? "", `${path.split("/").pop() || "mostore"}.jpg`);

  // Load the picture straight away: phones only allow sharing right after a tap.
  const { prefetch } = shareImage;
  useEffect(() => {
    if (imagePath) prefetch();
  }, [imagePath, prefetch]);

  async function share() {
    const image = imagePath ? await shareImage.get() : null;
    const result = await shareLink({ title, text, path, image });
    if (result === "copied" || result === "blocked") {
      setLabel(result === "copied" ? "Link copied" : "Tap again to share");
      setTimeout(() => setLabel("Share"), 2500);
    }
  }

  return (
    <button
      onClick={share}
      className="rounded-full bg-zinc-100 px-5 py-3 text-sm font-semibold hover:bg-zinc-200"
    >
      {label}
    </button>
  );
}
