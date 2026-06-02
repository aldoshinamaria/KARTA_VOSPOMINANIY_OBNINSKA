import { ARCHIVE_STATS } from '@/constants/hero';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { ArchivePublicStats } from '@/types';

const MEMORY_GOAL = 500;
const DEMO_PLACES = 20;
const DEMO_MEMORIES = parseInt(ARCHIVE_STATS[1].value, 10) || 326;

export async function fetchArchivePublicStats(): Promise<ArchivePublicStats> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      places: DEMO_PLACES,
      memories: DEMO_MEMORIES,
      views: DEMO_MEMORIES * 10,
      pending: 0,
      goal: MEMORY_GOAL,
    };
  }

  const { data, error } = await supabase.rpc('archive_public_stats');

  if (error || !data) {
    return {
      places: DEMO_PLACES,
      memories: DEMO_MEMORIES,
      views: 0,
      pending: 0,
      goal: MEMORY_GOAL,
    };
  }

  const row = data as Record<string, number>;
  return {
    places: Number(row.places ?? DEMO_PLACES),
    memories: Number(row.memories ?? DEMO_MEMORIES),
    views: Number(row.views ?? 0),
    pending: Number(row.pending ?? 0),
    goal: MEMORY_GOAL,
  };
}
