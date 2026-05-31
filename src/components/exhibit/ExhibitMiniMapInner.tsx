import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MAP_TILE_URL, MAP_ATTRIBUTION } from '@/constants/map';
import type { Place } from '@/types';

interface ExhibitMiniMapInnerProps {
  center: [number, number];
  focusId: string;
  focusTitle: string;
  places: Place[];
}

export default function ExhibitMiniMapInner({
  center,
  focusId,
  focusTitle,
  places,
}: ExhibitMiniMapInnerProps) {
  useEffect(() => {
    import('@/utils/leafletIcons').then((m) => m.fixLeafletDefaultIcons());
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={14}
      className="exhibit-minimap h-[280px] w-full"
      scrollWheelZoom={false}
      zoomControl
    >
      <TileLayer url={MAP_TILE_URL} attribution={MAP_ATTRIBUTION} />
      <Marker position={center} zIndexOffset={1000}>
        <Popup>
          <strong>{focusTitle}</strong>
          <span className="mt-1 block text-xs opacity-70">Объект памяти</span>
        </Popup>
      </Marker>
      {places
        .filter((p) => p.id !== focusId)
        .map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} opacity={p.id === focusId ? 1 : 0.7}>
          <Popup>
            <span className="text-sm font-medium">{p.title}</span>
            {p.id !== focusId && (
              <Link
                to={`/place/${p.id}`}
                className="mt-1 block text-xs text-museum-copper underline"
              >
                Открыть
              </Link>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
