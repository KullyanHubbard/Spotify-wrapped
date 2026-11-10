import type { Metadata } from "next";
import { Jersey_20, Poppins, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Jersey_20({ variable: "--font-display-face", subsets: ["latin"], weight: "400" });
const body = Poppins({ variable: "--font-body-face", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = Space_Mono({ variable: "--font-mono-face", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Kilasara Studio | Online Photo Studio & Music Wrapped",
  description:
    "Platform kreatif digital untuk mengabadikan Kilas Foto (Online Photobooth & Frame) dan Aksara Cerita (Spotify Wrapped & Data Storytelling) siap unggah ke Story.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fff5ef] text-[#030303]">{children}</body>
    </html>
  );
}
