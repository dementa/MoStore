import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { formatAmount, getProduct, products } from "@/lib/products";
import { getStoreByName, storeInitials } from "@/lib/stores";

// The picture WhatsApp (and other apps) show when a product link is shared,
// and the image the Share button sends to WhatsApp Status. Built at deploy
// time for every product and served as a small JPEG, since WhatsApp skips
// large preview images.

const WIDTH = 1200;
const HEIGHT = 630;
const PHOTO = { width: 520, height: 566 };
const FONT_DIR = path.join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");

export const dynamic = "force-static";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

async function photoDataUri(src: string) {
  const original = src.startsWith("/")
    ? await readFile(path.join(process.cwd(), "public", src))
    : Buffer.from(await (await fetch(src)).arrayBuffer());
  const resized = await sharp(original).resize(PHOTO.width, PHOTO.height, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
  return `data:image/jpeg;base64,${resized.toString("base64")}`;
}

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const product = getProduct((await params).id);
  if (!product) return new Response("Not found", { status: 404 });
  const store = getStoreByName(product.seller);
  const brand = store?.color ?? "#e60023";

  const [photo, regular, semibold, bold] = await Promise.all([
    photoDataUri(product.image).catch(() => null),
    readFile(path.join(FONT_DIR, "Geist-Regular.ttf")),
    readFile(path.join(FONT_DIR, "Geist-SemiBold.ttf")),
    readFile(path.join(FONT_DIR, "Geist-Bold.ttf")),
  ]);

  const png = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", padding: 32, background: "#f4f5f7", fontFamily: "Geist" }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 40,
            padding: 0,
            background: "#ffffff",
            borderRadius: 40,
            overflow: "hidden",
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" width={PHOTO.width} height={PHOTO.height} style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ width: PHOTO.width, height: PHOTO.height, background: brand }} />
          )}

          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px 44px 40px 0" }}>
            {store && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    background: store.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {storeInitials(store.name)}
                </div>
                <div style={{ fontSize: 26, fontWeight: 600, color: "#52525b" }}>{store.name}</div>
              </div>
            )}

            <div style={{ marginTop: 28, fontSize: 52, fontWeight: 700, lineHeight: 1.08, color: "#111111" }}>
              {clip(product.title, 48)}
            </div>
            <div style={{ marginTop: 16, fontSize: 25, lineHeight: 1.35, color: "#52525b" }}>
              {clip(product.description, 105)}
            </div>
            {product.colors && (
              <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 10 }}>
                {product.colors.map((c) => (
                  <div
                    key={c.name}
                    style={{ width: 28, height: 28, borderRadius: 14, background: c.hex, border: "2px solid #e4e4e7" }}
                  />
                ))}
                <div style={{ marginLeft: 6, fontSize: 22, color: "#71717a" }}>
                  {`${product.colors.length} colours`}
                </div>
              </div>
            )}

            <div style={{ marginTop: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", color: brand }}>
                <div style={{ fontSize: 22, fontWeight: 600 }}>UGX</div>
                <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1 }}>{formatAmount(product.price)}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 26px",
                  borderRadius: 999,
                  background: brand,
                  color: "#fff",
                  fontSize: 24,
                  fontWeight: 600,
                }}
              >
                Shop now
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Geist", data: regular, weight: 400 },
        { name: "Geist", data: semibold, weight: 600 },
        { name: "Geist", data: bold, weight: 700 },
      ],
    },
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=86400, s-maxage=604800" },
  });
}
