import type { Metadata, Viewport } from "next";
import { Herr_Von_Muellerhoff, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const script = Herr_Von_Muellerhoff({
  variable: "--font-script-face",
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
    "Hand-poured 100% natural soy wax candles, mindfully crafted in small batches in the UK. Discover The Presence Collection.",
  openGraph: {
    siteName: "Lappidoth & Co.",
    locale: "en_GB",
    images: ["/images/hero-presence-collection.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${playfair.variable} ${montserrat.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
