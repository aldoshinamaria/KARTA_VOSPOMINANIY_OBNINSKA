# Живая память Обнинска

**Народный цифровой архив памяти города** — не карта, а музей историй, который создают жители.

## Концепция

- Главная — эмоциональный вход в архив (истории, исчезнувший город, голоса жителей)
- **Карта памяти** (`/map`) — навигация по местам и историям
- **Тогда и сейчас** (`/then-and-now`) — слайдер сравнения фотографий
- **Поделиться** (`/share`) — история + фото (Supabase Storage)
- **Место** (`/place/:id`) — полная страница точки на карте

План переосмысления: [docs/RESTRUCTURE_PLAN.md](docs/RESTRUCTURE_PLAN.md)

## Стек

React · TypeScript · Vite · Tailwind · Framer Motion · Supabase · React Leaflet (только `/map`)

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Откройте **http://127.0.0.1:5173/**

### Supabase

1. Выполните `supabase/migrations/001_initial_schema.sql`
2. Выполните `supabase/migrations/002_archive_media.sql`
3. Создайте bucket `memory-photos` (public) в Storage
4. Заполните `.env`

## Сборка

```bash
npm run build
```
