# План переосмысления: «Живая память Обнинска»

## Название проекта

**Рекомендация: «Живая память Обнинска»**

| Критерий | Живая память Обнинска | Народный архив Обнинска |
|----------|----------------------|-------------------------|
| Эмоция, музей | ✓ сильнее | сдержаннее, бюрократичнее |
| «Создают жители» | ✓ «живая» | ✓ «народный» |
| Для школ/музеев | подходит | подходит |
| Запоминаемость | выше | ниже |

«Народный архив» — запасной подзаголовок: *«Народный цифровой архив памяти города»*.

---

## 1. Что сохранить

- Стек: React, TypeScript, Vite, Tailwind, Framer Motion, Supabase
- `supabase/migrations/001_initial_schema.sql` — places, memories, RLS, admin RPC
- `src/data/seedPlaces.ts`, `src/lib/supabase.ts`, `src/api/admin.ts`
- `src/utils/validation.ts`, `src/constants/categories.ts`
- Карта Leaflet — **только** на маршруте `/map` (навигация по историям)
- Админка `/admin` — логика модерации, обновить визуал под архив

## 2. Что переработать

- Главная `/` — эмоциональный лендинг-музей, не карта
- Роутинг, общий layout, навигация, SEO/OG
- API: выборки по категориям, последние истории, место по id
- Форма — страница «Поделиться историей» + фото (Storage)
- БД: фото, обложки мест, пары «тогда/сейчас»

## 3. Что удалить / не развивать

- `HomePage` как экран с картой на весь экран
- `PlacePanel` на главной (панель остаётся только на `/map` или уходит в `/place/:id`)
- Акцент на `MapChrome`/легенде карты как на «главном» UX
- Позиционирование «Карта воспоминаний» в title/H1 на главной

## 4. Повторное использование файлов

| Файл | Роль после |
|------|------------|
| `components/map/*` | `/map` |
| `api/places.ts` | расширить |
| `memory/MemoryFormModal.tsx` | база для `ShareStoryForm` |
| `place/PlacePanel.tsx` | опционально на `/map` или удалить |
| `ErrorBoundary`, `ClientMap` | `/map` |

## 5. Новая структура

```
src/
  layouts/ArchiveLayout.tsx
  pages/
    HomePage.tsx          # лендинг + секции
    MapPage.tsx           # карта памяти
    PlacePage.tsx         # /place/:id
    StoryPage.tsx         # /story/:id
    ShareStoryPage.tsx    # поделиться
    ThenNowPage.tsx       # тогда и сейчас
    AdminPage.tsx
  components/
    archive/              # Hero, StoryCard, ExhibitCard, Section
    layout/               # SiteNav, Footer, PageMeta
    map/                  # без изменений логики
    story/                # форма + фото
    thenNow/              # слайдер
  api/ memories.ts, photos.ts, thenNow.ts, places.ts
  data/ demoMemories.ts, demoThenNow.ts
supabase/migrations/002_archive_media.sql
```

## 6. Маршруты

| URL | Назначение |
|-----|------------|
| `/` | Главная — hero + 4 блока |
| `/map` | Карта памяти |
| `/place/:id` | Страница места |
| `/story/:id` | Полный текст истории |
| `/share` | Поделиться историей |
| `/then-and-now` | Тогда и сейчас |
| `/admin` | Модерация |

## 7. Этапы реализации (текущий коммит)

1. Layout, роутинг, PageMeta (SEO/OG)
2. Главная с секциями + демо-данные
3. `/map`, `/place/:id`, `/story/:id`
4. `/share` с загрузкой фото
5. `/then-and-now` со слайдером
6. SQL 002 + API медиа
7. `npm run build`
