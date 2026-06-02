-- Вовлечение: реакции, расширение мест, флаги публикации, популярность
-- Таблица memories = stories в продуктовой терминологии

-- Район и категория места
alter table public.places
  add column if not exists district text,
  add column if not exists place_category text;

-- Агрегаты на воспоминании (stories)
alter table public.memories
  add column if not exists likes integer not null default 0,
  add column if not exists show_on_map boolean not null default true,
  add column if not exists published_archive boolean not null default true;

-- Реакции жителей
create table if not exists public.memory_reactions (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories (id) on delete cascade,
  reaction_type text not null check (
    reaction_type in (
      'dear',
      'remember',
      'important',
      'studied',
      'lived_nearby'
    )
  ),
  client_key text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists memory_reactions_memory_id_idx
  on public.memory_reactions (memory_id);

create unique index if not exists memory_reactions_unique_client
  on public.memory_reactions (memory_id, reaction_type, client_key);

alter table public.memory_reactions enable row level security;

create policy "reactions_select_public"
  on public.memory_reactions for select
  to anon, authenticated
  using (true);

create policy "reactions_insert_public"
  on public.memory_reactions for insert
  to anon, authenticated
  with check (true);

-- Счётчики реакций по воспоминанию
create or replace function public.memory_reaction_counts(p_memory_id uuid)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    json_object_agg(reaction_type, cnt),
    '{}'::json
  )
  from (
    select reaction_type, count(*)::int as cnt
    from public.memory_reactions
    where memory_id = p_memory_id
    group by reaction_type
  ) t;
$$;

grant execute on function public.memory_reaction_counts(uuid) to anon, authenticated;

-- Добавить реакцию (один тип — один раз с client_key)
create or replace function public.add_memory_reaction(
  p_memory_id uuid,
  p_reaction_type text,
  p_client_key text default ''
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  result json;
begin
  if p_reaction_type not in (
    'dear', 'remember', 'important', 'studied', 'lived_nearby'
  ) then
    raise exception 'Недопустимый тип реакции';
  end if;

  insert into public.memory_reactions (memory_id, reaction_type, client_key)
  values (p_memory_id, p_reaction_type, coalesce(p_client_key, ''))
  on conflict (memory_id, reaction_type, client_key) do nothing;

  update public.memories
  set likes = (
    select count(*)::int from public.memory_reactions where memory_id = p_memory_id
  )
  where id = p_memory_id and status = 'approved';

  select public.memory_reaction_counts(p_memory_id) into result;
  return result;
end;
$$;

grant execute on function public.add_memory_reaction(uuid, text, text) to anon, authenticated;

-- Популярные места (по числу одобренных воспоминаний)
create or replace function public.popular_places(p_limit int default 8)
returns table (
  place_id uuid,
  place_title text,
  memory_count bigint,
  total_views bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id as place_id,
    p.title as place_title,
    count(m.id)::bigint as memory_count,
    coalesce(sum(m.view_count), 0)::bigint as total_views
  from public.places p
  left join public.memories m
    on m.place_id = p.id
    and m.status = 'approved'
    and m.show_on_map = true
  where p.status = 'approved'
  group by p.id, p.title
  order by memory_count desc, total_views desc
  limit greatest(p_limit, 1);
$$;

grant execute on function public.popular_places(int) to anon, authenticated;

-- Статистика архива для главной
create or replace function public.archive_public_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'places', (select count(*) from public.places where status = 'approved'),
    'memories', (select count(*) from public.memories where status = 'approved'),
    'views', (select coalesce(sum(view_count), 0) from public.memories where status = 'approved'),
    'pending', (select count(*) from public.memories where status = 'pending')
  );
$$;

grant execute on function public.archive_public_stats() to anon, authenticated;

-- Админ: флаги публикации и история дня
create or replace function public.admin_update_memory_flags(
  admin_pass text,
  memory_id uuid,
  p_featured_story boolean default null,
  p_pull_quote text default null,
  p_show_on_map boolean default null,
  p_published_archive boolean default null,
  p_new_status text default null
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

  if p_new_status is not null then
    if p_new_status not in ('pending', 'approved', 'rejected') then
      raise exception 'Недопустимый статус';
    end if;
    update public.memories
    set status = p_new_status::moderation_status
    where id = memory_id;
  end if;

  update public.memories
  set
    featured_story = coalesce(p_featured_story, featured_story),
    pull_quote = coalesce(p_pull_quote, pull_quote),
    show_on_map = coalesce(p_show_on_map, show_on_map),
    published_archive = coalesce(p_published_archive, published_archive)
  where id = memory_id;

  if p_featured_story = true then
    update public.memories
    set featured_story = false
    where id <> memory_id and featured_story = true;
  end if;
end;
$$;

grant execute on function public.admin_update_memory_flags(
  text, uuid, boolean, text, boolean, boolean, text
) to anon, authenticated;
