import { seedPlaces } from '@/data/seedPlaces';
import { demoMemories } from '@/data/demoMemories';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { PopularPlace } from '@/types';

export async function fetchPopularPlaces(limit = 8): Promise<PopularPlace[]> {
  if (!isSupabaseConfigured || !supabase) {
    const counts = new Map<string, { count: number; views: number }>();
    for (const m of demoMemories) {
      const cur = counts.get(m.place_id) ?? { count: 0, views: 0 };
      counts.set(m.place_id, {
        count: cur.count + 1,
        views: cur.views + (m.view_count ?? 0),
      });
    }
    return seedPlaces
      .map((p) => ({
        place_id: p.id,
        place_title: p.title,
        memory_count: counts.get(p.id)?.count ?? 0,
        total_views: counts.get(p.id)?.views ?? 0,
      }))
      .sort((a, b) => b.memory_count - a.memory_count)
      .slice(0, limit);
  }

  const { data, error } = await supabase.rpc('popular_places', {
    p_limit: limit,
  });

  if (error || !data) return [];

  return (data as Record<string, unknown>[]).map((row) => ({
    place_id: String(row.place_id),
    place_title: String(row.place_title),
    memory_count: Number(row.memory_count ?? 0),
    total_views: Number(row.total_views ?? 0),
  }));
}
