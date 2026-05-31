import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchApprovedPlaces } from '@/api/places';
import { seedPlaces } from '@/data/seedPlaces';
import type { Place } from '@/types';

interface ExhibitRelatedProps {
  relatedIds: string[];
}

export default function ExhibitRelated({ relatedIds }: ExhibitRelatedProps) {
  const [related, setRelated] = useState<Place[]>([]);

  useEffect(() => {
    fetchApprovedPlaces()
      .then((all) => {
        const map = new Map(all.map((p) => [p.id, p]));
        setRelated(
          relatedIds
            .map((id) => map.get(id))
            .filter((p): p is Place => Boolean(p)),
        );
      })
      .catch(() => {
        setRelated(
          relatedIds
            .map((id) => seedPlaces.find((p) => p.id === id))
            .filter((p): p is (typeof seedPlaces)[0] => Boolean(p))
            .map((p) => ({
              ...p,
              status: 'approved' as const,
              created_at: '',
            })),
        );
      });
  }, [relatedIds]);

  if (related.length === 0) return null;

  return (
    <section className="exhibit-section bg-museum-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <p className="exhibit-eyebrow">Путешествие по архиву</p>
        <h2 className="exhibit-title">Связанные места</h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to={`/place/${p.id}`}
                className="group block overflow-hidden rounded-xl border border-museum-copper/12 bg-museum-cream transition hover:border-museum-copper/30 hover:shadow-lg"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-museum-warm to-museum-copper/20" />
                <div className="p-4">
                  <h3 className="font-display text-lg text-museum-ink group-hover:text-museum-copper">
                    {p.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-museum-ink/55">
                    {p.description}
                  </p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
