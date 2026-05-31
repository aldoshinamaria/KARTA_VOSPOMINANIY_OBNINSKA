import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ObninskMap from '@/components/map/ObninskMap';
import type { Place } from '@/types';

interface ClientMapProps {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: Place) => void;
}

export default function ClientMap(props: ClientMapProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="museum-map-frame flex h-full min-h-[280px] items-center justify-center">
        <motion.p
          className="font-display text-lg text-museum-copper/70"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Открываем карту памяти…
        </motion.p>
      </div>
    );
  }

  return (
    <motion.div
      className="museum-map-frame h-full min-h-[280px] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ObninskMap {...props} />
    </motion.div>
  );
}
