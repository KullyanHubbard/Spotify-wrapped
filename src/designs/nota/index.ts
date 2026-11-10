import type { Design } from "@/designs/types";
import { fontClassName } from "./fonts";
import { SLIDES, TotalMinutesSlide } from "./Slides";

export const notaDesign: Design = {
  name: "Nota",
  description: "Struk kasir: kertas thermal, huruf mono, barcode.",
  fontClassName,
  slides: SLIDES,
  totalMinutesSlide: TotalMinutesSlide,
};
