import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPopularPlaces } from '@/api/popularPlaces';
import type { PopularPlace } from '@/types';

interface MapPopularPlacesProps {
  onSelectPlace?: (placeId: string) => void;
}

export default function MapPopularPlaces({ onSelectPlace }: MapPopularPlacesProps) {
  const [places, setPlaces] = useState<PopularPlace[]>([]);

  useEffect(() => {
    fetchPopularPlaces(6).then(setPlaces);
  }, []);

  if (places.length === 0) return null;

  return (
    <aside className="map-popular" aria-labelledby="map-popular-heading">
      <h2 id="map-popular-heading" className="map-popular__title">
        Самые живые точки памяти
      </h2>
      <p className="map-popular__lead">
        Места, где жители чаще всего делятся историями — начните отсюда.
      </p>
      <ol className="map-popular__list">
        {places.map((p, i) => (
          <li key={p.place_id}>
            {onSelectPlace ? (
              <button
                type="button"
                className="map-popular__item"
                onClick={() => onSelectPlace(p.place_id)}
              >
                <span className="map-popular__rank">{i + 1}</span>
                <span className="map-popular__name">{p.place_title}</span>
                <span className="map-popular__meta">
                  {p.memory_count} {storyWord(p.memory_count)}
                </span>
              </button>
            ) : (
              <Link
                to={`/map?place=${p.place_id}`}
                className="map-popular__item"
              >
                <span className="map-popular__rank">{i + 1}</span>
                <span className="map-popular__name">{p.place_title}</span>
                <span className="map-popular__meta">
                  {p.memory_count} {storyWord(p.memory_count)}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}

function storyWord(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m100 >= 11 && m100 <= 14) return 'историй';
  if (m10 === 1) return 'история';
  if (m10 >= 2 && m10 <= 4) return 'истории';
  return 'историй';
}
