import { Suspense } from "react";
import { Header } from "@/components/Header";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="px-4 pb-16 pt-2">{children}</main>
    </>
  );
}
