import type { PhotoFilterId, PhotoTemplateConfig } from "@/lib/photo-templates";
import { getPhotoFilterById } from "@/lib/photo-templates";

interface PhotoFramePreviewProps {
  template: PhotoTemplateConfig;
  photos: (string | null)[];
  filterId?: PhotoFilterId;
  caption?: string;
  subcaption?: string;
  dateLabel?: string;
  activeSlot?: number;
  onSelectSlot?: (index: number) => void;
  hideInteractiveUI?: boolean;
}

export default function PhotoFramePreview({
  template,
  photos,
  filterId,
  caption,
  subcaption,
  dateLabel = "2026",
  activeSlot,
  onSelectSlot,
  hideInteractiveUI = false,
}: PhotoFramePreviewProps) {
  const { style, layout, slots } = template;
  const activeFilter = getPhotoFilterById(filterId ?? template.defaultFilter);
  const displayCaption = (caption ?? template.defaultCaption).trim() || template.defaultCaption;
  const displaySubcaption = (subcaption ?? template.defaultSubcaption).trim() || template.defaultSubcaption;

  const fontClass =
    style.fontStyle === "display"
      ? "font-display tracking-wide"
      : style.fontStyle === "mono"
        ? "font-mono tracking-tight"
        : "font-body";

  const borderStyleCss =
    style.borderStyle === "dashed"
      ? "dashed"
      : style.borderStyle === "double"
        ? "double"
        : "solid";

  const borderWidthCss =
    style.borderStyle === "double"
      ? "0.9cqw"
      : style.borderStyle === "hard"
        ? "0.65cqw"
        : "0.35cqw";

  const cardShadowCss =
    style.borderStyle === "hard" && style.shadowColor
      ? `1.4cqw 1.4cqw 0 ${style.shadowColor}`
      : "none";

  function renderSlot(slotIndex: number, aspectClass: string) {
    const src = photos[slotIndex] ?? null;
    const isSelected = !hideInteractiveUI && activeSlot === slotIndex;
    const isInteractive = Boolean(onSelectSlot) && !hideInteractiveUI;

    return (
      <div
        key={slotIndex}
        onClick={onSelectSlot ? () => onSelectSlot(slotIndex) : undefined}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={
          isInteractive && onSelectSlot
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectSlot(slotIndex);
                }
              }
            : undefined
        }
        style={{
          borderColor: isSelected ? style.accent : style.borderColor,
          borderWidth: isSelected ? "0.75cqw" : "0.45cqw",
          borderStyle: "solid",
        }}
        className={`relative overflow-hidden ${aspectClass} ${
          isInteractive ? "cursor-pointer transition-opacity hover:opacity-95" : ""
        }`}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={`Foto slot ${slotIndex + 1}`}
            crossOrigin="anonymous"
            style={{ filter: activeFilter.cssFilter }}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            style={{
              backgroundColor: style.bg,
              color: style.text,
            }}
            className="flex h-full w-full flex-col items-center justify-center gap-[1cqw] p-[2cqw] text-center"
          >
            <div
              style={{
                borderColor: style.borderColor,
                backgroundColor: style.accent,
                color: style.accentText,
              }}
              className="flex h-[6.5cqw] w-[6.5cqw] items-center justify-center border font-mono text-[2.8cqw] font-bold"
            >
              0{slotIndex + 1}
            </div>
            <span
              style={{ color: style.mutedText }}
              className="font-mono text-[2.3cqw] font-bold uppercase tracking-wider"
            >
              SLOT FOTO {slotIndex + 1}
            </span>
          </div>
        )}

        {isInteractive && (
          <div
            style={{
              backgroundColor: isSelected ? style.accent : style.borderColor,
              color: isSelected ? style.accentText : style.cardBg,
            }}
            className="pointer-events-none absolute top-[1.2cqw] left-[1.2cqw] px-[1.4cqw] py-[0.3cqw] font-mono text-[2.1cqw] font-bold uppercase"
          >
            #{slotIndex + 1} {isSelected ? "· AKTIF" : ""}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: style.bg,
        color: style.text,
      }}
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-[4.5cqw] select-none"
    >
      {/* Background decorative pattern */}
      {style.pattern === "dots" && (
        <div
          aria-hidden
          style={{
            backgroundImage: `radial-gradient(${style.borderColor} 0.35cqw, transparent 0.35cqw)`,
            backgroundSize: "3.2cqw 3.2cqw",
            opacity: 0.14,
          }}
          className="pointer-events-none absolute inset-0"
        />
      )}
      {style.pattern === "grid" && (
        <div
          aria-hidden
          style={{
            backgroundImage: `linear-gradient(to right, ${style.borderColor} 1px, transparent 1px), linear-gradient(to bottom, ${style.borderColor} 1px, transparent 1px)`,
            backgroundSize: "4.5cqw 4.5cqw",
            opacity: 0.1,
          }}
          className="pointer-events-none absolute inset-0"
        />
      )}
      {style.pattern === "scanlines" && (
        <div
          aria-hidden
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 0.7cqw, ${style.borderColor} 0.7cqw, ${style.borderColor} 0.9cqw)`,
            opacity: 0.12,
          }}
          className="pointer-events-none absolute inset-0"
        />
      )}

      {/* Inner Frame Card */}
      <div
        style={{
          backgroundColor: style.cardBg,
          borderColor: style.borderColor,
          borderWidth: borderWidthCss,
          borderStyle: borderStyleCss,
          boxShadow: cardShadowCss,
        }}
        className="relative z-10 flex h-full w-full flex-col justify-between p-[3.8cqw]"
      >
        {/* Top Header Bar */}
        <div
          style={{ borderColor: style.borderColor }}
          className="flex items-center justify-between border-b pb-[1.8cqw] font-mono text-[2.2cqw] font-bold uppercase tracking-widest"
        >
          <span className="truncate pr-[2cqw]">{style.headerTag}</span>
          <span
            style={{
              backgroundColor: style.accent,
              color: style.accentText,
            }}
            className="shrink-0 px-[1.6cqw] py-[0.35cqw] text-[2cqw]"
          >
            {dateLabel}
          </span>
        </div>

        {/* Main Photo Slots Area */}
        <div className="my-auto flex w-full flex-1 flex-col justify-center py-[2.2cqw]">
          {layout === "strip-4" && (
            <div className="grid h-full grid-rows-4 gap-[1.8cqw]">
              {Array.from({ length: slots }).map((_, idx) => renderSlot(idx, "h-full w-full"))}
            </div>
          )}

          {layout === "strip-3" && (
            <div className="grid h-full grid-rows-3 gap-[2.2cqw]">
              {Array.from({ length: slots }).map((_, idx) => renderSlot(idx, "h-full w-full"))}
            </div>
          )}

          {layout === "duo-2" && (
            <div className="grid h-full grid-rows-2 gap-[2.5cqw]">
              {Array.from({ length: slots }).map((_, idx) => renderSlot(idx, "h-full w-full"))}
            </div>
          )}

          {layout === "grid-2x2" && (
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-[2.2cqw]">
              {Array.from({ length: slots }).map((_, idx) => renderSlot(idx, "h-full w-full"))}
            </div>
          )}

          {layout === "polaroid-1" && (
            <div className="flex h-full flex-col justify-between gap-[2.4cqw]">
              <div className="min-h-0 flex-1">{renderSlot(0, "h-full w-full")}</div>
              <div
                style={{
                  borderColor: style.borderColor,
                  backgroundColor: style.bg,
                }}
                className="flex items-center justify-between border p-[2.2cqw]"
              >
                <span className="font-mono text-[2.1cqw] font-bold uppercase tracking-wider">
                  CETAK EDISI #01
                </span>
                <span
                  style={{ color: style.mutedText }}
                  className="font-mono text-[2cqw] uppercase"
                >
                  FILTER: {activeFilter.shortLabel}
                </span>
              </div>
            </div>
          )}

          {layout === "receipt-photo" && (
            <div className="flex h-full flex-col justify-between gap-[2cqw]">
              <div className="grid min-h-0 flex-1 grid-rows-2 gap-[1.8cqw]">
                {Array.from({ length: slots }).map((_, idx) => renderSlot(idx, "h-full w-full"))}
              </div>

              <div
                style={{ borderColor: style.borderColor }}
                className="border-t border-b border-dashed py-[1.6cqw] font-mono text-[2.05cqw]"
              >
                <div
                  style={{ color: style.mutedText }}
                  className="mb-[0.8cqw] flex justify-between font-bold uppercase"
                >
                  <span>ITEM MEMORI</span>
                  <span>QTY // STATUS</span>
                </div>
                {(template.receiptItems ?? [
                  { label: "MOMEN TERBAIK", qty: "1X", price: "LUNAS" },
                  { label: "CERITA HARI INI", qty: "1X", price: "ABADI" },
                ]).map((item, idx) => (
                  <div key={idx} className="flex justify-between leading-snug">
                    <span>{item.label}</span>
                    <span className="font-bold">
                      {item.qty} · {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Caption & Brand Watermark Footer */}
        <div
          style={{ borderColor: style.borderColor }}
          className="border-t pt-[2cqw]"
        >
          <div className="flex items-end justify-between gap-[2cqw]">
            <div className="min-w-0 flex-1">
              <div
                className={`${fontClass} truncate text-[4.8cqw] leading-[0.95] font-bold uppercase`}
              >
                {displayCaption}
              </div>
              <div
                style={{ color: style.mutedText }}
                className="mt-[0.7cqw] truncate font-mono text-[2.1cqw] font-bold uppercase tracking-wider"
              >
                {displaySubcaption}
              </div>
            </div>

            {/* Mini Barcode / Stamp block */}
            <div
              style={{
                borderColor: style.borderColor,
                backgroundColor: style.accent,
                color: style.accentText,
              }}
              className="shrink-0 border px-[1.8cqw] py-[0.9cqw] font-mono text-[1.9cqw] font-bold uppercase tracking-widest"
            >
              KILASARA
            </div>
          </div>

          <div
            style={{ color: style.mutedText }}
            className="mt-[1.4cqw] flex items-center justify-between font-mono text-[1.8cqw] uppercase tracking-widest"
          >
            <span>{style.footerStamp}</span>
            <span>● KILASARA.ID</span>
          </div>
        </div>
      </div>
    </div>
  );
}
