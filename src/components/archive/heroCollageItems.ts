import { assetUrl } from '@/utils/assetUrl';

/** Элементы коллажа «рабочий стол архивиста» — позиции и глубина параллакса */
export interface CollageItem {
  id: string;
  src: string;
  alt: string;
  className: string;
  depth: number;
  label?: string;
}

const base = assetUrl('/archive/hero');

export const heroCollageItems: CollageItem[] = [
  {
    id: 'aes',
    src: `${base}/photo-aes.png`,
    alt: 'Первая АЭС',
    className: 'hero-item hero-item--aes',
    depth: 0.35,
    label: '1954',
  },
  {
    id: 'lenin',
    src: `${base}/photo-lenin.png`,
    alt: 'Проспект Ленина',
    className: 'hero-item hero-item--lenin',
    depth: 0.28,
  },
  {
    id: 'school',
    src: `${base}/photo-school.png`,
    alt: 'Школьное фото',
    className: 'hero-item hero-item--school',
    depth: 0.42,
  },
  {
    id: 'map',
    src: `${base}/fragment-map.png`,
    alt: 'Фрагмент карты',
    className: 'hero-item hero-item--map',
    depth: 0.18,
  },
  {
    id: 'postcard',
    src: `${base}/postcard.png`,
    alt: 'Открытка',
    className: 'hero-item hero-item--postcard',
    depth: 0.48,
  },
  {
    id: 'memory',
    src: `${base}/memory-card.png`,
    alt: 'Воспоминание жителя',
    className: 'hero-item hero-item--memory',
    depth: 0.55,
  },
  {
    id: 'newspaper',
    src: `${base}/newspaper.png`,
    alt: 'Газетная вырезка',
    className: 'hero-item hero-item--newspaper',
    depth: 0.22,
  },
  {
    id: 'note',
    src: `${base}/hand-note.png`,
    alt: 'Запись от руки',
    className: 'hero-item hero-item--note',
    depth: 0.62,
  },
  {
    id: 'stamp',
    src: `${base}/stamp.png`,
    alt: 'Штемпель',
    className: 'hero-item hero-item--stamp',
    depth: 0.38,
  },
];
