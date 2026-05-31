import { motion } from 'framer-motion';

interface SectionHeaderProps {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}

export default function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  dark = false,
}: SectionHeaderProps) {
  return (
    <motion.header
      id={id}
      className="mb-8 scroll-mt-24 sm:mb-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${
          dark ? 'text-museum-amber' : 'text-museum-copper'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-2 font-display text-3xl font-semibold sm:text-4xl ${
          dark ? 'text-museum-cream' : 'text-museum-ink'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-3 max-w-2xl text-base leading-relaxed ${
            dark ? 'text-museum-cream/70' : 'text-museum-ink/65'
          }`}
        >
          {description}
        </p>
      )}
    </motion.header>
  );
}
