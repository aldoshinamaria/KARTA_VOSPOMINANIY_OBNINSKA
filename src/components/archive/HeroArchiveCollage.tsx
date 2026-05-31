import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { heroCollageItems } from '@/components/archive/heroCollageItems';
import { HERO_PLAQUE } from '@/constants/hero';

export default function HeroArchiveCollage() {
  const deskRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 22, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 22, mass: 0.8 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = deskRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={deskRef}
      className="hero-museum__desk"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-hidden={false}
      role="img"
      aria-label="Коллаж архивных фотографий и документов Обнинска"
    >
      <div className="hero-museum__desk-shadow" aria-hidden />

      {heroCollageItems.map((item, i) => (
        <CollagePiece
          key={item.id}
          item={item}
          index={i}
          springX={springX}
          springY={springY}
        />
      ))}

      <Link to={`/place/${HERO_PLAQUE.placeId}`} className="hero-plaque">
        <p className="hero-plaque__eyebrow">Экспонат {HERO_PLAQUE.number}</p>
        <p className="hero-plaque__title">{HERO_PLAQUE.title}</p>
        <p className="hero-plaque__year">{HERO_PLAQUE.year}</p>
      </Link>
    </div>
  );
}

function CollagePiece({
  item,
  index,
  springX,
  springY,
}: {
  item: (typeof heroCollageItems)[0];
  index: number;
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const moveX = useTransform(springX, [-0.5, 0.5], [-18 * item.depth, 18 * item.depth]);
  const moveY = useTransform(springY, [-0.5, 0.5], [-14 * item.depth, 14 * item.depth]);

  return (
    <motion.div
      className={item.className}
      style={{ x: moveX, y: moveY }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 + index * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <img src={item.src} alt={item.alt} draggable={false} loading="eager" />
      {item.label && <span className="hero-item__date">{item.label}</span>}
    </motion.div>
  );
}
