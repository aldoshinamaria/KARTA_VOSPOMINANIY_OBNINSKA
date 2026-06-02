import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroArchiveCollage from '@/components/archive/HeroArchiveCollage';
import HeroMuseumStats from '@/components/archive/HeroMuseumStats';
import { SITE_NAME } from '@/constants/site';
import { EXHIBIT_OF_MONTH } from '@/constants/hero';

import '@/styles/hero.css';

export default function HeroSection() {
  return (
    <section className="hero-museum" aria-label="Вход в цифровой музей Обнинска">
      <div className="hero-museum__paper" aria-hidden />
      <div className="hero-museum__vignette" aria-hidden />
      <div className="hero-museum__light" aria-hidden />

      <div className="hero-museum__grid">
        <div className="hero-museum__content">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-semibold uppercase tracking-[0.32em] text-museum-amber/90"
          >
            Народный цифровой архив памяти города
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65 }}
            className="mt-5 font-display text-[2.75rem] font-semibold leading-[1.05] text-museum-cream sm:text-5xl lg:text-[3.25rem]"
          >
            {SITE_NAME}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.6 }}
            className="mt-6 space-y-4 text-[0.95rem] leading-[1.75] text-museum-cream/78 sm:text-base"
          >
            <p>
              История города хранится не только в книгах и архивах. Она живёт в
              воспоминаниях жителей, школьных историях, семейных фотографиях,
              любимых местах и событиях, которые навсегда остались частью
              Обнинска.
            </p>
            <p className="text-museum-cream/55">
              Истории создают сами жители — вы тоже можете добавить свою за
              несколько минут.
            </p>
          </motion.div>

          <HeroMuseumStats />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="hero-actions"
          >
            <Link to="/#story-of-the-day" className="hero-btn-primary">
              Исследовать архив
            </Link>
            <Link
              to={`/place/${EXHIBIT_OF_MONTH.placeId}`}
              className="hero-btn-secondary"
              title={EXHIBIT_OF_MONTH.title}
            >
              <span aria-hidden>✦</span>
              Экспонат месяца
            </Link>
            <Link to="/share" className="hero-btn-primary sm:ml-0">
              Добавить свою историю
            </Link>
          </motion.div>
        </div>

        <div className="hero-museum__visual">
          <HeroArchiveCollage />
        </div>
      </div>
    </section>
  );
}
