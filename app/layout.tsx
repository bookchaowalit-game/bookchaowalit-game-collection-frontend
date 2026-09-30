import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Used sparingly — wordmark, eyebrows, and the primary CTA only.
// Never for paragraph text; an 8-bit face is illegible at body size.
const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Book Arcade — games, built in public",
  description:
    "A small arcade of games by bookchaowalit, built in public. See what's shipped, what's next, and follow the build.",
  keywords: ["Book Arcade", "bookchaowalit", "indie games", "game dev", "build in public"],
  authors: [{ name: "bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "bookchaowalit",
  publisher: "bookchaowalit",
  metadataBase: new URL(SITE_URL),
  // Pages override this with their own path; see lib/games.ts.
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bookchaowalit.com",
    title: "Book Arcade — games, built in public",
    description: "A small arcade of games by bookchaowalit, built in public.",
    siteName: "Book Arcade",
    // Image comes from app/opengraph-image.tsx (generated at build time).
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Arcade — games, built in public",
    description: "A small arcade of games by bookchaowalit, built in public.",
    creator: "@bookchaowalit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
