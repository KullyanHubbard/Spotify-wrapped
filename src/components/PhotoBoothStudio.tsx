"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toBlob } from "html-to-image";
import PhotoFramePreview from "@/components/PhotoFramePreview";
import {
  DEMO_SLOT_PHOTOS,
  getPhotoTemplateById,
  PHOTO_CATEGORIES,
  PHOTO_FILTERS,
  PHOTO_TEMPLATES,
  type PhotoCategoryId,
  type PhotoFilterId,
  type PhotoTemplateConfig,
} from "@/lib/photo-templates";

type SourceMode = "camera" | "upload";
type TimerSeconds = 0 | 3 | 5;

async function renderFrameBlob(node: HTMLElement): Promise<Blob> {
  const width = node.offsetWidth;
  const options = {
    pixelRatio: 1080 / width,
    canvasWidth: width,
    canvasHeight: (width * 16) / 9,
  };
  await toBlob(node, options);
  const blob = await toBlob(node, options);
  if (!blob) throw new Error("Gagal merender gambar frame");
  return blob;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Gagal membaca file gambar"));
    };
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.readAsDataURL(file);
  });
}

export default function PhotoBoothStudio() {
  const searchParams = useSearchParams();
  const initialTemplateId = searchParams.get("template");
  const initialTemplate = useMemo(
    () => getPhotoTemplateById(initialTemplateId),
    [initialTemplateId]
  );

  const [selectedTemplate, setSelectedTemplate] = useState<PhotoTemplateConfig>(initialTemplate);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategoryId | "all">("all");
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [sourceMode, setSourceMode] = useState<SourceMode>("upload");

  // Customization states
  const [filterId, setFilterId] = useState<PhotoFilterId>(initialTemplate.defaultFilter);
  const [caption, setCaption] = useState<string>(initialTemplate.defaultCaption);
  const [subcaption, setSubcaption] = useState<string>(initialTemplate.defaultSubcaption);
  const [dateLabel, setDateLabel] = useState<string>("EDISI 2026");

  // Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [mirrored, setMirrored] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState<TimerSeconds>(3);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturingBurst, setIsCapturingBurst] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);

  // Export states
  const [exporting, setExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const multiUploadRef = useRef<HTMLInputElement | null>(null);
  const singleUploadRef = useRef<HTMLInputElement | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(
    async (targetFacing: "user" | "environment" = facingMode) => {
      setCameraError(null);
      stopCamera();
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setCameraError("Browser kamu tidak mendukung akses kamera langsung. Gunakan mode Upload Foto.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: targetFacing,
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
      } catch {
        setCameraError(
          "Izin kamera ditolak atau perangkat kamera tidak ditemukan. Kamu tetap bisa memakai mode Upload Foto Galeri."
        );
        setCameraActive(false);
      }
    },
    [facingMode, stopCamera]
  );

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  function handleSelectTemplate(template: PhotoTemplateConfig) {
    setSelectedTemplate(template);
    setFilterId(template.defaultFilter);
    setCaption(template.defaultCaption);
    setSubcaption(template.defaultSubcaption);
    if (activeSlot >= template.slots) {
      setActiveSlot(0);
    }
  }

  function captureVideoFrame(): string | null {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = document.createElement("canvas");
    const targetWidth = 960;
    const targetHeight = 720;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const videoAspect = video.videoWidth / video.videoHeight;
    const targetAspect = targetWidth / targetHeight;
    let sx = 0;
    let sy = 0;
    let sw = video.videoWidth;
    let sh = video.videoHeight;

    if (videoAspect > targetAspect) {
      sw = video.videoHeight * targetAspect;
      sx = (video.videoWidth - sw) / 2;
    } else {
      sh = video.videoWidth / targetAspect;
      sy = (video.videoHeight - sh) / 2;
    }

    if (mirrored) {
      ctx.translate(targetWidth, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL("image/jpeg", 0.92);
  }

  async function runCountdown(seconds: number): Promise<void> {
    if (seconds <= 0) return;
    for (let remaining = seconds; remaining >= 1; remaining--) {
      setCountdown(remaining);
      await new Promise((r) => setTimeout(r, 950));
    }
    setCountdown(null);
  }

  function triggerFlash() {
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 220);
  }

  async function handleCaptureSingleSlot() {
    if (!cameraActive || isCapturingBurst) return;
    setIsCapturingBurst(true);
    try {
      await runCountdown(timerSeconds);
      const dataUrl = captureVideoFrame();
      if (dataUrl) {
        triggerFlash();
        setPhotos((prev) => {
          const next = [...prev];
          next[activeSlot] = dataUrl;
          return next;
        });
        if (activeSlot + 1 < selectedTemplate.slots) {
          setActiveSlot(activeSlot + 1);
        }
      }
    } finally {
      setCountdown(null);
      setIsCapturingBurst(false);
    }
  }

  async function handleCaptureAllSlots() {
    if (!cameraActive || isCapturingBurst) return;
    setIsCapturingBurst(true);
    try {
      const waitSec = timerSeconds === 0 ? 1 : timerSeconds;
      for (let slot = 0; slot < selectedTemplate.slots; slot++) {
        setActiveSlot(slot);
        await runCountdown(waitSec);
        const dataUrl = captureVideoFrame();
        if (dataUrl) {
          triggerFlash();
          setPhotos((prev) => {
            const next = [...prev];
            next[slot] = dataUrl;
            return next;
          });
        }
        if (slot + 1 < selectedTemplate.slots) {
          await new Promise((r) => setTimeout(r, 450));
        }
      }
      setStatusMessage(`Berhasil mengambil ${selectedTemplate.slots} foto beruntun!`);
    } finally {
      setCountdown(null);
      setIsCapturingBurst(false);
    }
  }

  async function handleMultiFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, 4);
    try {
      const urls = await Promise.all(files.map(readFileAsDataUrl));
      setPhotos((prev) => {
        const next = [...prev];
        let cursor = activeSlot;
        for (const url of urls) {
          if (cursor < 4) {
            next[cursor] = url;
            cursor++;
          }
        }
        return next;
      });
      setStatusMessage(`${urls.length} foto berhasil dimasukkan ke frame.`);
    } catch {
      setStatusMessage("Sebagian file foto gagal dibaca. Gunakan format JPG/PNG/WebP.");
    } finally {
      e.target.value = "";
    }
  }

  async function handleSingleSlotUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await readFileAsDataUrl(file);
      setPhotos((prev) => {
        const next = [...prev];
        next[activeSlot] = url;
        return next;
      });
      setStatusMessage(`Foto pada Slot #${activeSlot + 1} berhasil diperbarui.`);
      if (activeSlot + 1 < selectedTemplate.slots) {
        setActiveSlot(activeSlot + 1);
      }
    } catch {
      setStatusMessage("File foto gagal dibaca.");
    } finally {
      e.target.value = "";
    }
  }

  function fillDemoPhotos() {
    setPhotos([...DEMO_SLOT_PHOTOS]);
    setStatusMessage("4 foto contoh dipasang. Bebas ganti template & filter di bawah!");
  }

  function clearAllPhotos() {
    setPhotos([null, null, null, null]);
    setActiveSlot(0);
    setStatusMessage("Semua slot foto dikosongkan.");
  }

  function swapSlotWithNext(slotIdx: number) {
    const nextIdx = (slotIdx + 1) % selectedTemplate.slots;
    setPhotos((prev) => {
      const copy = [...prev];
      const temp = copy[slotIdx];
      copy[slotIdx] = copy[nextIdx];
      copy[nextIdx] = temp;
      return copy;
    });
  }

  async function handleExportFrame(mode: "download" | "share") {
    const node = frameRef.current;
    if (!node || exporting) return;
    setExporting(true);
    setStatusMessage(null);

    try {
      // Beri waktu 1 frame agar indikator interaktif slot disembunyikan sebelum dirender ke PNG
      await new Promise((r) => setTimeout(r, 60));
      const blob = await renderFrameBlob(node);
      const fileName = `kilasara-${selectedTemplate.id}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      const triggerDownload = () => {
        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = fileName;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
        setStatusMessage("Gambar PNG 1080p berhasil diunduh!");
      };

      if (mode === "share" && typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          if (navigator.canShare && !navigator.canShare({ files: [file] })) {
            triggerDownload();
            return;
          }
          await navigator.share({ files: [file] });
          setStatusMessage("Berhasil membuka menu bagikan.");
        } catch (err) {
          if ((err as Error).name === "AbortError") return;
          triggerDownload();
        }
      } else {
        triggerDownload();
      }
    } catch {
      setStatusMessage("Gagal mengekspor gambar. Silakan coba lagi.");
    } finally {
      setExporting(false);
    }
  }

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === "all") return PHOTO_TEMPLATES;
    return PHOTO_TEMPLATES.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const filledCount = photos.slice(0, selectedTemplate.slots).filter(Boolean).length;

  return (
    <div className="py-8">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN: SOURCE (CAMERA / UPLOAD) + TEMPLATE EDITOR */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* 1. Source Mode Switcher */}
          <div className="nextec-hard-card border-2 border-sec bg-pri p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-sec/20 pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-red">
                  [LANGKAH 01 // SUMBER FOTO]
                </span>
                <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
                  Ambil atau Upload Foto
                </h2>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSourceMode("upload");
                    stopCamera();
                  }}
                  className={`nextec-hard-button cursor-pointer px-4 py-2 font-mono text-xs font-bold uppercase ${
                    sourceMode === "upload" ? "bg-red text-[#fff5ef]" : "bg-pri text-sec"
                  }`}
                >
                  Upload Galeri
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSourceMode("camera");
                    startCamera();
                  }}
                  className={`nextec-hard-button cursor-pointer px-4 py-2 font-mono text-xs font-bold uppercase ${
                    sourceMode === "camera" ? "bg-red text-[#fff5ef]" : "bg-pri text-sec"
                  }`}
                >
                  Kamera Langsung
                </button>
              </div>
            </div>

            {/* MODE A: UPLOAD GALERI */}
            {sourceMode === "upload" && (
              <div className="mt-5 flex flex-col gap-4">
                <p className="font-body text-xs leading-relaxed text-sec/75 sm:text-sm">
                  Pilih foto langsung dari galeri HP atau laptop kamu. Semua foto diproses 100% di browser perangkatmu tanpa diunggah ke server.
                </p>

                <input
                  ref={multiUploadRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiFileUpload}
                  className="hidden"
                />
                <input
                  ref={singleUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSingleSlotUpload}
                  className="hidden"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => multiUploadRef.current?.click()}
                    className="nextec-hard-button cursor-pointer bg-red px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#fff5ef]"
                  >
                    + Pilih Foto Galeri ({selectedTemplate.slots} Slot)
                  </button>

                  <button
                    type="button"
                    onClick={() => singleUploadRef.current?.click()}
                    className="nextec-hard-button cursor-pointer bg-pri px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-sec"
                  >
                    Ganti Foto Slot #{activeSlot + 1} Saja
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sec/20 pt-4">
                  <button
                    type="button"
                    onClick={fillDemoPhotos}
                    className="nextec-hard-button cursor-pointer bg-[#facc15] px-4 py-2 font-mono text-xs font-bold uppercase text-[#030303]"
                  >
                    ★ Isi Foto Contoh Instan
                  </button>

                  <button
                    type="button"
                    onClick={clearAllPhotos}
                    className="cursor-pointer border border-sec/40 px-3 py-2 font-mono text-xs font-bold uppercase text-sec/75 hover:border-red hover:text-red"
                  >
                    Kosongkan Semua Slot
                  </button>
                </div>
              </div>
            )}

            {/* MODE B: LIVE CAMERA */}
            {sourceMode === "camera" && (
              <div className="mt-5 flex flex-col gap-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-sec bg-[#09090b]">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className={`h-full w-full object-cover ${mirrored ? "-scale-x-100" : ""}`}
                  />

                  {!cameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-[#fff5ef]">
                      <p className="font-mono text-xs uppercase tracking-wider text-[#fff5ef]/80">
                        {cameraError ?? "Kamera belum aktif. Klik tombol di bawah untuk menyalakan kamera."}
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => startCamera()}
                          className="nextec-hard-button cursor-pointer bg-red px-5 py-2.5 font-mono text-xs font-bold uppercase text-[#fff5ef]"
                        >
                          Nyalakan Kamera
                        </button>
                        <button
                          type="button"
                          onClick={fillDemoPhotos}
                          className="nextec-hard-button cursor-pointer bg-[#facc15] px-4 py-2.5 font-mono text-xs font-bold uppercase text-[#030303]"
                        >
                          Pakai Foto Contoh
                        </button>
                      </div>
                    </div>
                  )}

                  {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                      <span className="font-display text-8xl text-[#fff5ef] sm:text-9xl">
                        {countdown}
                      </span>
                    </div>
                  )}

                  {flashEffect && <div className="pointer-events-none absolute inset-0 bg-white" />}

                  <div className="absolute top-3 left-3 bg-sec/85 px-2.5 py-1 font-mono text-[11px] font-bold uppercase text-pri">
                    TARGET: SLOT #{activeSlot + 1} / {selectedTemplate.slots}
                  </div>
                </div>

                {/* Camera Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase">Timer:</span>
                    {([0, 3, 5] as TimerSeconds[]).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimerSeconds(t)}
                        className={`cursor-pointer border border-sec px-2.5 py-1 font-mono text-xs font-bold uppercase ${
                          timerSeconds === t ? "bg-sec text-pri" : "bg-pri text-sec"
                        }`}
                      >
                        {t === 0 ? "0d" : `${t}d`}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setMirrored((m) => !m)}
                      className="cursor-pointer border border-sec px-3 py-1 font-mono text-xs font-bold uppercase"
                    >
                      Cermin: {mirrored ? "ON" : "OFF"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const nextFacing = facingMode === "user" ? "environment" : "user";
                        setFacingMode(nextFacing);
                        startCamera(nextFacing);
                      }}
                      className="cursor-pointer border border-sec px-3 py-1 font-mono text-xs font-bold uppercase"
                    >
                      Ganti Lensa
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={!cameraActive || isCapturingBurst}
                    onClick={handleCaptureAllSlots}
                    className="nextec-hard-button cursor-pointer bg-red px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#fff5ef] disabled:opacity-50"
                  >
                    {isCapturingBurst
                      ? "Memotret..."
                      : `● Jepret Otomatis (${selectedTemplate.slots} Slot)`}
                  </button>

                  <button
                    type="button"
                    disabled={!cameraActive || isCapturingBurst}
                    onClick={handleCaptureSingleSlot}
                    className="nextec-hard-button cursor-pointer bg-pri px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-sec disabled:opacity-50"
                  >
                    Jepret Slot #{activeSlot + 1} Saja
                  </button>
                </div>
              </div>
            )}

            {/* Slot Quick Manager */}
            <div className="mt-5 border-t-2 border-sec/20 pt-4">
              <div className="mb-2 flex items-center justify-between font-mono text-xs">
                <span className="font-bold uppercase">
                  Urutan Slot Foto ({filledCount}/{selectedTemplate.slots} Terisi)
                </span>
                <span className="text-sec/60">Klik slot untuk memilih target foto</span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {Array.from({ length: selectedTemplate.slots }).map((_, idx) => {
                  const hasPhoto = Boolean(photos[idx]);
                  const isCurrent = activeSlot === idx;
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col border-2 p-1.5 ${
                        isCurrent ? "border-red bg-red/5" : "border-sec/40 bg-pri"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveSlot(idx)}
                        className="cursor-pointer text-left font-mono text-[11px] font-bold uppercase"
                      >
                        Slot #{idx + 1} {isCurrent ? "●" : ""}
                      </button>
                      <span className="mt-0.5 font-mono text-[10px] text-sec/60">
                        {hasPhoto ? "Sudah terisi" : "Kosong"}
                      </span>
                      {selectedTemplate.slots > 1 && (
                        <button
                          type="button"
                          onClick={() => swapSlotWithNext(idx)}
                          className="mt-1.5 cursor-pointer border border-sec/30 px-1.5 py-0.5 font-mono text-[10px] uppercase hover:border-sec"
                        >
                          Tukar ⇄
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Template Selector (24 Templates) */}
          <div className="nextec-hard-card border-2 border-sec bg-pri p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-sec/20 pb-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-red">
                  [LANGKAH 02 // PILIH FRAME STUDIO]
                </span>
                <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
                  Koleksi Template ({PHOTO_TEMPLATES.length} Desain)
                </h2>
              </div>
              <Link
                href="/templates"
                className="font-mono text-xs font-bold uppercase text-red underline hover:text-sec"
              >
                Lihat Katalog Penuh →
              </Link>
            </div>

            {/* Category Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {PHOTO_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`cursor-pointer border-2 border-sec px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-sec text-pri"
                      : "bg-pri text-sec hover:bg-sec/10"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="mt-4 grid max-h-[340px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
              {filteredTemplates.map((tpl) => {
                const active = tpl.id === selectedTemplate.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`cursor-pointer border-2 p-3 text-left transition-all ${
                      active
                        ? "border-red bg-red/10 shadow-[4px_4px_0_#030303]"
                        : "border-sec/40 bg-pri hover:border-sec"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 font-mono text-[10px] font-bold uppercase">
                      <span
                        style={{
                          backgroundColor: tpl.style.accent,
                          color: tpl.style.accentText,
                        }}
                        className="px-1.5 py-0.5"
                      >
                        {tpl.badge}
                      </span>
                      <span>{tpl.slots} FOTO</span>
                    </div>
                    <div className="mt-2 font-display text-xl leading-tight uppercase">
                      {tpl.name}
                    </div>
                    <p className="mt-1 line-clamp-2 font-body text-[11px] text-sec/70">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Filter, Caption & Watermark Editor */}
          <div className="nextec-hard-card border-2 border-sec bg-pri p-5 sm:p-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-red">
              [LANGKAH 03 // FILTER & AKSARA CERITA]
            </span>
            <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">
              Sentuhan Akhir Studio
            </h2>

            {/* Filter Picker */}
            <div className="mt-4">
              <label className="block font-mono text-xs font-bold uppercase">
                Filter Warna Foto:
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PHOTO_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterId(f.id)}
                    className={`cursor-pointer border-2 border-sec px-3 py-2 text-left font-mono text-xs font-bold uppercase ${
                      filterId === f.id ? "bg-red text-[#fff5ef]" : "bg-pri text-sec"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Inputs */}
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="kilas-caption"
                  className="block font-mono text-xs font-bold uppercase"
                >
                  Judul Utama Frame
                </label>
                <input
                  id="kilas-caption"
                  type="text"
                  maxLength={36}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-1.5 w-full border-2 border-sec bg-white px-3 py-2 font-mono text-xs text-sec focus:border-red focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="kilas-subcaption"
                  className="block font-mono text-xs font-bold uppercase"
                >
                  Sub-Judul / Lokasi
                </label>
                <input
                  id="kilas-subcaption"
                  type="text"
                  maxLength={44}
                  value={subcaption}
                  onChange={(e) => setSubcaption(e.target.value)}
                  className="mt-1.5 w-full border-2 border-sec bg-white px-3 py-2 font-mono text-xs text-sec focus:border-red focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="kilas-date"
                  className="block font-mono text-xs font-bold uppercase"
                >
                  Label Tanggal
                </label>
                <input
                  id="kilas-date"
                  type="text"
                  maxLength={20}
                  value={dateLabel}
                  onChange={(e) => setDateLabel(e.target.value)}
                  className="mt-1.5 w-full border-2 border-sec bg-white px-3 py-2 font-mono text-xs text-sec focus:border-red focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE 9:16 PREVIEW & DOWNLOAD */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 flex flex-col items-center gap-4">
            <div className="w-full max-w-[380px]">
              <div className="mb-2 flex items-center justify-between font-mono text-xs font-bold uppercase">
                <span>PRATINJAU CETAK (9:16)</span>
                <span className="text-red">{selectedTemplate.name}</span>
              </div>

              <div className="border-2 border-sec shadow-[8px_8px_0_#030303]">
                <div
                  ref={frameRef}
                  className="@container aspect-[9/16] w-full overflow-hidden"
                >
                  <PhotoFramePreview
                    template={selectedTemplate}
                    photos={photos}
                    filterId={filterId}
                    caption={caption}
                    subcaption={subcaption}
                    dateLabel={dateLabel}
                    activeSlot={activeSlot}
                    onSelectSlot={(idx) => setActiveSlot(idx)}
                    hideInteractiveUI={exporting}
                  />
                </div>
              </div>

              {statusMessage && (
                <div
                  role="status"
                  className="mt-3 border-2 border-sec bg-[#facc15] px-3 py-2 font-mono text-xs font-bold text-[#030303]"
                >
                  {statusMessage}
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={exporting}
                  onClick={() => handleExportFrame("download")}
                  className="nextec-hard-button cursor-pointer bg-red px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#fff5ef] disabled:opacity-50"
                >
                  {exporting ? "Merender..." : "Download PNG ↓"}
                </button>

                <button
                  type="button"
                  disabled={exporting}
                  onClick={() => handleExportFrame("share")}
                  className="nextec-hard-button cursor-pointer bg-pri px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-sec disabled:opacity-50"
                >
                  Share ke Story ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
