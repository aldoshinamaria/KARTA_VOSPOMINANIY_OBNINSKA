import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getExhibitByPlaceId } from '@/data/exhibits';
import MemoryObjectPage from '@/components/exhibit/MemoryObjectPage';
import { fetchPlaceById } from '@/api/places';
import PageMeta from '@/components/layout/PageMeta';
import type { Place } from '@/types';

/**
 * Страница объекта памяти.
 * При наличии музейного экспоната — полная экспозиция (демо: «Спутник»).
 */
export default function PlacePage() {
  const { id } = useParams<{ id: string }>();
  const exhibit = id ? getExhibitByPlaceId(id) : null;
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(!exhibit);

  useEffect(() => {
    if (exhibit || !id) {
      setLoading(false);
      return;
    }
    fetchPlaceById(id)
      .then(setPlace)
      .finally(() => setLoading(false));
  }, [id, exhibit]);

  if (exhibit) {
    return <MemoryObjectPage exhibit={exhibit} />;
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center font-display text-museum-copper/50">
        Открываем экспонат…
      </div>
    );
  }

  if (!place) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="font-display text-2xl text-museum-ink">Объект не найден</p>
        <Link to="/" className="mt-6 inline-block text-museum-copper">
          ← В музей
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={place.title} path={`/place/${place.id}`} />
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-[10px] uppercase tracking-widest text-museum-copper">
          Экспонат готовится
        </p>
        <h1 className="mt-4 font-display text-3xl">{place.title}</h1>
        <p className="mt-4 text-museum-ink/60">
          Полная музейная страница для этого объекта скоро появится в архиве.
        </p>
        <Link
          to={`/share?place=${place.id}`}
          className="mt-8 inline-block rounded-full bg-museum-copper px-6 py-3 text-sm text-museum-cream"
        >
          Добавить воспоминание
        </Link>
        <Link to="/map" className="mt-4 block text-sm text-museum-copper">
          Карта памяти
        </Link>
      </div>
    </>
  );
}
