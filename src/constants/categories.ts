import type { MemoryCategory } from '@/types';

export const MEMORY_CATEGORIES: MemoryCategory[] = [
  'Детство',
  'Школьные годы',
  'Семья',
  'Любимое место',
  'История города',
  'Работа',
  'Культура',
  'Спорт',
  'Исчезнувший Обнинск',
];

export const FORM_LIMITS = {
  nameMax: 50,
  titleMax: 80,
  storyMax: 1000,
  yearMin: 1950,
  yearMax: 2026,
} as const;
