import webpush, { type PushSubscription } from "web-push";

// Only send to real browser push services, so this endpoint can't be used to
// make the server POST to arbitrary URLs.
const PUSH_HOSTS = [
  /^fcm\.googleapis\.com$/,
  /\.push\.services\.mozilla\.com$/,
  /\.notify\.windows\.com$/,
  /^web\.push\.apple\.com$/,
  /\.push\.apple\.com$/,
];

function isValidSubscription(sub: unknown): sub is PushSubscription {
  if (!sub || typeof sub !== "object") return false;
  const { endpoint, keys } = sub as Partial<PushSubscription>;
  if (typeof endpoint !== "string" || typeof keys?.p256dh !== "string" || typeof keys?.auth !== "string") {
    return false;
  }
  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" && PUSH_HOSTS.some((re) => re.test(url.hostname));
  } catch {
    return false;
  }
}

// Sends a test notification to the subscription in the request body. Sending to
// all subscribers (price drops, order updates) needs subscriptions stored in a
// database first.
export async function POST(req: Request) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    return Response.json({ error: "Push notifications are not configured" }, { status: 503 });
  }

  const sub = await req.json().catch(() => null);
  if (!isValidSubscription(sub)) {
    return Response.json({ error: "Invalid push subscription" }, { status: 400 });
  }

  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@example.com", publicKey, privateKey);

  try {
    await webpush.sendNotification(
      sub,
      JSON.stringify({
        title: "Notifications are on",
        body: "We'll let you know about deals on things you save.",
        url: "/saved",
        tag: "mostore-test",
      }),
    );
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    return Response.json({ error: "Push service rejected the message", status }, { status: 502 });
  }

  return Response.json({ ok: true });
}
