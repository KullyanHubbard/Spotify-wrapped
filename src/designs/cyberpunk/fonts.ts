import { Chakra_Petch, JetBrains_Mono } from "next/font/google";

const display = Chakra_Petch({ variable: "--font-cyberpunk-display-face", subsets: ["latin"], weight: ["500", "700"] });
const mono = JetBrains_Mono({ variable: "--font-cyberpunk-mono-face", subsets: ["latin"] });

export const fontClassName = `${display.variable} ${mono.variable}`;
