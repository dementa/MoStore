/**
 * Opens the phone's share sheet for a MoStore link, or copies the link where
 * there's no share sheet (most computers). Resolves to what happened.
 */
export async function shareLink({
  title,
  text,
  path,
}: {
  title: string;
  text?: string;
  path: string;
}): Promise<"shared" | "copied" | "failed"> {
  const url = new URL(path, window.location.origin).href;
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
