import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

/** Кастомные кнопки зума в стиле музея */
export default function MapZoomControls() {
  const map = useMap();

  useEffect(() => {
    const control = new L.Control.Zoom({
      position: 'bottomright',
      zoomInTitle: 'Приблизить',
      zoomOutTitle: 'Отдалить',
    });
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);

  return null;
}
