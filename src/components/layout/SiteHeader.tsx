import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SiteHeaderProps {
  compact?: boolean;
}

export default function SiteHeader({ compact = false }: SiteHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto z-20 ${
        compact
          ? 'absolute left-0 right-0 top-0'
          : 'border-b border-museum-copper/10 bg-museum-paper/95 backdrop-blur'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 ${
          compact ? 'py-3' : 'py-4'
        }`}
      >
        <div
          className={
            compact
              ? 'rounded-2xl border border-museum-copper/10 bg-museum-cream/90 px-4 py-2 shadow-lg shadow-museum-copper/10 backdrop-blur-md'
              : ''
          }
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-museum-copper">
            Обнинск · цифровой музей
          </p>
          <h1
            className={`font-display font-semibold text-museum-ink ${
              compact ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            Карта воспоминаний
          </h1>
        </div>
        <Link
          to="/admin"
          className={`shrink-0 rounded-full border border-museum-copper/20 px-3 py-1.5 text-xs text-museum-ink/70 transition hover:border-museum-amber hover:bg-museum-warm/50 hover:text-museum-copper ${
            compact ? 'bg-museum-cream/90 shadow-md backdrop-blur-md' : ''
          }`}
        >
          Админка
        </Link>
      </div>
    </motion.header>
  );
}
