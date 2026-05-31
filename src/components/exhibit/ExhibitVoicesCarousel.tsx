import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExhibitVoice } from '@/types/exhibit';

interface ExhibitVoicesCarouselProps {
  voices: ExhibitVoice[];
}

export default function ExhibitVoicesCarousel({ voices }: ExhibitVoicesCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % voices.length);
    }, 5000);
    return () => clearInterval(t);
  }, [voices.length]);

  const current = voices[index];

  return (
    <section className="exhibit-section bg-museum-ink py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="exhibit-eyebrow text-museum-amber">Голоса города</p>
        <h2 className="exhibit-title text-museum-cream">Жители говорят</h2>

        <div className="relative mt-14 min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45 }}
              className="exhibit-voice-card mx-auto max-w-2xl rounded-2xl border border-museum-cream/10 bg-museum-cream/5 px-8 py-12 backdrop-blur-sm"
            >
              <p className="font-hand text-2xl leading-relaxed text-museum-cream sm:text-3xl">
                «{current.quote}»
              </p>
              {current.author && (
                <p className="mt-6 text-sm uppercase tracking-widest text-museum-amber/80">
                  — {current.author}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + voices.length) % voices.length)}
            className="rounded-full border border-museum-cream/20 px-4 py-2 text-sm text-museum-cream/70 hover:border-museum-amber hover:text-museum-amber"
            aria-label="Предыдущая цитата"
          >
            ←
          </button>
          <div className="flex gap-2">
            {voices.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-8 bg-museum-amber' : 'w-2 bg-museum-cream/25'
                }`}
                aria-label={`Цитата ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % voices.length)}
            className="rounded-full border border-museum-cream/20 px-4 py-2 text-sm text-museum-cream/70 hover:border-museum-amber hover:text-museum-amber"
            aria-label="Следующая цитата"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
