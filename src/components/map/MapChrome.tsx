import { motion } from 'framer-motion';

interface MapChromeProps {
  placeCount: number;
  hasSelection: boolean;
}

export default function MapChrome({ placeCount, hasSelection }: MapChromeProps) {
  return (
    <>
      <div className="museum-map-vignette pointer-events-none" aria-hidden />
      <div className="museum-map-warmth pointer-events-none" aria-hidden />

      <motion.div
        className="museum-map-legend pointer-events-none"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <span className="museum-map-legend__dot" aria-hidden />
        <div>
          <p className="museum-map-legend__title">Город памяти</p>
          <p className="museum-map-legend__sub">
            {placeCount} {pluralPlaces(placeCount)}
            {hasSelection ? ' · место выбрано' : ' · выберите метку'}
          </p>
        </div>
      </motion.div>
    </>
  );
}

function pluralPlaces(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return 'мест';
  if (mod10 === 1) return 'место';
  if (mod10 >= 2 && mod10 <= 4) return 'места';
  return 'мест';
}
