import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ExhibitContributionProps {
  placeId: string;
  placeTitle: string;
}

export default function ExhibitContribution({
  placeId,
  placeTitle,
}: ExhibitContributionProps) {
  return (
    <section className="exhibit-contribution relative overflow-hidden py-24 sm:py-32">
      <div className="exhibit-contribution__bg absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[10px] font-semibold uppercase tracking-[0.28em] text-museum-amber"
        >
          Вклад жителей
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-4xl font-semibold text-museum-cream sm:text-5xl"
        >
          Помогите сохранить память города
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-museum-cream/75"
        >
          Ваше воспоминание о «{placeTitle}» станет частью цифрового музея Обнинска
          для будущих поколений.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <Link
            to={`/share?place=${placeId}`}
            className="inline-flex rounded-full bg-museum-amber px-10 py-4 text-sm font-semibold text-museum-ink shadow-xl shadow-museum-amber/20 transition hover:bg-museum-gold"
          >
            Добавить своё воспоминание
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
