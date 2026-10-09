/**
 * Opens the phone's share sheet for a MoStore link, or copies the link where
 * there's no share sheet (most computers). With an image, phones that can
 * share files get the picture plus the link, ready for WhatsApp Status.
 * Resolves to what happened.
 */
export async function shareLink({
  title,
  text,
  path,
  image,
}: {
  title: string;
  text?: string;
  path: string;
  image?: File | null;
}): Promise<"shared" | "copied" | "failed"> {
  const url = new URL(path, window.location.origin).href;
  if (image && navigator.canShare?.({ files: [image] })) {
    try {
      // Many apps drop the separate url field when a file is attached, so the link goes in the text.
      await navigator.share({ files: [image], title, text: [text, url].filter(Boolean).join("\n") });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "failed";
      // Otherwise fall through and share the plain link.
    }
  }
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch {
      return "failed";
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}
