import Link from "next/link";
import Masthead from "@/components/Masthead";
import { DESIGNS, type DesignId } from "@/designs";
import { PREVIEW_SAMPLE } from "@/designs/preview-sample";

export default function DesignPickerPage() {
  const designs = Object.entries(DESIGNS) as [DesignId, (typeof DESIGNS)[DesignId]][];
  return (
    <main className="min-h-dvh bg-newsprint text-ink">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <Masthead edition="Rubrik Tata Letak" />

        <section className="border-b border-ink py-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-press-red">Tata Letak</p>
          <h1 className="mt-3 max-w-3xl font-headline text-4xl font-black leading-[0.95] tracking-tight sm:text-6xl">
            Pilih gaya cetak rangkuman kamu.
          </h1>
          <p className="mt-4 max-w-2xl font-headline text-lg italic text-faded sm:text-xl">
            Semua gaya memakai data yang sama, dan bisa diganti kapan saja dari halaman rangkuman.
          </p>
        </section>

        <ul className="grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map(([id, design], i) => (
            <li key={id} className="border-2 border-ink p-1">
              <Link
                href={`/wrapped/${id}`}
                className="group flex h-full flex-col gap-3 border border-ink p-5 transition-colors hover:bg-ink hover:text-newsprint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                {/* Preview hidup: 3 slide pertama design ini dengan data contoh. */}
                <div aria-hidden className="pointer-events-none mb-2 grid grid-cols-3 gap-2 border border-current bg-ink/5 p-2">
                  {design.slides.slice(0, 3).map((Slide, n) => (
                    <div key={n} className={`@container aspect-[9/16] overflow-hidden ${design.fontClassName}`}>
                      <Slide {...PREVIEW_SAMPLE} n={n + 1} total={design.slides.length} />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] uppercase tracking-[0.25em] opacity-70">No. {String(i + 1).padStart(2, "0")}</span>
                <span className="font-headline text-3xl font-bold leading-tight">{design.name}</span>
                <span className="leading-relaxed">{design.description}</span>
                <span className="mt-auto pt-2 text-sm font-semibold underline underline-offset-4">Baca edisi ini →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
