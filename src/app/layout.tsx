import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoStore",
  description: "E-commerce for every one. Discover, save and shop.",
  applicationName: "MoStore",
  appleWebApp: { capable: true, title: "MoStore", statusBarStyle: "default" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <StoreProvider>
          <Suspense>
            <Header />
          </Suspense>
          <main className="px-4 pb-16 pt-2">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
