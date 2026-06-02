import { Link } from 'react-router-dom';
import { MEMORY_ROUTES } from '@/constants/memoryRoutes';

export default function MapMemoryRoutes() {
  return (
    <section className="map-routes" aria-labelledby="map-routes-heading">
      <h2 id="map-routes-heading" className="map-routes__title">
        Прогулки по памяти
      </h2>
      <p className="map-routes__lead">
        Готовые маршруты по старому Обнинску — откройте точки по порядку и
        читайте истории жителей.
      </p>
      <ul className="map-routes__list">
        {MEMORY_ROUTES.map((route) => (
          <li key={route.id} className="map-routes__card">
            <h3 className="map-routes__card-title">{route.title}</h3>
            {route.era && (
              <p className="map-routes__era">{route.era}</p>
            )}
            <p className="map-routes__desc">{route.description}</p>
            <Link
              to={`/map?place=${route.place_ids[0]}`}
              className="map-routes__link"
            >
              Начать маршрут →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
