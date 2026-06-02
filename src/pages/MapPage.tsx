import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchApprovedPlaces } from '@/api/places';
import PageMeta from '@/components/layout/PageMeta';
import MapMemoryRoutes from '@/components/map/MapMemoryRoutes';
import MapPopularPlaces from '@/components/map/MapPopularPlaces';
import PlacePanel from '@/components/place/PlacePanel';
import type { Place } from '@/types';

const ClientMap = lazy(() => import('@/components/map/ClientMap'));

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const highlightPlaceId = searchParams.get('place');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    try {
      setPlaces(await fetchApprovedPlaces());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  useEffect(() => {
    if (!highlightPlaceId || places.length === 0) return;
    const place = places.find((p) => p.id === highlightPlaceId);
    if (place) setSelectedPlace(place);
  }, [highlightPlaceId, places]);

  return (
    <>
      <PageMeta
        title="Карта памяти"
        description="Найдите место на карте Обнинска и прочитайте истории жителей."
        path="/map"
      />

      <div className="border-b border-museum-copper/10 bg-museum-cream/80 px-4 py-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-museum-copper">
            Навигация по архиву
          </p>
          <h1 className="font-display text-3xl font-semibold text-museum-ink">
            Карта памяти
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-museum-ink/65">
            Выберите точку — читайте истории, ставьте реакции, добавляйте своё
            воспоминание. Следующая история — в один клик.
          </p>
          <Link
            to="/share"
            className="mt-4 inline-block rounded-full bg-museum-copper px-5 py-2 text-xs font-semibold uppercase tracking-wide text-museum-cream"
          >
            Добавить историю к месту
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl min-h-[calc(100dvh-12rem)] flex-col gap-0 lg:min-h-[70vh] lg:flex-row">
        <aside className="hidden shrink-0 overflow-y-auto border-r border-museum-copper/10 bg-museum-cream/50 px-4 py-6 lg:block lg:w-64">
          <MapPopularPlaces
            onSelectPlace={(id) => {
              const place = places.find((p) => p.id === id);
              if (place) setSelectedPlace(place);
            }}
          />
          <MapMemoryRoutes />
        </aside>

        <div className="flex min-h-[50vh] flex-1 flex-col lg:min-h-0 lg:flex-row">
        <div
          className={`relative min-h-[50vh] flex-1 lg:min-h-0 ${
            selectedPlace ? 'lg:flex-[1.5]' : ''
          }`}
        >
          {loading ? (
            <div className="flex h-full min-h-[320px] items-center justify-center">
              <p className="font-display text-museum-copper/60">Загрузка карты…</p>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex h-full min-h-[320px] items-center justify-center bg-museum-warm">
                  Открываем карту…
                </div>
              }
            >
              <ClientMap
                places={places}
                selectedPlaceId={selectedPlace?.id ?? null}
                onSelectPlace={setSelectedPlace}
              />
            </Suspense>
          )}

          {selectedPlace && (
            <Link
              to={`/place/${selectedPlace.id}`}
              className="absolute bottom-4 left-4 z-20 rounded-full bg-museum-cream/95 px-4 py-2 text-xs font-medium text-museum-copper shadow-lg backdrop-blur-sm"
            >
              Страница места →
            </Link>
          )}
        </div>

        <AnimatePresence>
          {selectedPlace && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="flex min-h-[40vh] flex-1 flex-col border-t border-museum-copper/10 lg:max-w-md lg:border-l lg:border-t-0"
            >
              <PlacePanel
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
                onAddMemory={() => {
                  window.location.href = `/share?place=${selectedPlace.id}`;
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </div>

        <div className="border-t border-museum-copper/10 px-4 py-6 lg:hidden">
          <MapPopularPlaces
            onSelectPlace={(id) => {
              const place = places.find((p) => p.id === id);
              if (place) setSelectedPlace(place);
            }}
          />
        </div>
      </div>
    </>
  );
}
