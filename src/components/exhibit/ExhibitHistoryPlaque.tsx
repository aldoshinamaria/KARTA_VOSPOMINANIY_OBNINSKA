import { motion } from 'framer-motion';
import type { MemoryObjectExhibit } from '@/types/exhibit';

interface ExhibitHistoryPlaqueProps {
  history: MemoryObjectExhibit['history'];
}

export default function ExhibitHistoryPlaque({ history }: ExhibitHistoryPlaqueProps) {
  return (
    <section className="exhibit-section bg-museum-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <p className="exhibit-eyebrow">Экспозиция</p>
        <h2 className="exhibit-title">История места</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="exhibit-plaque mt-12"
        >
          <div className="exhibit-plaque__frame">
            <p className="font-display text-xl leading-relaxed text-museum-ink sm:text-2xl">
              {history.lead}
            </p>

            <div className="mt-10 space-y-6 border-t border-museum-copper/15 pt-10">
              {history.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-[1.85] text-museum-ink/78 sm:text-lg">
                  {p}
                </p>
              ))}
            </div>

            <aside className="mt-12 rounded-xl bg-museum-warm/60 p-6 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-museum-copper">
                Из архивной справки
              </p>
              <ul className="mt-4 space-y-3">
                {history.facts.map((fact, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm leading-relaxed text-museum-ink/75 sm:text-base"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-museum-copper" />
                    {fact}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
