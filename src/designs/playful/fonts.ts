import { Outfit } from "next/font/google";

const display = Outfit({ variable: "--font-playful-display-face", subsets: ["latin"] });

export const fontClassName = display.variable;
