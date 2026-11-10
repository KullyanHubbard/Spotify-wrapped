import Link from "next/link";
import Masthead from "@/components/Masthead";
import HistoryUpload from "@/components/HistoryUpload";
import { DESIGNS, type DesignId } from "@/designs";
import { PREVIEW_SAMPLE } from "@/designs/preview-sample";

export default function DesignPickerPage() {
  const designs = Object.entries(DESIGNS) as [DesignId, (typeof DESIGNS)[DesignId]][];

  return (
    <main className="min-h-dvh bg-pri text-sec">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
        <Masthead />

        <section className="border-b-2 border-sec/20 py-10 md:py-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-5xl sm:text-7xl uppercase tracking-tight">
                Pilih Format Desain.
              </h1>
              <p className="font-body text-xs sm:text-sm text-sec/75 mt-3 leading-relaxed">
                Penasaran bagaimana kebiasaan musikmu terlihat dalam bentuk struk belanja unik, poster cyberpunk, atau majalah retro? Pilih salah satu tema di bawah untuk melihat kepribadian musikmu, dan kamu bebas berganti gaya kapan saja.
              </p>
            </div>
            <Link
              href="/mulai"
              className="nextec-hard-button self-start whitespace-nowrap bg-pri px-3.5 py-2 font-mono text-xs uppercase font-bold text-sec transition-colors hover:bg-sec hover:text-pri focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            >
              ← Ganti mode
            </Link>
          </div>
        </section>

        <HistoryUpload />

        <ul className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map(([id, design], i) => (
            <li key={id}>
              <Link
                href={`/wrapped/${id}`}
                className="nextec-hard-card group flex h-full flex-col justify-between border-2 border-sec bg-pri p-5 sm:p-6 transition-colors hover:border-red"
              >
                <div>
                  <div
                    aria-hidden
                    className="pointer-events-none mb-5 grid grid-cols-3 gap-2 border-2 border-sec/30 bg-sec/[0.03] p-2.5 transition-colors group-hover:border-red/50"
                  >
                    {design.slides.slice(0, 3).map((Slide, n) => (
                      <div key={n} className={`@container aspect-[9/16] overflow-hidden border border-sec/20 ${design.fontClassName}`}>
                        <Slide {...PREVIEW_SAMPLE} n={n + 1} total={design.slides.length} />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between font-mono text-xs text-sec/60 mb-2">
                    <span className="font-bold text-red">[0{i + 1}]</span>
                    <span className="uppercase tracking-widest text-[10px]">ID: {id}</span>
                  </div>

                  <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide group-hover:text-red transition-colors">
                    {design.name}
                  </h2>

                  <p className="font-body text-xs sm:text-sm text-sec/70 mt-2 leading-relaxed">
                    {design.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-sec/20 flex items-center justify-between font-mono text-xs uppercase font-bold tracking-wider">
                  <span className="text-sec group-hover:text-red transition-colors">Pilih Gaya Ini</span>
                  <span className="text-red transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <footer className="py-8 border-t-2 border-sec/20 text-center font-mono text-xs text-sec/60">
          KILASARA STUDIO · SINCE 2026
        </footer>
      </div>
    </main>
  );
}
