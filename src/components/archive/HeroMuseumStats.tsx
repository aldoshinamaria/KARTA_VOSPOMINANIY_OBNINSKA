import { motion } from 'framer-motion';
import { ARCHIVE_STATS } from '@/constants/hero';

export default function HeroMuseumStats() {
  return (
    <ul className="hero-stats">
      {ARCHIVE_STATS.map((stat, i) => (
        <motion.li
          key={stat.label}
          className="hero-stat"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.07, duration: 0.45 }}
        >
          <span className="hero-stat__icon" aria-hidden>
            {stat.icon}
          </span>
          <span className="hero-stat__value">{stat.value}</span>
          <span className="hero-stat__label">{stat.label}</span>
        </motion.li>
      ))}
    </ul>
  );
}
