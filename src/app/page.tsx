import { Suspense } from "react";
import LoginError from "@/components/LoginError";
import Masthead from "@/components/Masthead";

const STORIES = [
  {
    kicker: "Tangga Lagu",
    title: "Siapa yang paling sering kamu putar?",
    body: "Lima artis dan lima lagu teratas kamu, diurutkan langsung dari data Spotify.",
  },
  {
    kicker: "Rilisan",
    title: "Album yang paling lama nempel",
    body: "Dihitung dari album yang paling sering muncul di deretan lagu teratas kamu.",
  },
  {
    kicker: "Jadwal",
    title: "Kapan kamu paling banyak mendengar?",
    body: "Jam puncak dari 50 lagu terakhir, lengkap dengan julukan pendengar yang cocok.",
  },
  {
    kicker: "Cetak",
    title: "Siap terbit di Story",
    body: "Setiap halaman bisa diekspor jadi gambar 9:16 dan langsung dibagikan.",
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh bg-newsprint text-ink">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <Masthead edition="Edisi Utama" />

        <section className="grid gap-8 border-b border-ink py-8 sm:py-10 lg:grid-cols-[1.9fr_1fr] lg:gap-0">
          <div className="lg:border-r lg:border-ink lg:pr-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-press-red">Berita Utama</p>
            <h1 className="mt-3 font-headline text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]">
              Musik Kamu Jadi <em className="font-bold">Berita Utama</em>.
            </h1>
            <p className="mt-6 max-w-2xl font-headline text-xl italic leading-snug text-faded sm:text-2xl">
              Rangkuman artis, lagu, album, dan jam dengar kamu, dicetak dalam format 9:16 dan siap terbit di Story.
            </p>
          </div>

          <aside className="flex flex-col gap-5 lg:pl-10">
            <div>
              <h2 className="border-b border-ink pb-2 font-headline text-2xl font-bold">Edisi Pribadi</h2>
              <p className="mt-3 leading-relaxed">
                Login sekali, pilih tata letak, lalu baca rangkuman musik kamu halaman demi halaman.
              </p>
            </div>
            <Suspense>
              <LoginError />
            </Suspense>
            <a
              href="/api/auth/login"
              className="group flex items-center justify-between bg-ink px-5 py-4 font-headline text-xl font-bold text-newsprint transition-colors hover:bg-press-red focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Login dengan Spotify
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <p className="text-xs leading-relaxed text-faded">
              Izin yang diminta: top items + riwayat putar terakhir. Read-only, tidak ada yang diubah di akun kamu.
            </p>
          </aside>
        </section>

        <section className="grid gap-px border-b-4 border-double border-ink bg-ink bg-clip-padding sm:grid-cols-2 lg:grid-cols-4">
          {STORIES.map((s, i) => (
            <article key={s.title} className="bg-newsprint py-6 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-press-red">{s.kicker}</p>
              <h3 className="mt-2 font-headline text-2xl font-bold leading-tight">{s.title}</h3>
              <p
                className={`mt-3 text-[15px] leading-relaxed ${
                  i === 0
                    ? "first-letter:float-left first-letter:mr-2 first-letter:font-headline first-letter:text-5xl first-letter:font-black first-letter:leading-[0.85]"
                    : ""
                }`}
              >
                {s.body}
              </p>
            </article>
          ))}
        </section>

        <footer className="flex flex-col gap-1 py-4 text-xs text-faded sm:flex-row sm:justify-between">
          <span>Dicetak di browser kamu. Data dibaca langsung dari Spotify dan tidak disimpan di server.</span>
          <span className="italic">Bukan produk resmi Spotify.</span>
        </footer>
      </div>
    </main>
  );
}
