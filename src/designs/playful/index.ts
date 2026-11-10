import type { Design } from "@/designs/types";
import { fontClassName } from "./fonts";
import { SLIDES, TotalMinutesSlide } from "./Slides";

export const playfulDesign: Design = {
  name: "Playful Geometric",
  description: "Bentuk geometri cerah, warna pastel, ritme ceria.",
  fontClassName,
  slides: SLIDES,
  totalMinutesSlide: TotalMinutesSlide,
};
