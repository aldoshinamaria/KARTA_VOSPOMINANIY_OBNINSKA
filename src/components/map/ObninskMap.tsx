import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import {
  OBNINSK_CENTER,
  DEFAULT_ZOOM,
  MOBILE_ZOOM,
  SELECTED_PLACE_ZOOM,
  MAP_TILE_URL,
  MAP_ATTRIBUTION,
} from '@/constants/map';
import MapChrome from '@/components/map/MapChrome';
import MapZoomControls from '@/components/map/MapZoomControls';
import PlaceMarker from '@/components/map/PlaceMarker';
import SelectionRing from '@/components/map/SelectionRing';
import type { Place } from '@/types';

interface ObninskMapProps {
  places: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: Place) => void;
}

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    const timer = setTimeout(() => map.invalidateSize(), 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [map]);

  return null;
}

function FlyToSelected({
  places,
  selectedPlaceId,
}: {
  places: Place[];
  selectedPlaceId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedPlaceId) return;
    const place = places.find((p) => p.id === selectedPlaceId);
    if (!place) return;

    map.flyTo([place.lat, place.lng], SELECTED_PLACE_ZOOM, {
      duration: 1.15,
      easeLinearity: 0.22,
    });
  }, [map, places, selectedPlaceId]);

  return null;
}

export default function ObninskMap({
  places,
  selectedPlaceId,
  onSelectPlace,
}: ObninskMapProps) {
  const [initialZoom, setInitialZoom] = useState(DEFAULT_ZOOM);

  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId],
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setInitialZoom(mq.matches ? MOBILE_ZOOM : DEFAULT_ZOOM);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div
      className={`museum-map-shell relative h-full w-full ${selectedPlaceId ? 'museum-map-shell--focused' : ''}`}
    >
      <MapChrome
        placeCount={places.length}
        hasSelection={Boolean(selectedPlaceId)}
      />

      <MapContainer
        center={OBNINSK_CENTER}
        zoom={initialZoom}
        className="museum-map leaflet-museum h-full w-full"
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_TILE_URL} />
        <MapResizer />
        <MapZoomControls />
        <FlyToSelected places={places} selectedPlaceId={selectedPlaceId} />

        {selectedPlace && (
          <SelectionRing
            lat={selectedPlace.lat}
            lng={selectedPlace.lng}
          />
        )}

        {places.map((place) => {
          const selected = place.id === selectedPlaceId;
          const dimmed = Boolean(
            selectedPlaceId && selectedPlaceId !== place.id,
          );

          return (
            <PlaceMarker
              key={place.id}
              place={place}
              selected={selected}
              dimmed={dimmed}
              onSelect={onSelectPlace}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
