import type { Design } from "@/designs/types";
import { fontClassName } from "./fonts";
import { SLIDES, TotalMinutesSlide } from "./Slides";

export const sketchDesign: Design = {
  name: "Sketch",
  description: "Coretan tangan, kertas bertitik, aksen merah.",
  fontClassName,
  slides: SLIDES,
  totalMinutesSlide: TotalMinutesSlide,
};
