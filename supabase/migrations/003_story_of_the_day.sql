-- Этап 2: История дня — закреплённый экспонат, цитата, просмотры

alter table public.memories
  add column if not exists featured_story boolean not null default false,
  add column if not exists pull_quote text,
  add column if not exists view_count integer not null default 0;

create index if not exists memories_featured_story_idx
  on public.memories (featured_story)
  where featured_story = true;

-- Демо: закрепить историю «Каток» (при наличии seed по title — опционально)
-- update public.memories set featured_story = true, pull_quote = '«Вечером фонари отражались в льду — казалось, что город тихий и добрый.»' where title like '%Каток%';

create or replace function public.increment_memory_views(memory_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.memories
  set view_count = view_count + 1
  where id = memory_id and status = 'approved';
end;
$$;

grant execute on function public.increment_memory_views(uuid) to anon, authenticated;
