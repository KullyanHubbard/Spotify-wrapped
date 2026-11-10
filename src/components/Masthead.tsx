import Link from "next/link";

export default function Masthead() {
  return (
    <header className="w-full border-b-2 border-sec/30 py-5 sm:py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/" className="group inline-flex items-baseline gap-2.5">
            <span className="font-display text-5xl tracking-wider text-sec transition-colors group-hover:text-red sm:text-7xl md:text-8xl">
              KILASARA<span className="text-red">.</span>
            </span>
            <span className="border-2 border-sec bg-red px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#fff5ef] sm:text-xs">
              STUDIO
            </span>
          </Link>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-sec/65">
            KILAS FOTO · AKSARA CERITA · TEMPLATE STUDIO
          </p>
        </div>

        <nav aria-label="Navigasi Utama" className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="nextec-hard-button bg-pri px-3.5 py-2 font-mono text-xs font-bold uppercase text-sec hover:bg-sec hover:text-pri"
          >
            Beranda
          </Link>
          <Link
            href="/photo"
            className="nextec-hard-button bg-red px-3.5 py-2 font-mono text-xs font-bold uppercase text-[#fff5ef]"
          >
            Snap Studio
          </Link>
          <Link
            href="/mulai"
            className="nextec-hard-button bg-pri px-3.5 py-2 font-mono text-xs font-bold uppercase text-sec hover:bg-sec hover:text-pri"
          >
            Wrapped Studio
          </Link>
          <Link
            href="/templates"
            className="nextec-hard-button bg-pri px-3.5 py-2 font-mono text-xs font-bold uppercase text-sec hover:bg-sec hover:text-pri"
          >
            Katalog Template
          </Link>
        </nav>
      </div>
    </header>
  );
}
