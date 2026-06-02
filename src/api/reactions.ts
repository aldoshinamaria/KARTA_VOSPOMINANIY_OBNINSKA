import { EMPTY_REACTION_COUNTS } from '@/constants/reactions';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { ReactionCounts, ReactionType } from '@/types';

const CLIENT_KEY = 'obninsk_archive_client';

function getClientKey(): string {
  if (typeof window === 'undefined') return 'server';
  let key = localStorage.getItem(CLIENT_KEY);
  if (!key) {
    key = `c_${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(CLIENT_KEY, key);
  }
  return key;
}

function demoStorageKey(memoryId: string): string {
  return `demo_reactions_${memoryId}`;
}

function parseCounts(raw: Record<string, unknown> | null): ReactionCounts {
  if (!raw) return { ...EMPTY_REACTION_COUNTS };
  return {
    dear: Number(raw.dear ?? 0),
    remember: Number(raw.remember ?? 0),
    important: Number(raw.important ?? 0),
    studied: Number(raw.studied ?? 0),
    lived_nearby: Number(raw.lived_nearby ?? 0),
  };
}

function loadDemoCounts(memoryId: string): ReactionCounts {
  if (typeof window === 'undefined') return { ...EMPTY_REACTION_COUNTS };
  try {
    const stored = localStorage.getItem(demoStorageKey(memoryId));
    return stored
      ? (JSON.parse(stored) as ReactionCounts)
      : { ...EMPTY_REACTION_COUNTS };
  } catch {
    return { ...EMPTY_REACTION_COUNTS };
  }
}

function saveDemoCounts(memoryId: string, counts: ReactionCounts): void {
  localStorage.setItem(demoStorageKey(memoryId), JSON.stringify(counts));
}

function loadDemoUserReactions(memoryId: string): ReactionType[] {
  try {
    const raw = localStorage.getItem(`demo_reacted_${memoryId}`);
    return raw ? (JSON.parse(raw) as ReactionType[]) : [];
  } catch {
    return [];
  }
}

function saveDemoUserReaction(memoryId: string, type: ReactionType): void {
  const prev = loadDemoUserReactions(memoryId);
  if (!prev.includes(type)) {
    localStorage.setItem(
      `demo_reacted_${memoryId}`,
      JSON.stringify([...prev, type]),
    );
  }
}

export async function fetchReactionCounts(
  memoryId: string,
): Promise<ReactionCounts> {
  if (!isSupabaseConfigured || !supabase || memoryId.startsWith('demo-')) {
    const counts = loadDemoCounts(memoryId);
    if (Object.values(counts).every((n) => n === 0)) {
      const seed = memoryId.charCodeAt(memoryId.length - 1) % 5;
      return {
        dear: 2 + seed,
        remember: 4 + seed,
        important: 1 + seed,
        studied: seed,
        lived_nearby: 1,
      };
    }
    return counts;
  }

  const { data, error } = await supabase.rpc('memory_reaction_counts', {
    p_memory_id: memoryId,
  });

  if (error) return { ...EMPTY_REACTION_COUNTS };
  return parseCounts(data as Record<string, unknown>);
}

export async function fetchUserReactions(
  memoryId: string,
): Promise<ReactionType[]> {
  if (!isSupabaseConfigured || memoryId.startsWith('demo-')) {
    return loadDemoUserReactions(memoryId);
  }
  return [];
}

export async function addReaction(
  memoryId: string,
  reactionType: ReactionType,
): Promise<ReactionCounts> {
  if (!isSupabaseConfigured || !supabase || memoryId.startsWith('demo-')) {
    const counts = loadDemoCounts(memoryId);
    const user = loadDemoUserReactions(memoryId);
    if (!user.includes(reactionType)) {
      counts[reactionType] += 1;
      saveDemoCounts(memoryId, counts);
      saveDemoUserReaction(memoryId, reactionType);
    }
    return counts;
  }

  const { data, error } = await supabase.rpc('add_memory_reaction', {
    p_memory_id: memoryId,
    p_reaction_type: reactionType,
    p_client_key: getClientKey(),
  });

  if (error) throw error;
  return parseCounts(data as Record<string, unknown>);
}
