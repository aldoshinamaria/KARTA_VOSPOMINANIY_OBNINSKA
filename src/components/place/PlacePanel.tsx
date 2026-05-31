import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchApprovedMemoriesForPlace,
  fetchApprovedMemoryCount,
} from '@/api/places';
import type { Memory, Place } from '@/types';

interface PlacePanelProps {
  place: Place | null;
  onClose: () => void;
  onAddMemory: () => void;
}

const panelSpring = { type: 'spring' as const, stiffness: 380, damping: 32 };

export default function PlacePanel({
  place,
  onClose,
  onAddMemory,
}: PlacePanelProps) {
  const [memoryCount, setMemoryCount] = useState(0);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!place) {
      setMemoryCount(0);
      setMemories([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      fetchApprovedMemoryCount(place.id),
      fetchApprovedMemoriesForPlace(place.id),
    ])
      .then(([count, list]) => {
        if (!cancelled) {
          setMemoryCount(count);
          setMemories(list);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMemoryCount(0);
          setMemories([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [place?.id]);

  return (
    <AnimatePresence mode="wait">
      {place && (
        <motion.aside
          key={place.id}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={panelSpring}
          className="flex h-full flex-col overflow-hidden border-museum-copper/12 bg-gradient-to-b from-museum-cream to-museum-paper shadow-[-8px_0_32px_rgb(44_36_25/0.06)] sm:border-l"
        >
          <div className="h-1 shrink-0 bg-gradient-to-r from-museum-copper via-museum-gold to-museum-amber" />

          <div className="flex items-start justify-between gap-3 border-b border-museum-copper/10 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-museum-copper/80">
                Место на карте
              </p>
              <h2 className="font-display text-2xl font-semibold text-museum-ink">
                {place.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-museum-ink/70">
                {place.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-full border border-museum-copper/15 p-2 text-museum-ink/50 transition hover:border-museum-amber hover:bg-museum-warm hover:text-museum-ink"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>

          <div className="border-b border-museum-copper/10 px-4 py-4">
            <p className="text-sm text-museum-ink/65">
              {loading ? (
                'Загрузка…'
              ) : (
                <>
                  Воспоминаний:{' '}
                  <span className="font-semibold text-museum-copper">
                    {memoryCount}
                  </span>
                </>
              )}
            </p>
            <motion.button
              type="button"
              onClick={onAddMemory}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-museum-copper to-museum-copper/90 px-4 py-3 text-sm font-medium text-museum-cream shadow-md shadow-museum-copper/25"
            >
              Добавить воспоминание
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="mb-3 font-display text-sm font-semibold text-museum-copper">
              Истории жителей
            </h3>
            {loading && (
              <p className="text-sm text-museum-ink/50">Загрузка историй…</p>
            )}
            {!loading && memories.length === 0 && (
              <p className="text-sm text-museum-ink/50">
                Пока нет опубликованных воспоминаний. Станьте первым!
              </p>
            )}
            <ul className="space-y-3">
              {memories.map((m, i) => (
                <motion.li
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                  className="rounded-xl border border-museum-copper/10 bg-museum-cream/80 p-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-medium text-museum-ink">{m.title}</span>
                    <span className="text-xs text-museum-ink/45">
                      {m.year} · {m.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-museum-copper">{m.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-museum-ink/75">
                    {m.story}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
