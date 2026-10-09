import { Suspense } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="px-4 pb-28 pt-2 sm:pb-16">{children}</main>
      <BottomNav />
    </>
  );
}
