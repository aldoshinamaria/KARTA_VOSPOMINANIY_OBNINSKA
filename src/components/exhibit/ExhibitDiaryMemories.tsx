import { motion } from 'framer-motion';
import type { ExhibitDiaryMemory } from '@/types/exhibit';

interface ExhibitDiaryMemoriesProps {
  memories: ExhibitDiaryMemory[];
}

export default function ExhibitDiaryMemories({ memories }: ExhibitDiaryMemoriesProps) {
  return (
    <section className="exhibit-section bg-museum-warm/30 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <p className="exhibit-eyebrow">Главный зал</p>
        <h2 className="exhibit-title">Воспоминания жителей</h2>
        <p className="mt-3 text-museum-ink/60">
          Страницы дневников — голоса тех, кто жил рядом с этим местом.
        </p>

        <ul className="mt-14 space-y-16">
          {memories.map((m) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
              className="exhibit-diary"
            >
              <div className="exhibit-diary__paper">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-museum-copper/15 pb-4">
                  <span className="font-hand text-2xl text-museum-copper">{m.author}</span>
                  <span className="font-display text-lg text-museum-ink/45">{m.year}</span>
                </div>

                {m.title && (
                  <h3 className="mt-6 font-display text-2xl text-museum-ink">{m.title}</h3>
                )}

                {m.pullQuote && (
                  <blockquote className="exhibit-diary__quote mt-8">
                    «{m.pullQuote}»
                  </blockquote>
                )}

                <p className="mt-6 whitespace-pre-line font-serif text-lg leading-[1.9] text-museum-ink/85">
                  {m.text}
                </p>

                {m.photo && (
                  <figure className="mt-8 overflow-hidden rounded-sm border border-museum-copper/20 shadow-md">
                    <img
                      src={m.photo}
                      alt=""
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  </figure>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
