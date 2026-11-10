import Link from "next/link";
import Masthead from "@/components/Masthead";
import TemplateCatalog from "@/components/TemplateCatalog";

export default function TemplatesPage() {
  return (
    <main className="min-h-dvh bg-pri text-sec">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
        <Masthead />

        <section className="border-b-2 border-sec/20 py-10 md:py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2 inline-block border-2 border-sec bg-red px-2.5 py-0.5 font-mono text-xs font-bold uppercase text-[#fff5ef]">
                PILAR 03 // KILASARA GALERI
              </div>
              <h1 className="font-display text-5xl uppercase tracking-tight sm:text-7xl">
                Katalog Template.
              </h1>
              <p className="mt-3 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
                Jelajahi seluruh koleksi desain visual Kilasara Studio. Mulai dari frame photobooth 4-cuts, struk kasir, kliping surat kabar, hingga tema slide musik Spotify Wrapped.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/photo"
                className="nextec-hard-button bg-red px-4 py-2.5 font-mono text-xs font-bold uppercase text-[#fff5ef]"
              >
                Buka Snap Studio →
              </Link>
              <Link
                href="/mulai"
                className="nextec-hard-button bg-pri px-4 py-2.5 font-mono text-xs font-bold uppercase text-sec"
              >
                Buka Wrapped Studio →
              </Link>
            </div>
          </div>
        </section>

        <TemplateCatalog />

        <footer className="border-t-2 border-sec/20 py-8 text-center font-mono text-xs text-sec/60">
          KILASARA STUDIO · KATALOG DESAIN DIGITAL
        </footer>
      </div>
    </main>
  );
}
