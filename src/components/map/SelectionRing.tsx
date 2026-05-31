import { Circle } from 'react-leaflet';
import { SELECTION_RING_RADIUS_M } from '@/constants/map';

interface SelectionRingProps {
  lat: number;
  lng: number;
}

/** Пульсирующее кольцо вокруг выбранного места */
export default function SelectionRing({ lat, lng }: SelectionRingProps) {
  return (
    <>
      <Circle
        center={[lat, lng]}
        radius={SELECTION_RING_RADIUS_M}
        className="museum-ring museum-ring--outer"
        pathOptions={{
          color: '#d4a574',
          weight: 2,
          opacity: 0.55,
          fillColor: '#e8c9a0',
          fillOpacity: 0.12,
        }}
      />
      <Circle
        center={[lat, lng]}
        radius={SELECTION_RING_RADIUS_M * 0.55}
        className="museum-ring museum-ring--inner"
        pathOptions={{
          color: '#c9a86c',
          weight: 1.5,
          opacity: 0.7,
          fillColor: '#d4a574',
          fillOpacity: 0.18,
        }}
      />
    </>
  );
}
