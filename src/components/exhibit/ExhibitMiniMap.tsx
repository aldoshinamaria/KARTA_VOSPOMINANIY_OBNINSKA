import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApprovedPlaces } from '@/api/places';
import type { MemoryObjectExhibit } from '@/types/exhibit';
import type { Place } from '@/types';

const MiniMapInner = lazy(() => import('@/components/exhibit/ExhibitMiniMapInner'));

interface ExhibitMiniMapProps {
  exhibit: MemoryObjectExhibit;
}

export default function ExhibitMiniMap({ exhibit }: ExhibitMiniMapProps) {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetchApprovedPlaces().then(setPlaces);
  }, []);

  const nearby = places.filter((p) =>
    exhibit.nearbyPlaceIds.includes(p.id),
  );

  return (
    <section className="exhibit-section border-t border-museum-copper/10 bg-museum-cream py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <p className="exhibit-eyebrow">География памяти</p>
        <h2 className="exhibit-title">Карта объекта</h2>
        <p className="mt-2 text-sm text-museum-ink/60">
          Где находился объект и что рядом в архиве города.
        </p>

        <div className="mt-8 overflow-hidden rounded-sm border border-museum-copper/15 shadow-xl">
          <Suspense
            fallback={
              <div className="flex h-[280px] items-center justify-center bg-museum-warm text-sm text-museum-ink/50">
                Карта…
              </div>
            }
          >
            <MiniMapInner
              center={[exhibit.lat, exhibit.lng]}
              focusId={exhibit.placeId}
              focusTitle={exhibit.title}
              places={nearby.length > 0 ? nearby : places.slice(0, 5)}
            />
          </Suspense>
        </div>

        <Link
          to="/map"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-museum-ink px-6 py-3 text-sm font-medium text-museum-cream transition hover:bg-museum-copper"
        >
          Перейти к карте памяти города
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
