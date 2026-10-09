"use client";

import { useRouter } from "next/navigation";

/**
 * Goes back a page. Installed apps on iPhone have no browser back button, so
 * every page past home needs one. Opened straight from a shared link there's
 * nothing to go back to, so it goes to `fallback` instead.
 */
export function BackButton({ fallback }: { fallback: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => (window.history.length > 1 ? router.back() : router.push(fallback))}
      aria-label="Back"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-white active:bg-white"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-zinc-800" aria-hidden>
        <path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2Z" />
      </svg>
    </button>
  );
}
