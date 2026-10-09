import Link from "next/link";
import { categories as allCategories } from "@/lib/products";

/** Underlined text tabs on phones, rounded chips on larger screens. */
export function CategoryChips({
  active,
  base = "/",
  categories = allCategories,
}: {
  active?: string;
  /** Page the tabs filter: "/" for the marketplace, "/<store>" inside a store. */
  base?: string;
  categories?: readonly string[];
}) {
  const tab = (href: string, label: string, on: boolean) => (
    <Link
      key={label}
      href={href}
      aria-current={on ? "page" : undefined}
      className={`shrink-0 border-b-[3px] pb-1.5 text-base font-semibold sm:rounded-full sm:border-0 sm:px-4 sm:py-2 sm:text-sm ${
        on
          ? "border-black sm:bg-black sm:text-white"
          : "border-transparent text-zinc-700 sm:bg-zinc-100 sm:text-black sm:hover:bg-zinc-200"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="no-scrollbar mb-4 flex gap-6 overflow-x-auto sm:mb-6 sm:gap-2">
      {tab(base, "All", !active)}
      {categories.map((c) =>
        tab(`${base}?category=${c.toLowerCase()}`, c, active?.toLowerCase() === c.toLowerCase()),
      )}
    </nav>
  );
}
