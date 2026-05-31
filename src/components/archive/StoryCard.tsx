import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { storyExcerpt } from '@/data/demoMemories';
import type { Memory } from '@/types';

interface StoryCardProps {
  memory: Memory;
  variant?: 'default' | 'exhibit';
  index?: number;
}

export default function StoryCard({
  memory,
  variant = 'default',
  index = 0,
}: StoryCardProps) {
  const isExhibit = variant === 'exhibit';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-xl ${
        isExhibit
          ? 'border-museum-amber/25 bg-gradient-to-br from-museum-ink to-[#3d2914] text-museum-cream shadow-lg shadow-museum-ink/20'
          : 'border-museum-copper/12 bg-museum-cream shadow-md shadow-museum-copper/5'
      }`}
    >
      <div
        className={`relative h-2 shrink-0 ${
          isExhibit
            ? 'bg-gradient-to-r from-museum-amber via-museum-gold to-museum-copper'
            : 'bg-gradient-to-r from-museum-copper/80 to-museum-amber/60'
        }`}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={
              isExhibit
                ? 'rounded-full bg-museum-amber/20 px-2 py-0.5 text-museum-amber'
                : 'rounded-full bg-museum-warm px-2 py-0.5 text-museum-copper'
            }
          >
            {memory.year}
          </span>
          <span className={isExhibit ? 'text-museum-cream/50' : 'text-museum-ink/45'}>
            {memory.category}
          </span>
        </div>

        <h3
          className={`mt-3 font-display text-xl font-semibold leading-snug ${
            isExhibit ? 'text-museum-cream' : 'text-museum-ink'
          }`}
        >
          {memory.title}
        </h3>

        <p className={`mt-2 text-sm ${isExhibit ? 'text-museum-cream/55' : 'text-museum-ink/50'}`}>
          {memory.name}
          {memory.place?.title && (
            <>
              {' '}
              · <span className="italic">{memory.place.title}</span>
            </>
          )}
        </p>

        <p
          className={`mt-4 flex-1 text-sm leading-relaxed ${
            isExhibit ? 'text-museum-cream/75' : 'text-museum-ink/70'
          }`}
        >
          {storyExcerpt(memory.story, isExhibit ? 120 : 140)}
        </p>

        <Link
          to={`/story/${memory.id}`}
          className={`mt-5 inline-flex items-center gap-1 text-sm font-medium transition ${
            isExhibit
              ? 'text-museum-amber hover:gap-2'
              : 'text-museum-copper hover:gap-2'
          }`}
        >
          Читать полностью
          <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.article>
  );
}
