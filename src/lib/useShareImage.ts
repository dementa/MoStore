"use client";

import { useCallback, useState } from "react";

// One download per picture, shared by every card and button that offers it.
const loads = new Map<string, Promise<File | null>>();

function load(path: string, name: string) {
  let pending = loads.get(path);
  if (!pending) {
    pending = fetch(path)
      .then((res) => (res.ok ? res.blob() : null))
      .then((blob) => (blob ? new File([blob], name, { type: blob.type || "image/jpeg" }) : null))
      .catch(() => {
        loads.delete(path);
        return null;
      });
    loads.set(path, pending);
  }
  return pending;
}

/**
 * A picture to share alongside a link (e.g. the product card for WhatsApp
 * Status). Phones only allow sharing right after a tap, so call `prefetch`
 * early; `get` waits briefly for a download that's still running.
 */
export function useShareImage(path: string, name: string) {
  const [file, setFile] = useState<File | null>(null);

  const prefetch = useCallback(() => {
    load(path, name).then((f) => f && setFile(f));
  }, [path, name]);

  const get = useCallback(
    async (timeoutMs = 2500) =>
      file ??
      Promise.race([load(path, name), new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs))]),
    [file, path, name],
  );

  return { file, prefetch, get };
}
