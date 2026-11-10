import type { Design } from "@/designs/types";
import { fontClassName } from "./fonts";
import { SLIDES, TotalMinutesSlide } from "./Slides";

export const retroDesign: Design = {
  name: "Retro",
  description: "Web 90-an: abu-abu timbul, judul kuning, counter LCD.",
  fontClassName,
  slides: SLIDES,
  totalMinutesSlide: TotalMinutesSlide,
};
