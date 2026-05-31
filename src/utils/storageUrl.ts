import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BUCKET_MEMORY_PHOTOS } from '@/constants/site';

export function getPublicStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (!isSupabaseConfigured || !supabase) return null;

  const { data } = supabase.storage.from(BUCKET_MEMORY_PHOTOS).getPublicUrl(path);
  return data.publicUrl;
}
