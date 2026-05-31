/** Центр карты — Обнинск */
export const OBNINSK_CENTER: [number, number] = [55.0968, 36.6101];

export const DEFAULT_ZOOM = 13;

export const MOBILE_ZOOM = 12;

/** При выборе места — плавный приближающий зум */
export const SELECTED_PLACE_ZOOM = 15;

/** Тёплые тайлы Carto Voyager (мягче стандартного OSM) */
export const MAP_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

/** Радиус подсветки выбранного места (метры) */
export const SELECTION_RING_RADIUS_M = 140;
