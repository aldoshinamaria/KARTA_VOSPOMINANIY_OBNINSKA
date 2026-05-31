import { demoThenNow } from '@/data/demoMemories';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getPublicStorageUrl } from '@/utils/storageUrl';
import type { ThenNowPair } from '@/types';

function mapPair(row: Record<string, unknown>): ThenNowPair {
  const before = String(row.before_image_path);
  const after = String(row.after_image_path);
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ''),
    place_id: row.place_id ? String(row.place_id) : null,
    before_image_path: before,
    after_image_path: after,
    year: row.year != null ? Number(row.year) : null,
    status: row.status as ThenNowPair['status'],
    created_at: String(row.created_at),
    before_url: getPublicStorageUrl(before) ?? before,
    after_url: getPublicStorageUrl(after) ?? after,
  };
}

export async function fetchThenNowPairs(): Promise<ThenNowPair[]> {
  if (!isSupabaseConfigured || !supabase) {
    return demoThenNow;
  }

  const { data, error } = await supabase
    .from('then_now_pairs')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapPair);
}
