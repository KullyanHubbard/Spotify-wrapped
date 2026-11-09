import { cyberpunkDesign } from "./cyberpunk";
import { luxuryDesign } from "./luxury";
import { neoDesign } from "./neo";
import { notaDesign } from "./nota";
import { playfulDesign } from "./playful";
import { retroDesign } from "./retro";
import { sketchDesign } from "./sketch";
import type { Design } from "./types";

/**
 * Daftar design wrapped. Urutan di sini = urutan di halaman pilih design (No. 01, 02, ...).
 * Key = id di URL: /wrapped/<id>.
 */
export const DESIGNS = {
  neo: neoDesign,
  sketch: sketchDesign,
  retro: retroDesign,
  playful: playfulDesign,
  cyberpunk: cyberpunkDesign,
  luxury: luxuryDesign,
  nota: notaDesign,
} satisfies Record<string, Design>;

export type DesignId = keyof typeof DESIGNS;

export const isDesignId = (id: string): id is DesignId => id in DESIGNS;
