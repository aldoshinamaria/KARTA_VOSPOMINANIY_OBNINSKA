# Этап 1 — MVP: архитектура

## Цель

Интерактивная карта Обнинска с местами, воспоминаниями жителей и модерацией через `/admin`.

## Слои приложения

```
┌─────────────────────────────────────────────────────────┐
│  UI (React + Tailwind + Framer Motion)                  │
│  HomePage · PlacePanel · MemoryFormModal · AdminPage    │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  API-модули (src/api/places.ts, admin.ts)               │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  Supabase (PostgreSQL + RLS + RPC для админки)          │
└─────────────────────────────────────────────────────────┘
```

## Публичный поток

1. Загрузка одобренных мест (`places.status = approved`).
2. Клик по метке → панель места + счётчик и список одобренных воспоминаний.
3. «Добавить воспоминание» → форма → insert со статусом `pending`.

## Админка

- Вход по паролю (проверка RPC `check_admin_password`).
- Пароль хранится в `admin_config` (меняется в SQL после деплоя).
- Списки и модерация через SECURITY DEFINER RPC (без service role в браузере).

## Файлы этапа 1

| Путь | Назначение |
|------|------------|
| `supabase/migrations/001_initial_schema.sql` | Таблицы, RLS, RPC, seed 20 мест |
| `src/data/seedPlaces.ts` | Локальный fallback без Supabase |
| `src/lib/supabase.ts` | Клиент Supabase |
| `src/api/places.ts` | Публичные запросы |
| `src/api/admin.ts` | Модерация |
| `src/components/map/ObninskMap.tsx` | React Leaflet |
| `src/components/place/PlacePanel.tsx` | Карточка места |
| `src/components/memory/MemoryFormModal.tsx` | Форма воспоминания |
| `src/pages/HomePage.tsx` | Главная |
| `src/pages/AdminPage.tsx` | `/admin` |

## Демо без Supabase

Если `.env` не задан, карта показывает 20 мест из `seedPlaces.ts`; отправка воспоминаний отключена.
