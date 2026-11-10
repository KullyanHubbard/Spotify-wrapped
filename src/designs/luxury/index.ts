import type { Design } from "@/designs/types";
import { fontClassName } from "./fonts";
import { SLIDES, TotalMinutesSlide } from "./Slides";

export const luxuryDesign: Design = {
  name: "Luxury",
  description: "Serif elegan, ruang lega, foto hitam-putih.",
  fontClassName,
  slides: SLIDES,
  totalMinutesSlide: TotalMinutesSlide,
};
