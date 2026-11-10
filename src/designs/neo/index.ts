import type { Design } from "@/designs/types";
import { fontClassName } from "./fonts";
import { SLIDES, TotalMinutesSlide } from "./Slides";

export const neoDesign: Design = {
  name: "Neo-Brutalist",
  description: "Swiss grid, warna keras, shadow tebal.",
  fontClassName,
  slides: SLIDES,
  totalMinutesSlide: TotalMinutesSlide,
};
