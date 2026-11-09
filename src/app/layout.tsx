import type { Metadata } from "next";
import { Playfair_Display, Source_Serif_4, UnifrakturMaguntia } from "next/font/google";
import "./globals.css";

// Newsprint: design utama app. Font design wrapped di-load di folder design masing-masing.
const masthead = UnifrakturMaguntia({ variable: "--font-masthead-face", subsets: ["latin"], weight: "400" });
const headline = Playfair_Display({ variable: "--font-headline-face", subsets: ["latin"], style: ["normal", "italic"] });
const body = Source_Serif_4({ variable: "--font-body-face", subsets: ["latin"], style: ["normal", "italic"] });

export const metadata: Metadata = {
  title: "Wraped",
  description: "Rangkuman musik Spotify kamu, siap di-share ke Instagram Story.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${masthead.variable} ${headline.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
