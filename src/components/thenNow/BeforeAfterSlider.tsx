import { useCallback, useRef, useState } from 'react';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  title: string;
  description?: string;
  year?: number | null;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  title,
  description,
  year,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const update = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  return (
    <article className="overflow-hidden rounded-3xl border border-museum-copper/12 bg-museum-cream shadow-xl">
      <div
        ref={containerRef}
        className="relative aspect-[16/10] cursor-ew-resize select-none touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          update(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1) return;
          update(e.clientX);
        }}
      >
        <img
          src={afterSrc}
          alt={`${title} — сейчас`}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <img
            src={beforeSrc}
            alt={`${title} — тогда`}
            className="h-full w-full max-w-none object-cover"
            style={{ width: containerRef.current?.offsetWidth ?? '100%' }}
            loading="lazy"
          />
        </div>

        <div
          className="absolute bottom-0 top-0 z-10 w-1 bg-museum-cream shadow-lg"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-museum-cream bg-museum-copper text-xs font-bold text-museum-cream shadow-lg">
            ⇔
          </div>
        </div>

        <span className="absolute left-3 top-3 rounded bg-museum-ink/70 px-2 py-1 text-xs text-museum-cream">
          Тогда
        </span>
        <span className="absolute right-3 top-3 rounded bg-museum-sage/80 px-2 py-1 text-xs text-museum-cream">
          Сейчас
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="font-display text-2xl font-semibold text-museum-ink">{title}</h3>
          {year && (
            <span className="text-sm text-museum-copper/70">{year}</span>
          )}
        </div>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-museum-ink/65">{description}</p>
        )}
      </div>
    </article>
  );
}
