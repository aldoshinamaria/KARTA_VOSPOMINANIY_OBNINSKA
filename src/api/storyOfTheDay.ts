import {
  demoStoryOfTheDayMemory,
  DEMO_ARCHIVE_STATS,
  DEMO_STORY_IMAGE,
} from '@/data/demoStoryOfTheDay';
import { demoMemories, storyExcerpt } from '@/data/demoMemories';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getPublicStorageUrl } from '@/utils/storageUrl';
import { buildMuseumMeta } from '@/utils/museumExhibit';
import type { Memory, StoryOfTheDayPayload } from '@/types';

function mapMemory(row: Record<string, unknown>): Memory {
  const placeRaw = row.place as Record<string, unknown> | null | undefined;
  return {
    id: String(row.id),
    place_id: String(row.place_id),
    name: String(row.name),
    category: row.category as Memory['category'],
    year: Number(row.year),
    title: String(row.title),
    story: String(row.story),
    status: row.status as Memory['status'],
    created_at: String(row.created_at),
    featured_story: Boolean(row.featured_story),
    pull_quote: row.pull_quote ? String(row.pull_quote) : null,
    view_count: row.view_count != null ? Number(row.view_count) : 0,
    place: placeRaw
      ? { id: String(placeRaw.id), title: String(placeRaw.title) }
      : null,
  };
}

function buildPullQuote(memory: Memory): string {
  if (memory.pull_quote?.trim()) {
    const q = memory.pull_quote.trim();
    return q.startsWith('«') ? q : `«${q}»`;
  }
  const first = memory.story.split(/[.!?]/)[0]?.trim();
  if (first && first.length > 20) {
    return `«${first}…»`;
  }
  return `«${memory.title}»`;
}

async function attachPhoto(memory: Memory): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    return DEMO_STORY_IMAGE;
  }

  const { data: photos } = await supabase
    .from('memory_photos')
    .select('storage_path')
    .eq('memory_id', memory.id)
    .order('sort_order')
    .limit(1);

  const path = photos?.[0]?.storage_path;
  return getPublicStorageUrl(path ? String(path) : null) ?? DEMO_STORY_IMAGE;
}

async function getArchiveCount(): Promise<number> {
  if (!isSupabaseConfigured || !supabase) {
    return DEMO_ARCHIVE_STATS.archiveCount;
  }

  const { count } = await supabase
    .from('memories')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'approved');

  return count ?? DEMO_ARCHIVE_STATS.archiveCount;
}

function getTodayReadsKey(): string {
  return `sod_reads_${new Date().toISOString().slice(0, 10)}`;
}

function bumpTodayReads(): number {
  const key = getTodayReadsKey();
  const prev = parseInt(localStorage.getItem(key) ?? '126', 10);
  const next = prev + 1;
  localStorage.setItem(key, String(next));
  return next;
}

function demoCatalog(): Memory[] {
  const byId = new Map<string, Memory>();
  byId.set(demoStoryOfTheDayMemory.id, demoStoryOfTheDayMemory);
  for (const m of demoMemories) {
    if (m.status === 'approved') byId.set(m.id, m);
  }
  const featured = demoStoryOfTheDayMemory;
  const rest = [...byId.values()].filter((m) => m.id !== featured.id);
  return [featured, ...rest];
}

/** Каталог экспонатов для навигации «предыдущий / следующий» */
export async function fetchExhibitCatalog(): Promise<Memory[]> {
  if (!isSupabaseConfigured || !supabase) {
    return demoCatalog();
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*, place:places(id, title)')
    .eq('status', 'approved')
    .order('featured_story', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(48);

  if (error || !data?.length) {
    return demoCatalog();
  }

  return data.map((row) => mapMemory(row as Record<string, unknown>));
}

export function getInitialExhibitIndex(catalog: Memory[]): number {
  const featured = catalog.findIndex((m) => m.featured_story);
  return featured >= 0 ? featured : 0;
}

export async function buildExhibitPayload(
  memory: Memory,
  exhibitIndex: number,
  exhibitTotal: number,
  options?: { skipViewIncrement?: boolean; bumpTodayReads?: boolean },
): Promise<StoryOfTheDayPayload> {
  const imageUrl = await attachPhoto(memory);
  const pullQuote = buildPullQuote(memory);
  let excerpt = storyExcerpt(memory.story, 220);
  if (memory.story.length > 220 && !excerpt.endsWith('…')) {
    excerpt = `${excerpt}…`;
  }

  const archiveCount = await getArchiveCount();
  const totalViews = (memory.view_count ?? 0) + DEMO_ARCHIVE_STATS.totalViews;

  let todayReads = DEMO_ARCHIVE_STATS.todayReads;
  if (typeof window !== 'undefined') {
    if (options?.bumpTodayReads) {
      todayReads = bumpTodayReads();
    } else {
      const stored = localStorage.getItem(getTodayReadsKey());
      todayReads = stored ? parseInt(stored, 10) : DEMO_ARCHIVE_STATS.todayReads;
    }
  }

  if (
    !options?.skipViewIncrement &&
    isSupabaseConfigured &&
    supabase &&
    !memory.id.startsWith('demo-')
  ) {
    supabase.rpc('increment_memory_views', { memory_id: memory.id }).then(() => {});
  }

  return {
    memory,
    imageUrl,
    pullQuote,
    excerpt,
    museum: buildMuseumMeta(memory, todayReads),
    stats: {
      todayReads,
      totalViews,
      archiveCount,
    },
    exhibitIndex,
    exhibitTotal,
  };
}

export async function fetchStoryOfTheDay(): Promise<StoryOfTheDayPayload> {
  const catalog = await fetchExhibitCatalog();
  const index = getInitialExhibitIndex(catalog);
  const memory = catalog[index] ?? demoStoryOfTheDayMemory;
  return buildExhibitPayload(memory, index, catalog.length, {
    bumpTodayReads: true,
  });
}
