import Link from "next/link";

/** Kepala koran: dipakai halaman depan dan halaman pilih design. */
export default function Masthead({ edition }: { edition: string }) {
  return (
    <header>
      <div className="flex items-center justify-between border-b border-ink pb-2 text-[11px] uppercase tracking-[0.2em] text-faded">
        <span>Vol. I · No. 1</span>
        <span className="hidden sm:inline">{edition}</span>
        <span>Gratis</span>
      </div>
      <Link href="/" className="block py-4 text-center font-masthead text-5xl leading-none sm:py-5 sm:text-7xl lg:text-8xl">
        Harian Wraped
      </Link>
      <div className="flex justify-between border-y-4 border-double border-ink py-1.5 text-[11px] uppercase tracking-[0.2em] sm:text-xs">
        <span>Harian musik kamu</span>
        <span className="hidden sm:inline">Edisi Spotify</span>
        <span>Read-only</span>
      </div>
    </header>
  );
}
