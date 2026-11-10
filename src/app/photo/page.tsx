import { Suspense } from "react";
import Link from "next/link";
import Masthead from "@/components/Masthead";
import PhotoBoothStudio from "@/components/PhotoBoothStudio";

export default function PhotoStudioPage() {
  return (
    <main className="min-h-dvh bg-pri text-sec">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
        <Masthead />

        <section className="border-b-2 border-sec/20 py-10 md:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2 inline-block border-2 border-sec bg-[#facc15] px-2.5 py-0.5 font-mono text-xs font-bold uppercase text-[#030303]">
                PILAR 01 // KILASARA SNAP STUDIO
              </div>
              <h1 className="font-display text-5xl uppercase tracking-tight sm:text-7xl">
                Online Photo Studio.
              </h1>
              <p className="mt-3 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
                Ambil foto langsung lewat kamera atau unggah dari galeri HP kamu. Bebas pilih puluhan frame photobooth, struk kasir, koran vintage, hingga sampul majalah, lalu unduh dalam resolusi tinggi siap Story.
              </p>
            </div>

            <Link
              href="/templates"
              className="nextec-hard-button self-start whitespace-nowrap bg-pri px-4 py-2.5 font-mono text-xs font-bold uppercase text-sec"
            >
              Jelajahi Katalog Template →
            </Link>
          </div>
        </section>

        <Suspense
          fallback={
            <div className="py-16 text-center font-mono text-xs uppercase tracking-widest text-sec/60">
              Memuat Kilasara Snap Studio...
            </div>
          }
        >
          <PhotoBoothStudio />
        </Suspense>

        <footer className="border-t-2 border-sec/20 py-8 text-center font-mono text-xs text-sec/60">
          KILASARA STUDIO · SNAP &amp; AKSARA LAB
        </footer>
      </div>
    </main>
  );
}
