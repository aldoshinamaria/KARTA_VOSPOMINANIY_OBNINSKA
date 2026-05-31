import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Memory, Place } from '@/types';

function mapPlace(row: Record<string, unknown>): Place {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ''),
    lat: Number(row.lat),
    lng: Number(row.lng),
    status: row.status as Place['status'],
    created_at: String(row.created_at),
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

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const { data, error } = await supabase.rpc('check_admin_password', {
    pass: password,
  });

  if (error) return false;
  return Boolean(data);
}

export async function adminFetchPlaces(password: string): Promise<Place[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase.rpc('admin_list_places', {
    admin_pass: password,
  });

  if (error) throw error;
  return (data ?? []).map(mapPlace);
}

export async function adminFetchMemories(password: string): Promise<Memory[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase.rpc('admin_list_memories', {
    admin_pass: password,
  });

  if (error) throw error;
  return (data ?? []).map(mapMemory);
}

export async function adminUpdateMemoryStatus(
  password: string,
  memoryId: string,
  status: 'pending' | 'approved' | 'rejected',
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.rpc('admin_update_memory', {
    admin_pass: password,
    memory_id: memoryId,
    new_status: status,
  });

  if (error) throw error;
}

export async function adminDeleteMemory(
  password: string,
  memoryId: string,
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.rpc('admin_delete_memory', {
    admin_pass: password,
    memory_id: memoryId,
  });

  if (error) throw error;
}

export async function adminUpdatePlaceStatus(
  password: string,
  placeId: string,
  status: 'pending' | 'approved' | 'rejected',
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.rpc('admin_update_place', {
    admin_pass: password,
    place_id: placeId,
    new_status: status,
  });

  if (error) throw error;
}

export async function adminDeletePlace(
  password: string,
  placeId: string,
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const { error } = await supabase.rpc('admin_delete_place', {
    admin_pass: password,
    place_id: placeId,
  });

  if (error) throw error;
}
