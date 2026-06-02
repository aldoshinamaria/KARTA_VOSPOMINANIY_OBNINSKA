import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchArchivePublicStats } from '@/api/archiveStats';
import type { ArchivePublicStats } from '@/types';

export default function HeroMuseumStats() {
  const [stats, setStats] = useState<ArchivePublicStats | null>(null);

  useEffect(() => {
    fetchArchivePublicStats().then(setStats);
  }, []);

  const items = [
    { icon: '📍', value: stats?.places ?? 20, label: 'мест на карте' },
    { icon: '📖', value: stats?.memories ?? 0, label: 'воспоминаний' },
    { icon: '🎯', value: stats?.goal ?? 500, label: 'цель архива' },
  ];

  return (
    <ul className="hero-stats">
      {items.map((stat, i) => (
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
