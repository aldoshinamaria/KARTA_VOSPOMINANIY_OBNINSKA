import type { Memory, MuseumExhibitMeta } from '@/types';

const ARCHIVE_DATE = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatExhibitInventory(seed: number): string {
  return String(seed).padStart(6, '0');
}

export function buildMuseumMeta(memory: Memory, inventorySeed: number): MuseumExhibitMeta {
  const placeTitle = memory.place?.title ?? 'Обнинск';
  const archivedAt = ARCHIVE_DATE.format(new Date(memory.created_at));

  const historicalValue: string[] = [
    `Фиксирует повседневную жизнь у «${placeTitle}» в ${memory.year} году.`,
    `Передано в архив от ${memory.name} — личное свидетельство жителя.`,
    `Категория «${memory.category}» — фрагмент коллективной памяти города.`,
  ];

  if (memory.category === 'Исчезнувший Обнинск') {
    historicalValue.push(
      'Сохраняет память об утраченном городском пространстве для будущих поколений.',
    );
  } else {
    historicalValue.push(
      'Дополняет устную хронику Обнинска материалами народного архива.',
    );
  }

  return {
    inventoryNumber: formatExhibitInventory(inventorySeed),
    period: `${memory.year} г.`,
    archivedAt,
    historicalValue: historicalValue.slice(0, 4),
  };
}
