import { demoMemories } from '@/data/demoMemories';
import { seedPlaces } from '@/data/seedPlaces';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getPublicStorageUrl } from '@/utils/storageUrl';
import { VANISHED_CATEGORY, type Memory, type MemoryCategory } from '@/types';

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
    place: placeRaw
      ? { id: String(placeRaw.id), title: String(placeRaw.title) }
      : null,
  };
}

function withPlaceTitles(memories: Memory[]): Memory[] {
  const titles = new Map(seedPlaces.map((p) => [p.id, p.title]));
  return memories.map((m) => ({
    ...m,
    place: m.place ?? (titles.has(m.place_id) ? { id: m.place_id, title: titles.get(m.place_id)! } : null),
  }));
}

export async function fetchLatestMemories(limit = 6): Promise<Memory[]> {
  if (!isSupabaseConfigured || !supabase) {
    return withPlaceTitles(
      [...demoMemories].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ).slice(0, limit),
    );
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*, place:places(id, title)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapMemory);
}

export async function fetchMemoriesByCategory(
  category: MemoryCategory,
  limit = 8,
): Promise<Memory[]> {
  if (!isSupabaseConfigured || !supabase) {
    return withPlaceTitles(
      demoMemories.filter((m) => m.category === category).slice(0, limit),
    );
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*, place:places(id, title)')
    .eq('status', 'approved')
    .eq('category', category)
    .order('year', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapMemory);
}

export async function fetchVanishedStories(limit = 6): Promise<Memory[]> {
  return fetchMemoriesByCategory(VANISHED_CATEGORY, limit);
}

export async function fetchResidentStories(limit = 8): Promise<Memory[]> {
  if (!isSupabaseConfigured || !supabase) {
    return withPlaceTitles(
      demoMemories
        .filter((m) => m.category !== VANISHED_CATEGORY)
        .slice(0, limit),
    );
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*, place:places(id, title)')
    .eq('status', 'approved')
    .neq('category', VANISHED_CATEGORY)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapMemory);
}

export async function fetchMemoryById(id: string): Promise<Memory | null> {
  if (!isSupabaseConfigured || !supabase) {
    const m = demoMemories.find((x) => x.id === id);
    return m ? withPlaceTitles([m])[0] : null;
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*, place:places(id, title)')
    .eq('id', id)
    .eq('status', 'approved')
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const memory = mapMemory(data);
  const { data: photos } = await supabase
    .from('memory_photos')
    .select('*')
    .eq('memory_id', id)
    .order('sort_order');

  memory.photos = (photos ?? []).map((p) => ({
    id: String(p.id),
    memory_id: String(p.memory_id),
    storage_path: String(p.storage_path),
    sort_order: Number(p.sort_order),
    url: getPublicStorageUrl(String(p.storage_path)) ?? undefined,
  }));

  return memory;
}
