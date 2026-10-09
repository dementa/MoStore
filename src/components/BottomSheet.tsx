"use client";

import { useEffect } from "react";

/** A panel that slides up from the bottom over a dimmed page. Tap outside or press Escape to close. */
export function BottomSheet({
  onClose,
  labelledBy,
  children,
}: {
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md animate-[slide-up_0.3s_ease-out] rounded-t-3xl bg-white px-6 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-2xl sm:mb-6 sm:rounded-3xl"
      >
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-zinc-200" />
        {children}
      </div>
    </div>
  );
}
