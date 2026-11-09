import { Bodoni_Moda, Inter } from "next/font/google";

const display = Bodoni_Moda({ variable: "--font-luxury-display-face", subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"] });
const body = Inter({ variable: "--font-luxury-body-face", subsets: ["latin"], weight: ["300", "400", "500"] });

export const fontClassName = `${display.variable} ${body.variable}`;
