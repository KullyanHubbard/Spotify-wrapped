import { Kalam, Patrick_Hand } from "next/font/google";

const display = Kalam({ variable: "--font-sketch-display-face", subsets: ["latin"], weight: ["400", "700"] });
const hand = Patrick_Hand({ variable: "--font-sketch-hand-face", subsets: ["latin"], weight: "400" });

export const fontClassName = `${display.variable} ${hand.variable}`;
