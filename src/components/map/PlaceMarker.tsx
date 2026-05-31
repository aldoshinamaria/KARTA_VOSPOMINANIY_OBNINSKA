import { useMemo } from 'react';
import { Marker } from 'react-leaflet';
import { createMuseumMarkerIcon } from '@/utils/mapMarkers';
import type { Place } from '@/types';

interface PlaceMarkerProps {
  place: Place;
  selected: boolean;
  dimmed: boolean;
  onSelect: (place: Place) => void;
}

export default function PlaceMarker({
  place,
  selected,
  dimmed,
  onSelect,
}: PlaceMarkerProps) {
  const icon = useMemo(
    () => createMuseumMarkerIcon(selected, place.id),
    [selected, place.id],
  );

  return (
    <Marker
      position={[place.lat, place.lng]}
      icon={icon}
      zIndexOffset={selected ? 1200 : dimmed ? 100 : 400}
      opacity={dimmed ? 0.42 : 1}
      eventHandlers={{
        click: () => onSelect(place),
      }}
    />
  );
}
