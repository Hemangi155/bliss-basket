import type { Metadata } from "next";
import "./globals.css";
import { CartWishlistProvider } from "@/context/CartWishlistContext";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "BLISS BASKET — Gifts That Feel Like Happiness.",
  description:
    "Thoughtfully curated luxury gift hampers celebrating Indian warmth, artisanal craft, and thoughtful moments — delivered across 19,000+ PIN codes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        {/* Preconnect to Google Fonts for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-light-surface text-light-on-surface font-body antialiased min-h-full flex flex-col">
        <CartWishlistProvider>
          {children}
          <CartDrawer />
        </CartWishlistProvider>
      </body>
    </html>
  );
}
