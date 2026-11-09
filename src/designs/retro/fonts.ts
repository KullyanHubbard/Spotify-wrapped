import { Archivo_Black, Arimo, Courier_Prime, VT323 } from "next/font/google";

const display = Archivo_Black({ variable: "--font-retro-display-face", subsets: ["latin"], weight: "400" });
const body = Arimo({ variable: "--font-retro-body-face", subsets: ["latin"] });
const mono = Courier_Prime({ variable: "--font-retro-mono-face", subsets: ["latin"], weight: ["400", "700"] });
const lcd = VT323({ variable: "--font-retro-lcd-face", subsets: ["latin"], weight: "400" });

export const fontClassName = `${display.variable} ${body.variable} ${mono.variable} ${lcd.variable}`;
