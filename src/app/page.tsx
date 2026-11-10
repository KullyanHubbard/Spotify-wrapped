import { Suspense } from "react";
import Link from "next/link";
import LoginError from "@/components/LoginError";
import Masthead from "@/components/Masthead";
import PhotoFramePreview from "@/components/PhotoFramePreview";
import { DEMO_SLOT_PHOTOS, PHOTO_TEMPLATES } from "@/lib/photo-templates";

const SUMMARY_CARDS = [
  {
    id: "snap-studio",
    title: "Kilasara Snap",
    color: "bg-[#ffffff]",
    desc: "Online photobooth dengan kamera langsung maupun upload foto galeri.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#030303]" aria-hidden="true" shapeRendering="crispEdges">
        <rect x="3" y="6" width="18" height="14" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="4" width="8" height="2" fill="currentColor" />
        <circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "wrapped-studio",
    title: "Kilasara Wrapped",
    color: "bg-[#d86a60]",
    desc: "Ubah riwayat lagu dan jejak musikmu menjadi kartu cerita visual.",
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
    id: "katalog-template",
    title: "31+ Template",
    color: "bg-[#6f98c8]",
    desc: "Koleksi frame 4-cuts, struk kasir, koran retro, cyberpunk, hingga sampul majalah.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#030303]" aria-hidden="true" shapeRendering="crispEdges">
        <rect x="4" y="4" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="13" y="4" width="7" height="7" fill="currentColor" />
        <rect x="4" y="13" width="7" height="7" fill="currentColor" />
        <rect x="13" y="13" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "format-story",
    title: "Format Story 9:16",
    color: "bg-[#3a9fa7]",
    desc: "Resolusi tajam 1080p yang pas untuk langsung dipajang ke media sosial.",
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
    id: "dua-mode-foto",
    title: "Kamera & Upload",
    body: "Bisa jepret langsung pakai kamera HP/webcam dengan timer otomatis, atau pilih foto terbaik yang sudah ada di galeri.",
  },
  {
    id: "koleksi-template",
    title: "Puluhan Template",
    body: "Bebas ganti gaya visual mulai dari Neo-Brutalist, Struk Belanja, Surat Kabar Klasik, K-Photobox, hingga Luxury Editorial.",
  },
  {
    id: "privasi",
    title: "100% Di Browser",
    body: "Semua foto dan file riwayat diproses langsung di perangkat kamu tanpa pernah disimpan atau dikirim ke server eksternal.",
  },
  {
    id: "bagikan",
    title: "Siap Cetak & Story",
    body: "Unduh hasil karya dalam format PNG beresolusi tinggi atau bagikan langsung ke Instagram Story dalam sekali klik.",
  },
];

export default function Home() {
  const featuredPhotoTemplates = PHOTO_TEMPLATES.slice(0, 4);

  return (
    <main className="min-h-dvh bg-pri text-sec">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:px-8">
        <Masthead />

        {/* HERO SECTION */}
        <section className="relative border-b-2 border-sec/20 py-12 md:py-16">
          <div className="mb-8 max-w-5xl">
            <div className="mb-3 inline-block border-2 border-sec bg-[#facc15] px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#030303]">
              KILASARA CREATIVE &amp; MEMORY STUDIO
            </div>
            <h1 className="font-display text-6xl leading-[0.88] tracking-tight uppercase sm:text-8xl md:text-9xl">
              Kilas Foto &amp; Aksara <br />
              <span className="text-red">Jadi Sorotan.</span>
            </h1>
            <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-sec/80 sm:text-base">
              Satu rumah kreatif untuk mengabadikan potret momenmu di <strong>Kilasara Snap (Online Photo Studio)</strong> dan merangkum cerita datamu di <strong>Kilasara Wrapped</strong> dengan puluhan template estetik.
            </p>
          </div>

          <div className="my-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {SUMMARY_CARDS.map((card) => (
              <div
                key={card.id}
                className={`nextec-hard-card-hero relative ${card.color} flex h-[180px] cursor-default flex-col justify-between p-4 text-[#030303] sm:h-[220px] sm:p-5`}
              >
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider sm:text-xs">
                  <span>{card.title}</span>
                </div>

                <div className="my-auto flex justify-center">{card.icon}</div>

                <p className="font-body text-[11px] leading-snug text-[#030303]/85 sm:text-xs">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* TWO MAIN STUDIO PILLARS */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* PILAR 1: KILASARA SNAP STUDIO */}
            <div className="nextec-hard-card flex flex-col justify-between border-2 border-sec bg-pri p-6 sm:p-8">
              <div>
                <div className="mb-3 flex items-center justify-between font-mono text-xs font-bold uppercase">
                  <span className="bg-red px-2 py-0.5 text-[#fff5ef]">PILAR 01 // KILASARA SNAP</span>
                  <span className="text-sec/60">24 TEMPLATE FRAME</span>
                </div>
                <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
                  Online Photo Studio
                </h2>
                <p className="mt-3 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
                  Rasakan pengalaman photobox langsung dari browser. Jepret foto beruntun dengan timer kamera atau unggah foto dari galeri, pasang filter khas studio, lalu cetak ke puluhan frame unik.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-sec/20 pt-5">
                <Link
                  href="/photo"
                  className="nextec-hard-button inline-flex items-center justify-center gap-2 bg-red px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#fff5ef]"
                >
                  Buka Snap Studio <span>→</span>
                </Link>
                <Link
                  href="/templates"
                  className="nextec-hard-button inline-flex items-center justify-center gap-2 bg-pri px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-sec"
                >
                  Lihat Frame Foto
                </Link>
              </div>
            </div>

            {/* PILAR 2: KILASARA WRAPPED STUDIO */}
            <div className="nextec-hard-card flex flex-col justify-between border-2 border-sec bg-pri p-6 sm:p-8">
              <div>
                <div className="mb-3 flex items-center justify-between font-mono text-xs font-bold uppercase">
                  <span className="bg-sec px-2 py-0.5 text-pri">PILAR 02 // KILASARA WRAPPED</span>
                  <span className="text-sec/60">7 TEMA SLIDE</span>
                </div>
                <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
                  Music &amp; Data Wrapped
                </h2>
                <p className="mt-3 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
                  Ubah riwayat dengar Spotify kamu menjadi 9-10 slide cerita visual kapan saja tanpa harus menunggu akhir tahun. Mendukung login instan maupun perhitungan total menit asli dari file riwayat.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-sec/20 pt-5">
                <Suspense>
                  <LoginError />
                </Suspense>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/api/auth/login"
                    className="nextec-hard-button inline-flex items-center justify-center gap-2 bg-red px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#fff5ef]"
                  >
                    Masuk dengan Spotify <span>→</span>
                  </a>
                  <Link
                    href="/wrapped"
                    className="nextec-hard-button inline-flex items-center justify-center gap-2 bg-pri px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-sec"
                  >
                    Pratinjau 7 Tema
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PHOTO TEMPLATES SHOWCASE */}
        <section className="border-b-2 border-sec/20 py-12">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-red">
                [PILAR 03 // KILASARA GALERI]
              </span>
              <h2 className="font-display text-4xl uppercase sm:text-6xl">
                Sorotan Template Frame
              </h2>
            </div>
            <Link
              href="/templates"
              className="nextec-hard-button self-start bg-pri px-5 py-2.5 font-mono text-xs font-bold uppercase text-sec"
            >
              Lihat Semua 31+ Template →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPhotoTemplates.map((tpl) => (
              <Link
                key={tpl.id}
                href={`/photo?template=${tpl.id}`}
                className="nextec-hard-card group flex flex-col justify-between border-2 border-sec bg-pri p-4 transition-colors hover:border-red"
              >
                <div>
                  <div className="pointer-events-none mx-auto mb-4 w-full max-w-[200px] border border-sec/30 bg-sec/5 p-2">
                    <div className="@container aspect-[9/16] w-full overflow-hidden">
                      <PhotoFramePreview
                        template={tpl}
                        photos={DEMO_SLOT_PHOTOS}
                        dateLabel="2026"
                        hideInteractiveUI
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase text-sec/60">
                    <span className="text-red">{tpl.badge}</span>
                    <span>{tpl.slots} SLOT</span>
                  </div>
                  <h3 className="mt-1 font-display text-2xl uppercase group-hover:text-red">
                    {tpl.name}
                  </h3>
                </div>

                <div className="mt-4 border-t border-sec/20 pt-3 font-mono text-xs font-bold uppercase text-red">
                  Coba Frame Ini →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ADVANTAGES */}
        <section className="border-b-2 border-sec/20 py-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGE_FEATURES.map((feature) => (
              <div key={feature.id} className="border-2 border-sec/20 bg-sec/[0.02] p-5">
                <h3 className="font-display text-2xl uppercase">{feature.title}</h3>
                <p className="mt-2 font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="py-8 text-center font-mono text-xs text-sec/60">
          KILASARA STUDIO · KILAS FOTO &amp; AKSARA CERITA
        </footer>
      </div>
    </main>
  );
}
