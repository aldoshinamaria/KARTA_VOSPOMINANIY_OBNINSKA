const MAX_SIDE = 1920;
const JPEG_QUALITY = 0.82;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function validateImageFile(file: File): string | null {
  if (!ALLOWED.includes(file.type)) {
    return 'Допустимы только JPG, PNG и WebP';
  }
  if (file.size > MAX_BYTES) {
    return 'Файл не больше 5 МБ';
  }
  return null;
}

export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith('image/')) return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, JPEG_QUALITY),
  );

  return blob ?? file;
}
