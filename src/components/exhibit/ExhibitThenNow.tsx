import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { MemoryObjectExhibit } from '@/types/exhibit';

interface ExhibitThenNowProps {
  thenNow: MemoryObjectExhibit['thenNow'];
  title: string;
}

export default function ExhibitThenNow({ thenNow, title }: ExhibitThenNowProps) {
  const [position, setPosition] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setPosition((x / rect.width) * 100);
  }, []);

  return (
    <section className="exhibit-section bg-museum-paper py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <p className="exhibit-eyebrow">Реконструкция</p>
        <h2 className="exhibit-title">Тогда и сейчас</h2>
        <p className="mt-3 max-w-2xl text-museum-ink/60">
          {thenNow.caption ?? `Сравнение: ${title}`}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="exhibit-thennow mt-12"
        >
          <div
            ref={ref}
            className="exhibit-thennow__frame relative aspect-[16/9] w-full cursor-ew-resize select-none touch-none overflow-hidden rounded-sm shadow-2xl"
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
              src={thenNow.after}
              alt={`${title} — сейчас`}
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${position}%` }}
            >
              <img
                src={thenNow.before}
                alt={`${title} — тогда`}
                className="h-full max-w-none object-cover"
                style={{ width: ref.current?.offsetWidth ?? '100%' }}
                draggable={false}
              />
            </div>

            <div
              className="exhibit-thennow__handle absolute bottom-0 top-0 z-20 w-0.5"
              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-museum-copper font-display text-lg text-white shadow-2xl">
                ⇔
              </div>
            </div>

            <span className="absolute left-6 top-6 rounded bg-museum-ink/80 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-museum-cream">
              Тогда
            </span>
            <span className="absolute right-6 top-6 rounded bg-museum-sage/90 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-museum-cream">
              Сейчас
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
