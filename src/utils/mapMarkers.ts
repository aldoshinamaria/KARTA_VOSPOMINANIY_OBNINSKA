import L from 'leaflet';

const PIN_BODY = '#8b5e3c';
const PIN_BODY_SELECTED = '#9c6644';
const PIN_HIGHLIGHT = '#d4a574';
const PIN_CENTER = '#faf6f0';

function markerSvg(selected: boolean): string {
  const body = selected ? PIN_BODY_SELECTED : PIN_BODY;
  const accent = selected ? PIN_HIGHLIGHT : '#c9a86c';
  const scale = selected ? 1.18 : 1;

  return `
    <svg class="museum-marker__svg" viewBox="0 0 36 46" width="${36 * scale}" height="${46 * scale}" aria-hidden="true">
      <defs>
        <filter id="mshadow" x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3d2914" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path filter="url(#mshadow)" fill="${body}" d="M18 1C10.82 1 5 6.82 5 14c0 9.2 13 31 13 31s13-21.8 13-31C31 6.82 25.18 1 18 1z"/>
      <path fill="${accent}" d="M18 4c-6.075 0-11 4.925-11 11 0 7.4 11 26.5 11 26.5S29 22.4 29 15C29 8.925 24.075 4 18 4z" opacity="0.35"/>
      <circle cx="18" cy="14" r="6" fill="${PIN_CENTER}" stroke="${accent}" stroke-width="1.5"/>
      ${selected ? `<circle cx="18" cy="14" r="2.5" fill="${PIN_HIGHLIGHT}"/>` : ''}
    </svg>
  `;
}

export function createMuseumMarkerIcon(
  selected: boolean,
  placeId: string,
): L.DivIcon {
  const w = selected ? 44 : 36;
  const h = selected ? 56 : 46;

  return L.divIcon({
    className: 'museum-marker-leaflet',
    html: `
      <div class="museum-marker ${selected ? 'museum-marker--selected' : ''}" data-place-id="${placeId}">
        ${selected ? '<span class="museum-marker__halo" aria-hidden="true"></span>' : ''}
        ${markerSvg(selected)}
      </div>
    `,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 4],
  });
}
