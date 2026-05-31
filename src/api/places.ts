import { demoMemories } from '@/data/demoMemories';
import { seedPlaces } from '@/data/seedPlaces';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getPublicStorageUrl } from '@/utils/storageUrl';
import type { Memory, Place, PlacePhoto } from '@/types';

function mapPlace(row: Record<string, unknown>): Place {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ''),
    lat: Number(row.lat),
    lng: Number(row.lng),
    status: row.status as Place['status'],
    created_at: String(row.created_at),
    cover_image_path: row.cover_image_path
      ? String(row.cover_image_path)
      : null,
    place_story: row.place_story ? String(row.place_story) : '',
  };
}

function mapMemory(row: Record<string, unknown>): Memory {
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
  };
}

export async function fetchApprovedPlaces(): Promise<Place[]> {
  if (!isSupabaseConfigured || !supabase) {
    return seedPlaces.map((p) => ({
      ...p,
      status: 'approved' as const,
      created_at: new Date(0).toISOString(),
      place_story: p.description,
    }));
  }

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('status', 'approved')
    .order('title');

  if (error) throw error;
  return (data ?? []).map(mapPlace);
}

export async function fetchPlaceById(id: string): Promise<Place | null> {
  if (!isSupabaseConfigured || !supabase) {
    const p = seedPlaces.find((x) => x.id === id);
    if (!p) return null;
    return {
      ...p,
      status: 'approved',
      created_at: new Date(0).toISOString(),
      place_story: p.description,
    };
  }

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .maybeSingle();

  if (error) throw error;
  return data ? mapPlace(data) : null;
}

export async function fetchPlacePhotos(placeId: string): Promise<PlacePhoto[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('place_photos')
    .select('*')
    .eq('place_id', placeId)
    .order('sort_order');

  if (error) throw error;

  return (data ?? []).map((p) => ({
    id: String(p.id),
    place_id: String(p.place_id),
    storage_path: String(p.storage_path),
    caption: String(p.caption ?? ''),
    sort_order: Number(p.sort_order),
    url: getPublicStorageUrl(String(p.storage_path)) ?? undefined,
  }));
}

export async function fetchApprovedMemoriesForPlace(
  placeId: string,
): Promise<Memory[]> {
  if (!isSupabaseConfigured || !supabase) {
    return demoMemories.filter((m) => m.place_id === placeId);
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('place_id', placeId)
    .eq('status', 'approved')
    .order('year', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMemory);
}

export async function fetchApprovedMemoryCount(
  placeId: string,
): Promise<number> {
  if (!isSupabaseConfigured || !supabase) {
    return demoMemories.filter((m) => m.place_id === placeId).length;
  }

  const { data, error } = await supabase.rpc('approved_memory_count', {
    p_place_id: placeId,
  });

  if (error) throw error;
  return Number(data ?? 0);
}

export async function submitMemory(
  placeId: string,
  payload: {
    name: string;
    category: string;
    year: number;
    title: string;
    story: string;
  },
): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env',
    );
  }

  const { data, error } = await supabase
    .from('memories')
    .insert({
      place_id: placeId,
      name: payload.name,
      category: payload.category,
      year: payload.year,
      title: payload.title,
      story: payload.story,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) throw error;
  return String(data.id);
}
