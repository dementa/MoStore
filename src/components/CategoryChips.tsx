import Link from "next/link";
import { categories } from "@/lib/products";

export function CategoryChips({ active }: { active?: string }) {
  const chip = (href: string, label: string, on: boolean) => (
    <Link
      key={label}
      href={href}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
        on ? "bg-black text-white" : "bg-zinc-100 hover:bg-zinc-200"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
      {chip("/", "All", !active)}
      {categories.map((c) =>
        chip(`/?category=${c.toLowerCase()}`, c, active?.toLowerCase() === c.toLowerCase()),
      )}
    </nav>
  );
}
