import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { MemoryObjectExhibit } from '@/types/exhibit';

interface ExhibitHeroProps {
  exhibit: MemoryObjectExhibit;
}

export default function ExhibitHero({ exhibit }: ExhibitHeroProps) {
  return (
    <section className="exhibit-hero relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-museum-ink">
      <img
        src={exhibit.heroImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="exhibit-hero__shade absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:pb-24">
        <Link
          to="/"
          className="text-xs uppercase tracking-widest text-museum-cream/50 transition hover:text-museum-amber"
        >
          ← Цифровой музей
        </Link>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-museum-amber"
        >
          Объект памяти · экспонат
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.05] text-museum-cream sm:text-6xl md:text-7xl"
        >
          {exhibit.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 font-display text-2xl text-museum-amber/90 sm:text-3xl"
        >
          {exhibit.yearsActive}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-museum-cream/80 sm:text-xl"
        >
          {exhibit.tagline}
        </motion.p>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-10 flex flex-wrap gap-8 border-t border-museum-cream/15 pt-8 sm:gap-12"
        >
          <Stat value={exhibit.stats.memories} label="воспоминаний" />
          <Stat value={exhibit.stats.photos} label="фотографий" />
          <Stat value={exhibit.stats.contributors} label="жителей поделились" />
        </motion.ul>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        aria-hidden
      >
        <span className="block h-8 w-px bg-museum-cream/40" />
      </motion.div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <li>
      <span className="block font-display text-3xl text-museum-cream sm:text-4xl">
        {value}
      </span>
      <span className="mt-1 block text-xs uppercase tracking-wider text-museum-cream/45">
        {label}
      </span>
    </li>
  );
}
