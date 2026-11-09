import type { ComponentType } from "react";
import type { Stats } from "@/lib/stats";
import type { TimeRange } from "@/lib/types";

/**
 * Props yang diterima setiap slide, di semua design.
 * `year` dikirim dari luar: slide tidak boleh memanggil `new Date()` sendiri,
 * karena slide juga dirender saat prerender (preview di halaman pilih design).
 */
export type SlideProps = {
  stats: Stats;
  name: string;
  range: TimeRange;
  year: number;
  /** Nomor slide ini, mulai dari 1. */
  n: number;
  total: number;
};

/** Kontrak satu design wrapped. Setiap folder di src/designs/<id>/ mengekspor satu objek ini. */
export type Design = {
  name: string;
  description: string;
  /** Class variabel next/font; dipasang di pembungkus slide, bukan di <html>. */
  fontClassName: string;
  slides: ComponentType<SlideProps>[];
};
