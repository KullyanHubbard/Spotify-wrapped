import { Suspense } from "react";
import LoginError from "@/components/LoginError";
import Masthead from "@/components/Masthead";

const SUMMARY_CARDS = [
  {
    id: "artis-lagu",
    title: "Top Artis & Lagu",
    color: "bg-[#ffffff]",
    desc: "Trek dan musisi yang paling sering menemani hari kamu.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#030303]" aria-hidden="true" shapeRendering="crispEdges">
        <rect x="4" y="10" width="3" height="4" fill="currentColor" />
        <rect x="9" y="6" width="3" height="12" fill="currentColor" />
        <rect x="14" y="8" width="3" height="8" fill="currentColor" />
        <rect x="19" y="11" width="3" height="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "album-favorit",
    title: "Album Favorit",
    color: "bg-[#d86a60]",
    desc: "Koleksi album yang paling banyak kamu putar berulang kali.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#030303]" aria-hidden="true" shapeRendering="crispEdges">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "jam-dengar",
    title: "Waktu Dengar",
    color: "bg-[#6f98c8]",
    desc: "Pola jam saat kamu paling aktif menikmati musik.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#030303]" aria-hidden="true" shapeRendering="crispEdges">
        <rect x="5" y="5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="11" y="8" width="2" height="5" fill="currentColor" />
        <rect x="11" y="11" width="5" height="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "format-story",
    title: "Format Story",
    color: "bg-[#3a9fa7]",
    desc: "Ukuran pas dan tajam untuk dipajang di media sosial.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#030303]" aria-hidden="true" shapeRendering="crispEdges">
        <rect x="7" y="4" width="10" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="11" y="16" width="2" height="2" fill="currentColor" />
      </svg>
    ),
  },
];

const ADVANTAGE_FEATURES = [
  {
    id: "aman",
    title: "Aman & Privat",
    body: "Login resmi langsung lewat Spotify. Akunmu tetap aman tanpa menyimpan password atau data rahasia apa pun.",
  },
  {
    id: "tema",
    title: "7 Pilihan Tema",
    body: "Bebas pilih tema visual sesuai selera, mulai dari Neo-Brutalist, Retro, Cyberpunk, hingga Struk Belanja unik.",
  },
  {
    id: "rasio",
    title: "Pas untuk Story",
    body: "Format visual sudah disesuaikan untuk layar HP sehingga langsung pas dan tajam saat diunggah ke Instagram Story.",
  },
  {
    id: "bagikan",
    title: "Sekali Klik Bagikan",
    body: "Simpan hasil desain secara instan ke galeri atau langsung bagikan ke teman lewat media sosial pilihanmu.",
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh bg-pri text-sec">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
        <Masthead />

        <section className="relative border-b-2 border-sec/20 py-12 md:py-16">
          <div className="mb-8 max-w-4xl">
            <h1 className="font-display text-6xl sm:text-8xl md:text-9xl leading-[0.88] tracking-tight uppercase">
              Musik Kamu <br />
              <span className="text-red">Jadi Sorotan.</span>
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 my-8">
            {SUMMARY_CARDS.map((card) => (
              <div
                key={card.id}
                className={`nextec-hard-card-hero relative ${card.color} p-4 sm:p-5 flex flex-col justify-between h-[180px] sm:h-[220px] text-[#030303] cursor-default`}
              >
                <div className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider">
                  <span>{card.title}</span>
                </div>

                <div className="flex justify-center my-auto">{card.icon}</div>

                <p className="text-[11px] sm:text-xs font-body leading-snug text-[#030303]/85">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-2 border-sec/30 bg-sec/5 p-6 sm:p-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl uppercase">Lihat Wrapped Kamu Sekarang</h2>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <Suspense>
                <LoginError />
              </Suspense>
              <a
                href="/api/auth/login"
                className="nextec-hard-button inline-flex items-center justify-center gap-3 bg-red px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider text-[#fff5ef]"
              >
                Masuk dengan Spotify <span>→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="py-12 border-b-2 border-sec/20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADVANTAGE_FEATURES.map((feature) => (
              <div key={feature.id} className="border-2 border-sec/20 p-5 bg-sec/[0.02]">
                <h3 className="font-display text-2xl uppercase">{feature.title}</h3>
                <p className="font-body text-xs sm:text-sm text-sec/75 mt-2 leading-relaxed">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-8 text-center font-mono text-xs text-sec/60">
          WRAPPED
        </footer>
      </div>
    </main>
  );
}
