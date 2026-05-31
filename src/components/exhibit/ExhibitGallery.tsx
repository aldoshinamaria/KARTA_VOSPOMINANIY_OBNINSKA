import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ExhibitGalleryItem } from '@/types/exhibit';

interface ExhibitGalleryProps {
  items: ExhibitGalleryItem[];
}

export default function ExhibitGallery({ items }: ExhibitGalleryProps) {
  const [active, setActive] = useState<ExhibitGalleryItem | null>(null);

  return (
    <section className="exhibit-section bg-[#ebe3d6] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <p className="exhibit-eyebrow">Архив изображений</p>
        <h2 className="exhibit-title">Галерея памяти</h2>

        <div className="exhibit-masonry mt-12">
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActive(item)}
              className={`exhibit-masonry__item group mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm bg-museum-ink text-left shadow-lg transition hover:shadow-2xl ${
                item.tall ? 'exhibit-masonry__item--tall' : item.wide ? 'exhibit-masonry__item--wide' : ''
              }`}
            >
              <img
                src={item.src}
                alt={item.description}
                className="w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="bg-museum-ink/90 px-4 py-3">
                <p className="text-xs text-museum-amber">{item.date}</p>
                <p className="mt-1 text-sm text-museum-cream/80 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-museum-ink/95 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-h-[90vh] max-w-5xl overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={active.src}
                alt={active.description}
                className="max-h-[70vh] w-full object-contain"
              />
              <div className="mt-4 text-center text-museum-cream">
                <p className="font-display text-xl">{active.description}</p>
                <p className="mt-2 text-sm text-museum-cream/60">
                  {active.date} · {active.source}
                </p>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="mt-6 text-sm text-museum-amber underline"
                >
                  Закрыть
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
