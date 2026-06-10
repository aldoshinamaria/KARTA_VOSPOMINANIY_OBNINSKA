import type { Memory } from '@/types';
import { assetUrl } from '@/utils/assetUrl';

/** Закреплённый демо-экспонат «История дня» */
export const demoStoryOfTheDayMemory: Memory = {
  id: 'demo-m4',
  place_id: 'a1000001-0001-4001-8001-000000000005',
  name: 'Игорь В.',
  category: 'Детство',
  year: 1965,
  title: 'Каток на городском пруду',
  story:
    'Отец крепил коньки на верёвке, мама несла термос с чаем. Вечером фонари отражались в льду — казалось, что город тихий и добрый. Так я запомнил Обнинск. Мы приходили сюда почти каждую зиму, пока лёд держал. Соседские дети учили друг друга тормозить, взрослые стояли у кромки и грелись разговорами. Потом кто-то включал фонарь у пруда — и весь лёд становился золотым.',
  status: 'approved',
  created_at: '2026-02-05T10:00:00Z',
  place: { id: 'a1000001-0001-4001-8001-000000000005', title: 'Городской парк' },
  featured_story: true,
  pull_quote:
    'Вечером фонари отражались в льду — казалось, что город тихий и добрый.',
};

export const DEMO_STORY_IMAGE = assetUrl('/archive/hero/photo-lenin.png');

export const DEMO_ARCHIVE_STATS = {
  todayReads: 127,
  totalViews: 3248,
  archiveCount: 326,
};
