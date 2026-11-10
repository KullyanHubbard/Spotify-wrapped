"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PhotoFramePreview from "@/components/PhotoFramePreview";
import { DESIGNS, type DesignId } from "@/designs";
import { PREVIEW_SAMPLE } from "@/designs/preview-sample";
import {
  DEMO_SLOT_PHOTOS,
  PHOTO_CATEGORIES,
  PHOTO_TEMPLATES,
  type PhotoCategoryId,
} from "@/lib/photo-templates";

type StudioFilter = "all" | "photo" | "wrapped";

const WRAPPED_CATEGORY_MAP: Record<DesignId, PhotoCategoryId> = {
  neo: "neo",
  nota: "nota",
  retro: "retro",
  luxury: "editorial",
  cyberpunk: "cyberpunk",
  playful: "playful",
  sketch: "sketch",
};

export default function TemplateCatalog() {
  const [studioFilter, setStudioFilter] = useState<StudioFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<PhotoCategoryId | "all">("all");

  const wrappedEntries = useMemo(
    () => Object.entries(DESIGNS) as [DesignId, (typeof DESIGNS)[DesignId]][],
    []
  );

  const filteredPhotoTemplates = useMemo(() => {
    if (studioFilter === "wrapped") return [];
    if (categoryFilter === "all") return PHOTO_TEMPLATES;
    return PHOTO_TEMPLATES.filter((t) => t.category === categoryFilter);
  }, [studioFilter, categoryFilter]);

  const filteredWrappedDesigns = useMemo(() => {
    if (studioFilter === "photo") return [];
    if (categoryFilter === "all") return wrappedEntries;
    return wrappedEntries.filter(([id]) => WRAPPED_CATEGORY_MAP[id] === categoryFilter);
  }, [studioFilter, categoryFilter, wrappedEntries]);

  const totalCount = PHOTO_TEMPLATES.length + wrappedEntries.length;

  return (
    <div className="py-8">
      {/* Studio Pillar Filter + Category Filter */}
      <div className="nextec-hard-card mb-10 border-2 border-sec bg-pri p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-red">
              [FILTER 01 // PILAR STUDIO]
            </span>
            <div className="mt-2 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setStudioFilter("all")}
                className={`nextec-hard-button cursor-pointer px-4 py-2 font-mono text-xs font-bold uppercase ${
                  studioFilter === "all" ? "bg-red text-[#fff5ef]" : "bg-pri text-sec"
                }`}
              >
                Semua Koleksi ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStudioFilter("photo")}
                className={`nextec-hard-button cursor-pointer px-4 py-2 font-mono text-xs font-bold uppercase ${
                  studioFilter === "photo" ? "bg-red text-[#fff5ef]" : "bg-pri text-sec"
                }`}
              >
                Kilasara Snap · Foto ({PHOTO_TEMPLATES.length})
              </button>
              <button
                type="button"
                onClick={() => setStudioFilter("wrapped")}
                className={`nextec-hard-button cursor-pointer px-4 py-2 font-mono text-xs font-bold uppercase ${
                  studioFilter === "wrapped" ? "bg-red text-[#fff5ef]" : "bg-pri text-sec"
                }`}
              >
                Kilasara Wrapped · Musik ({wrappedEntries.length})
              </button>
            </div>
          </div>

          <div className="border-t border-sec/20 pt-4">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-red">
              [FILTER 02 // GAYA VISUAL]
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {PHOTO_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`cursor-pointer border-2 border-sec px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors ${
                    categoryFilter === cat.id
                      ? "bg-sec text-pri"
                      : "bg-pri text-sec hover:bg-sec/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION A: KILASARA SNAP PHOTO TEMPLATES */}
      {filteredPhotoTemplates.length > 0 && (
        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between border-b-2 border-sec/30 pb-3">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-red">
                [PILAR 01 // KILASARA SNAP]
              </span>
              <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
                Template Frame Foto ({filteredPhotoTemplates.length})
              </h2>
            </div>
            <Link
              href="/photo"
              className="font-mono text-xs font-bold uppercase text-red underline hover:text-sec"
            >
              Buka Snap Studio →
            </Link>
          </div>

          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPhotoTemplates.map((tpl, idx) => (
              <li key={tpl.id}>
                <Link
                  href={`/photo?template=${tpl.id}`}
                  className="nextec-hard-card group flex h-full flex-col justify-between border-2 border-sec bg-pri p-5 transition-colors hover:border-red"
                >
                  <div>
                    <div className="pointer-events-none mx-auto mb-4 w-full max-w-[220px] border-2 border-sec bg-sec/5 p-2">
                      <div className="@container aspect-[9/16] w-full overflow-hidden border border-sec/30">
                        <PhotoFramePreview
                          template={tpl}
                          photos={DEMO_SLOT_PHOTOS}
                          dateLabel="2026"
                          hideInteractiveUI
                        />
                      </div>
                    </div>

                    <div className="mb-2 flex items-center justify-between font-mono text-xs text-sec/60">
                      <span className="font-bold text-red">
                        [SNAP #{String(idx + 1).padStart(2, "0")}]
                      </span>
                      <span className="border border-sec/40 px-1.5 py-0.5 text-[10px] font-bold uppercase text-sec">
                        {tpl.badge} · {tpl.slots} FOTO
                      </span>
                    </div>

                    <h3 className="font-display text-3xl uppercase tracking-wide transition-colors group-hover:text-red">
                      {tpl.name}
                    </h3>

                    <p className="mt-1.5 font-body text-xs leading-relaxed text-sec/70">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-sec/20 pt-3.5 font-mono text-xs font-bold uppercase tracking-wider">
                    <span className="text-sec transition-colors group-hover:text-red">
                      Pakai Frame Ini
                    </span>
                    <span className="text-red transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* SECTION B: KILASARA WRAPPED TEMPLATES */}
      {filteredWrappedDesigns.length > 0 && (
        <section>
          <div className="mb-6 flex items-end justify-between border-b-2 border-sec/30 pb-3">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-red">
                [PILAR 02 // KILASARA WRAPPED]
              </span>
              <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">
                Tema Data &amp; Musik Wrapped ({filteredWrappedDesigns.length})
              </h2>
            </div>
            <Link
              href="/wrapped"
              className="font-mono text-xs font-bold uppercase text-red underline hover:text-sec"
            >
              Buka Wrapped Studio →
            </Link>
          </div>

          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWrappedDesigns.map(([id, design], i) => (
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
                        <div
                          key={n}
                          className={`@container aspect-[9/16] overflow-hidden border border-sec/20 ${design.fontClassName}`}
                        >
                          <Slide {...PREVIEW_SAMPLE} n={n + 1} total={design.slides.length} />
                        </div>
                      ))}
                    </div>

                    <div className="mb-2 flex items-center justify-between font-mono text-xs text-sec/60">
                      <span className="font-bold text-red">[WRAPPED #0{i + 1}]</span>
                      <span className="text-[10px] uppercase tracking-widest">
                        {design.slides.length} SLIDE · ID: {id}
                      </span>
                    </div>

                    <h3 className="font-display text-3xl uppercase tracking-wide transition-colors group-hover:text-red sm:text-4xl">
                      {design.name}
                    </h3>

                    <p className="mt-2 font-body text-xs leading-relaxed text-sec/70 sm:text-sm">
                      {design.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-sec/20 pt-4 font-mono text-xs font-bold uppercase tracking-wider">
                    <span className="text-sec transition-colors group-hover:text-red">
                      Pakai Tema Wrapped
                    </span>
                    <span className="text-red transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
