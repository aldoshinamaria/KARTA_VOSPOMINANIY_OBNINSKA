-- Этап 1: MVP — схема «Карта воспоминаний Обнинска»

create extension if not exists "pgcrypto";

-- Статусы модерации
create type moderation_status as enum ('pending', 'approved', 'rejected');

-- Места на карте
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  lat numeric(10, 7) not null,
  lng numeric(10, 7) not null,
  status moderation_status not null default 'approved',
  created_at timestamptz not null default now()
);

-- Воспоминания
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  name text not null,
  category text not null,
  year integer not null check (year >= 1950 and year <= 2026),
  title text not null,
  story text not null,
  status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index if not exists memories_place_id_idx on public.memories (place_id);
create index if not exists memories_status_idx on public.memories (status);
create index if not exists places_status_idx on public.places (status);

-- Пароль админки (замените после деплоя)
create table if not exists public.admin_config (
  key text primary key,
  value text not null
);

insert into public.admin_config (key, value)
values ('password', 'obninsk2026')
on conflict (key) do nothing;

alter table public.admin_config enable row level security;

-- Публичное чтение одобренных мест
alter table public.places enable row level security;

create policy "places_select_approved"
  on public.places for select
  to anon, authenticated
  using (status = 'approved');

-- Публичное чтение одобренных воспоминаний
alter table public.memories enable row level security;

create policy "memories_select_approved"
  on public.memories for select
  to anon, authenticated
  using (status = 'approved');

create policy "memories_insert_public"
  on public.memories for insert
  to anon, authenticated
  with check (status = 'pending');

-- Проверка пароля админки (только для RPC)
create or replace function public.check_admin_password(pass text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_config
    where key = 'password' and value = pass
  );
$$;

revoke all on function public.check_admin_password(text) from public;
grant execute on function public.check_admin_password(text) to anon, authenticated;

-- Модерация воспоминаний
create or replace function public.admin_update_memory(
  admin_pass text,
  memory_id uuid,
  new_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.check_admin_password(admin_pass) then
    raise exception 'Неверный пароль администратора';
  end if;

  if new_status not in ('pending', 'approved', 'rejected') then
    raise exception 'Недопустимый статус';
  end if;

  update public.memories
  set status = new_status::moderation_status
  where id = memory_id;
end;
$$;

grant execute on function public.admin_update_memory(text, uuid, text) to anon, authenticated;

create or replace function public.admin_delete_memory(
  admin_pass text,
  memory_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.check_admin_password(admin_pass) then
    raise exception 'Неверный пароль администратора';
  end if;

  delete from public.memories where id = memory_id;
end;
$$;

grant execute on function public.admin_delete_memory(text, uuid) to anon, authenticated;

-- Модерация мест
create or replace function public.admin_update_place(
  admin_pass text,
  place_id uuid,
  new_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.check_admin_password(admin_pass) then
    raise exception 'Неверный пароль администратора';
  end if;

  if new_status not in ('pending', 'approved', 'rejected') then
    raise exception 'Недопустимый статус';
  end if;

  update public.places
  set status = new_status::moderation_status
  where id = place_id;
end;
$$;

grant execute on function public.admin_update_place(text, uuid, text) to anon, authenticated;

create or replace function public.admin_delete_place(
  admin_pass text,
  place_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.check_admin_password(admin_pass) then
    raise exception 'Неверный пароль администратора';
  end if;

  delete from public.places where id = place_id;
end;
$$;

grant execute on function public.admin_delete_place(text, uuid) to anon, authenticated;

-- Список для админки (все статусы)
create or replace function public.admin_list_places(admin_pass text)
returns setof public.places
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.check_admin_password(admin_pass) then
    raise exception 'Неверный пароль администратора';
  end if;

  return query select * from public.places order by created_at desc;
end;
$$;

grant execute on function public.admin_list_places(text) to anon, authenticated;

create or replace function public.admin_list_memories(admin_pass text)
returns setof public.memories
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.check_admin_password(admin_pass) then
    raise exception 'Неверный пароль администратора';
  end if;

  return query select * from public.memories order by created_at desc;
end;
$$;

grant execute on function public.admin_list_memories(text) to anon, authenticated;

-- Подсчёт одобренных воспоминаний по месту (для карточки)
create or replace function public.approved_memory_count(p_place_id uuid)
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint
  from public.memories
  where place_id = p_place_id and status = 'approved';
$$;

grant execute on function public.approved_memory_count(uuid) to anon, authenticated;

-- Стартовые места Обнинска
insert into public.places (id, title, description, lat, lng, status) values
  ('a1000001-0001-4001-8001-000000000001', 'Белкинский парк', 'Один из главных парков Обнинска — прогулки, детские площадки и зелёные аллеи.', 55.1178, 36.5789, 'approved'),
  ('a1000001-0001-4001-8001-000000000002', 'Морозовская дача', 'Историческая усадьба, связанная с культурной памятью города.', 55.1024, 36.6125, 'approved'),
  ('a1000001-0001-4001-8001-000000000003', 'Первая АЭС', 'Первая в мире атомная электростанция — символ научного Обнинска.', 55.0886, 36.5694, 'approved'),
  ('a1000001-0001-4001-8001-000000000004', 'Вечный огонь', 'Мемориал памяти защитникам Отечества в центре города.', 55.0962, 36.6118, 'approved'),
  ('a1000001-0001-4001-8001-000000000005', 'Городской парк', 'Центральный парк отдыха жителей у пруда и аллей.', 55.0945, 36.6082, 'approved'),
  ('a1000001-0001-4001-8001-000000000006', 'МБОУ СОШ №7', 'Школа, у которой выросло не одно поколение обнинцев.', 55.0991, 36.6047, 'approved'),
  ('a1000001-0001-4001-8001-000000000007', 'Дом учёных', 'Культурный центр научного сообщества города.', 55.0975, 36.6105, 'approved'),
  ('a1000001-0001-4001-8001-000000000008', 'Старый город', 'Историческая застройка и улочки первых кварталов Обнинска.', 55.1012, 36.6156, 'approved'),
  ('a1000001-0001-4001-8001-000000000009', 'Заовражье', 'Район у оврага — тихие дворы и близость к природе.', 55.1058, 36.6201, 'approved'),
  ('a1000001-0001-4001-8001-000000000010', 'Сквер Победы', 'Сквер у памятных мест и мемориальных объектов.', 55.0958, 36.6142, 'approved'),
  ('a1000001-0001-4001-8001-000000000011', 'ТРК «Триумф Плаза»', 'Торгово-развлекательный центр — встречи, кино и городская суетa.', 55.1185, 36.6172, 'approved'),
  ('a1000001-0001-4001-8001-000000000012', 'Стадион «Труд»', 'Спортивный комплекс и арена городских соревнований.', 55.0923, 36.6015, 'approved'),
  ('a1000001-0001-4001-8001-000000000013', 'ГДК', 'Городской дворец культуры — концерты, спектакли и праздники.', 55.0988, 36.6098, 'approved'),
  ('a1000001-0001-4001-8001-000000000014', 'Музей истории города', 'Музей, хранящий историю науки и быта Обнинска.', 55.1003, 36.6134, 'approved'),
  ('a1000001-0001-4001-8001-000000000015', 'Площадь Ленина', 'Главная площадь города — митинги, праздники и городская жизнь.', 55.0965, 36.6109, 'approved'),
  ('a1000001-0001-4001-8001-000000000016', 'Обнинский пруд', 'Пруд в центре — катание на лодках, зимой — коньки.', 55.0938, 36.6068, 'approved'),
  ('a1000001-0001-4001-8001-000000000017', 'Кинотеатр «Спутник»', 'Кинотеатр, куда ходили целыми дворами.', 55.0971, 36.6075, 'approved'),
  ('a1000001-0001-4001-8001-000000000018', 'Железнодорожный вокзал', 'Ворота города — встречи, отъезды и первые впечатления.', 55.0912, 36.6248, 'approved'),
  ('a1000001-0001-4001-8001-000000000019', 'Центральная библиотека', 'Библиотека — книги, читальные залы и детские программы.', 55.0998, 36.6121, 'approved'),
  ('a1000001-0001-4001-8001-000000000020', 'Храм Казанской иконы Божией Матери', 'Православный храм — духовный центр для многих семей.', 55.1042, 36.6089, 'approved')
on conflict (id) do nothing;
