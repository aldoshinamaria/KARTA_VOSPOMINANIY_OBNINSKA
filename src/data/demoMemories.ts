import type { Memory, ThenNowPair } from '@/types';
import { assetUrl } from '@/utils/assetUrl';

/** Демо-истории для лендинга без Supabase */
export const demoMemories: Memory[] = [
  {
    id: 'demo-m1',
    place_id: 'a1000001-0001-4001-8001-000000000017',
    name: 'Нина Петровна',
    category: 'Исчезнувший Обнинск',
    year: 1984,
    title: 'Кинотеатр «Спутник» в субботу',
    story:
      'Мы с подругой ходили на «Приключения Электроника» и потом долго стояли у буфета с мороженым в стаканчике. Зал пах карамелью и пылью от ковра. Сейчас этого здания нет — осталась только память и старая открытка, которую я берегу в альбоме.',
    status: 'approved',
    created_at: '2026-01-15T10:00:00Z',
    place: { id: 'a1000001-0001-4001-8001-000000000017', title: 'Кинотеатр «Спутник»' },
  },
  {
    id: 'demo-m2',
    place_id: 'a1000001-0001-4001-8001-000000000008',
    name: 'Андрей К.',
    category: 'Исчезнувший Обнинск',
    year: 1971,
    title: 'Магазин у поворота во двор',
    story:
      'Продавщица знала всех детей по имени и иногда давала леденец «в долг до пятницы». На углу стоял автомат с газировкой. Потом дом снесли, а мы ещё долго искали тот же запах свежей булки по утрам.',
    status: 'approved',
    created_at: '2026-01-10T10:00:00Z',
    place: { id: 'a1000001-0001-4001-8001-000000000008', title: 'Старый город' },
  },
  {
    id: 'demo-m3',
    place_id: 'a1000001-0001-4001-8001-000000000006',
    name: 'Мария С.',
    category: 'Школьные годы',
    year: 1998,
    title: 'Первый звонок в седьмой школе',
    story:
      'Линейка была на солнце, пионерский галстук жал шею, а директор говорил о том, что наш город — город учёных. После уроков мы бегали кататься у пруда. Это было настоящее детство.',
    status: 'approved',
    created_at: '2026-02-01T10:00:00Z',
    place: { id: 'a1000001-0001-4001-8001-000000000006', title: 'МБОУ СОШ №7' },
  },
  {
    id: 'demo-m4',
    place_id: 'a1000001-0001-4001-8001-000000000005',
    name: 'Игорь В.',
    category: 'Детство',
    year: 1965,
    title: 'Каток на городском пруду',
    story:
      'Отец крепил коньки на верёвке, мама несла термос с чаем. Вечером фонари отражались в льду — казалось, что город тихий и добрый. Так я запомнил Обнинск.',
    status: 'approved',
    created_at: '2026-02-05T10:00:00Z',
    place: { id: 'a1000001-0001-4001-8001-000000000005', title: 'Городской парк' },
  },
  {
    id: 'demo-m5',
    place_id: 'a1000001-0001-4001-8001-000000000003',
    name: 'Елена Д.',
    category: 'История города',
    year: 2005,
    title: 'Экскурсия на первую АЭС',
    story:
      'Гид рассказывал не о мощности, а о людях, которые строили станцию. В коридоре висели фотографии первых инженеров. Тогда я поняла, что история города — это история труда и надежды.',
    status: 'approved',
    created_at: '2026-02-08T10:00:00Z',
    place: { id: 'a1000001-0001-4001-8001-000000000003', title: 'Первая АЭС' },
  },
  {
    id: 'demo-m6',
    place_id: 'a1000001-0001-4001-8001-000000000013',
    name: 'Ольга М.',
    category: 'Культура',
    year: 2012,
    title: 'Рождественский концерт в ГДК',
    story:
      'Зал был полный, детский хор пел «Три белых коня», а потом все аплодировали стоя. На улице шёл мягкий снег. Такие вечера и есть душа города.',
    status: 'approved',
    created_at: '2026-02-10T10:00:00Z',
    place: { id: 'a1000001-0001-4001-8001-000000000013', title: 'ГДК' },
  },
];

export const demoThenNow: ThenNowPair[] = [
  {
    id: 'demo-tn1',
    title: 'Площадь Ленина',
    description: 'Главная площадь города: праздники, встречи, городская жизнь.',
    place_id: 'a1000001-0001-4001-8001-000000000015',
    before_image_path: assetUrl('/archive/placeholder-before.svg'),
    after_image_path: assetUrl('/archive/placeholder-after.svg'),
    year: 1980,
    status: 'approved',
    created_at: '2026-01-01T00:00:00Z',
    before_url: assetUrl('/archive/placeholder-before.svg'),
    after_url: assetUrl('/archive/placeholder-after.svg'),
  },
  {
    id: 'demo-tn2',
    title: 'Городской парк у пруда',
    description: 'Место прогулок нескольких поколений обнинцев.',
    place_id: 'a1000001-0001-4001-8001-000000000005',
    before_image_path: assetUrl('/archive/placeholder-before.svg'),
    after_image_path: assetUrl('/archive/placeholder-after.svg'),
    year: 1975,
    status: 'approved',
    created_at: '2026-01-01T00:00:00Z',
    before_url: assetUrl('/archive/placeholder-before.svg'),
    after_url: assetUrl('/archive/placeholder-after.svg'),
  },
];

export function storyExcerpt(text: string, max = 140): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}
