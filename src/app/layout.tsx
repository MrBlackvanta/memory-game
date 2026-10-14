import { Signature } from "@/components/layout";
import { SITE_NAME, SITE_URL } from "@/data";
import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: "--font-atkinson-hyperlegible",
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

const title = `${SITE_NAME} | Find every pair, solo or with friends`;
const description =
  "Flip tiles to find every matching pair. Race the clock solo or take turns with up to four players, on a 4x4 or 6x6 grid of numbers or icons.";

const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "memory: a 4x4 board of icon tiles mid-game, above four players' scores.",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${atkinsonHyperlegible.variable} antialiased`}>
      <body className="bg-paper setup:bg-ink relative min-h-dvh">
        {children}
        <Signature />
      </body>
    </html>
  );
}
