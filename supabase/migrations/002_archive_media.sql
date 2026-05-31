-- Этап: «Живая память Обнинска» — медиа, страницы мест, тогда/сейчас

-- Расширение мест
alter table public.places
  add column if not exists cover_image_path text,
  add column if not exists place_story text not null default '';

-- Фото к воспоминаниям
create table if not exists public.memory_photos (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories (id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists memory_photos_memory_id_idx on public.memory_photos (memory_id);

-- Фото места (галерея)
create table if not exists public.place_photos (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  storage_path text not null,
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists place_photos_place_id_idx on public.place_photos (place_id);

-- Тогда и сейчас
create table if not exists public.then_now_pairs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  place_id uuid references public.places (id) on delete set null,
  before_image_path text not null,
  after_image_path text not null,
  year integer check (year is null or (year >= 1950 and year <= 2026)),
  status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists then_now_status_idx on public.then_now_pairs (status);

alter table public.memory_photos enable row level security;
alter table public.place_photos enable row level security;
alter table public.then_now_pairs enable row level security;

-- Публичное чтение фото одобренных воспоминаний
create policy "memory_photos_select_approved"
  on public.memory_photos for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.memories m
      where m.id = memory_id and m.status = 'approved'
    )
  );

create policy "memory_photos_insert_pending"
  on public.memory_photos for insert
  to anon, authenticated
  with check (
    exists (
      select 1 from public.memories m
      where m.id = memory_id and m.status = 'pending'
    )
  );

create policy "place_photos_select_approved"
  on public.place_photos for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.places p
      where p.id = place_id and p.status = 'approved'
    )
  );

create policy "then_now_select_approved"
  on public.then_now_pairs for select
  to anon, authenticated
  using (status = 'approved');

-- Storage bucket (выполнить в Dashboard или через API)
-- insert into storage.buckets (id, name, public) values ('memory-photos', 'memory-photos', true);

grant execute on function public.approved_memory_count(uuid) to anon, authenticated;
