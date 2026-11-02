import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat, Mr_Dafoe } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const dafoe = Mr_Dafoe({
  variable: "--font-dafoe",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Lappidoth & Co. — Fragrance to Fire",
    template: "%s · Lappidoth & Co.",
  },
  description:
    "Hand-poured natural soy candles, crafted with intention to shape atmosphere. Discover The Presence Collection.",
  openGraph: {
    siteName: "Lappidoth & Co.",
    images: ["/images/hero-presence-collection.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#e6e0d5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable} ${dafoe.variable}`}>
      <body>{children}</body>
    </html>
  );
}
