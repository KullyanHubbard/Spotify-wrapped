import { IBM_Plex_Mono } from "next/font/google";

const mono = IBM_Plex_Mono({ variable: "--font-nota-mono-face", subsets: ["latin"], weight: ["400", "500", "700"] });

export const fontClassName = mono.variable;
