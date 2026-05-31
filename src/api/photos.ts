import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BUCKET_MEMORY_PHOTOS } from '@/constants/site';
import { compressImage } from '@/utils/imageCompress';

export async function uploadMemoryPhoto(
  memoryId: string,
  file: File,
  sortOrder: number,
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase не настроен для загрузки фото');
  }

  const blob = await compressImage(file);
  const ext = file.type === 'image/png' ? 'png' : 'jpg';
  const path = `memories/${memoryId}/${Date.now()}-${sortOrder}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_MEMORY_PHOTOS)
    .upload(path, blob, {
      contentType: blob.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase.from('memory_photos').insert({
    memory_id: memoryId,
    storage_path: path,
    sort_order: sortOrder,
  });

  if (dbError) throw dbError;
}
