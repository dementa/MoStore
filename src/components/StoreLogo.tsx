import Image from "next/image";
import type { Store } from "@/lib/stores";

export function StoreLogo({ store, size }: { store: Store; size: number }) {
  return (
    <Image
      src={`/${store.slug}/app-icon/192`}
      alt=""
      width={size}
      height={size}
      unoptimized
      className="shrink-0 rounded-full"
    />
  );
}
