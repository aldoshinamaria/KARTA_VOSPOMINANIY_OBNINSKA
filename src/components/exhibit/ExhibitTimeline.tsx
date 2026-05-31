import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { ExhibitTimelineEvent } from '@/types/exhibit';

interface ExhibitTimelineProps {
  events: ExhibitTimelineEvent[];
}

export default function ExhibitTimeline({ events }: ExhibitTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.3'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="exhibit-section bg-museum-ink py-20 text-museum-cream sm:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <p className="exhibit-eyebrow text-museum-amber">Хронология</p>
        <h2 className="exhibit-title text-museum-cream">Временная шкала</h2>

        <div className="relative mt-14 pl-8 sm:pl-10">
          <motion.div
            className="absolute bottom-0 left-[3px] top-0 w-0.5 origin-top bg-gradient-to-b from-museum-amber via-museum-amber/50 to-transparent"
            style={{ scaleY: lineScale }}
          />

          <ul className="space-y-14">
            {events.map((event, i) => (
              <motion.li
                key={`${event.year}-${i}`}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative"
              >
                <span className="absolute -left-8 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-museum-amber bg-museum-ink sm:-left-10" />
                <span className="font-display text-4xl text-museum-amber">{event.year}</span>
                <h3 className="mt-1 font-display text-xl text-museum-cream">{event.title}</h3>
                {event.description && (
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-museum-cream/60">
                    {event.description}
                  </p>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
