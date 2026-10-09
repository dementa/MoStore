import { ImageResponse } from "next/og";
import { getStore, storeInitials, stores } from "@/lib/stores";

// "192", "512": round icons. "maskable-512": full-bleed for Android's shaped
// icons. "180": full-bleed for iPhone, which rounds the corners itself.
const VARIANTS = {
  "192": { size: 192, fullBleed: false },
  "512": { size: 512, fullBleed: false },
  "maskable-512": { size: 512, fullBleed: true },
  "180": { size: 180, fullBleed: true },
} as const;

type Variant = keyof typeof VARIANTS;

export function generateStaticParams() {
  return stores.flatMap((s) => Object.keys(VARIANTS).map((variant) => ({ store: s.slug, variant })));
}

export async function GET(_req: Request, { params }: { params: Promise<{ store: string; variant: string }> }) {
  const { store: slug, variant } = await params;
  const store = getStore(slug);
  if (!store || !(variant in VARIANTS)) return new Response("Not found", { status: 404 });

  const { size, fullBleed } = VARIANTS[variant as Variant];
  // Full-bleed icons get cropped, so keep the content in the middle 80%.
  const content = fullBleed ? size * 0.8 : size;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: store.color,
          borderRadius: fullBleed ? 0 : "50%",
          overflow: "hidden",
        }}
      >
        {store.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={store.logo}
            alt=""
            width={content}
            height={content}
            style={{ objectFit: "cover", borderRadius: fullBleed ? 0 : "50%" }}
          />
        ) : (
          <span style={{ color: "#fff", fontSize: content * 0.4, fontWeight: 700, letterSpacing: -size * 0.01 }}>
            {storeInitials(store.name)}
          </span>
        )}
      </div>
    ),
    { width: size, height: size },
  );
}
