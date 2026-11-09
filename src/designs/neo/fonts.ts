import { Inter_Tight, Space_Mono } from "next/font/google";

const display = Inter_Tight({ variable: "--font-neo-display-face", subsets: ["latin"] });
const mono = Space_Mono({ variable: "--font-neo-mono-face", subsets: ["latin"], weight: ["400", "700"] });

export const fontClassName = `${display.variable} ${mono.variable}`;
