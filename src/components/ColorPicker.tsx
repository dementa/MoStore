"use client";

import type { ProductColor } from "@/lib/products";

/** Colour choice for a product: small dots on cards, named buttons on the product page. */
export function ColorPicker({
  colors,
  value,
  onChange,
  size = "sm",
}: {
  colors: ProductColor[];
  value: string;
  onChange: (name: string) => void;
  size?: "sm" | "lg";
}) {
  if (size === "sm") {
    return (
      <div role="radiogroup" aria-label="Colour" className="mt-2 flex items-center gap-1.5">
        {colors.map((c) => (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={value === c.name}
            aria-label={c.name}
            title={c.name}
            onClick={() => onChange(c.name)}
            className={`h-6 w-6 rounded-full p-0.5 ring-offset-1 ${
              value === c.name ? "ring-2 ring-black" : "ring-1 ring-black/10"
            }`}
          >
            <span className="block h-full w-full rounded-full" style={{ background: c.hex }} />
          </button>
        ))}
        <span className="ml-1 text-xs text-zinc-600">{value}</span>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm text-zinc-600">
        Colour: <span className="font-semibold text-black">{value}</span>
      </p>
      <div role="radiogroup" aria-label="Colour" className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c.name}
            type="button"
            role="radio"
            aria-checked={value === c.name}
            onClick={() => onChange(c.name)}
            className={`flex items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-4 text-sm font-semibold ${
              value === c.name ? "border-black" : "border-zinc-200 hover:border-zinc-400"
            }`}
          >
            <span className="h-6 w-6 rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
