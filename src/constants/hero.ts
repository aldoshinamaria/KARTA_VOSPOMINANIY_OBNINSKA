import { SPUTNIK_PLACE_ID } from '@/data/exhibits/sputnik';

/** Публичная статистика архива (демо для музейного hero) */
export const ARCHIVE_STATS = [
  { icon: '📍', value: '147', label: 'мест на карте памяти' },
  { icon: '📖', value: '326', label: 'воспоминаний жителей' },
  { icon: '📷', value: '842', label: 'архивных фотографий' },
  { icon: '🏫', value: '18', label: 'школьных историй' },
  { icon: '⭐', value: '70', label: 'лет истории города' },
] as const;

export const AES_PLACE_ID = 'a1000001-0001-4001-8001-000000000003';

/** Экспонат месяца — ведущая история */
export const EXHIBIT_OF_MONTH = {
  placeId: SPUTNIK_PLACE_ID,
  title: 'Кинотеатр «Спутник»',
  subtitle: 'Экспонат месяца',
};

export const HERO_PLAQUE = {
  number: '№001',
  title: 'Первая АЭС мира',
  year: '1954',
  placeId: AES_PLACE_ID,
};
