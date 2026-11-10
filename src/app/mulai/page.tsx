import Masthead from "@/components/Masthead";
import ModePicker from "@/components/ModePicker";

export default function MulaiPage() {
  return (
    <main className="min-h-dvh bg-pri text-sec">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:px-8">
        <Masthead />

        <section className="border-b-2 border-sec/20 py-10 md:py-14">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl sm:text-7xl uppercase tracking-tight">
              Pilih Mode Wrapped.
            </h1>
            <p className="mt-3 font-body text-xs sm:text-sm text-sec/75 leading-relaxed">
              Tentukan bagaimana data Wrapped kamu dihitung sebelum memilih format desain visual. Kamu bebas berganti mode kapan saja.
            </p>
          </div>
        </section>

        <ModePicker />

        <footer className="py-8 border-t-2 border-sec/20 text-center font-mono text-xs text-sec/60">
          WRAPPED · SINCE 2026
        </footer>
      </div>
    </main>
  );
}
