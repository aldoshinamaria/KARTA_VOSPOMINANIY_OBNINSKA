import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MapTeaser() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl border border-museum-copper/15 bg-gradient-to-br from-museum-warm via-museum-cream to-museum-paper p-8 sm:p-12"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-museum-amber/20 blur-3xl"
        aria-hidden
      />
      <div className="relative max-w-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-museum-copper">
          Навигация по историям
        </p>
        <h3 className="mt-2 font-display text-3xl font-semibold text-museum-ink">
          Карта памяти
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-museum-ink/65 sm:text-base">
          Карта помогает найти место и прочитать все истории, связанные с ним: фото,
          описание и воспоминания жителей. Это не главный экран — это путь к архиву.
        </p>
        <Link
          to="/map"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-museum-copper px-6 py-3 text-sm font-medium text-museum-cream transition hover:bg-museum-copper/90"
        >
          Открыть карту памяти
          <span aria-hidden>→</span>
        </Link>
      </div>
      <div
        className="mt-8 h-40 rounded-2xl border border-museum-copper/10 bg-[url('/archive/map-teaser-pattern.svg')] bg-cover bg-center opacity-90 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0 sm:h-44 sm:w-72"
        aria-hidden
      />
    </motion.div>
  );
}
