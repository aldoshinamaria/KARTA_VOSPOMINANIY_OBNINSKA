import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fetchApprovedPlaces } from '@/api/places';
import { uploadMemoryPhoto } from '@/api/photos';
import { submitMemory } from '@/api/places';
import { FORM_LIMITS, MEMORY_CATEGORIES } from '@/constants/categories';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { MemoryCategory, MemoryFormData, Place } from '@/types';
import { validateMemoryForm } from '@/utils/validation';
import { validateImageFile } from '@/utils/imageCompress';

const emptyForm = (placeId = ''): MemoryFormData => ({
  name: '',
  category: 'Любимое место',
  year: new Date().getFullYear(),
  title: '',
  story: '',
  place_id: placeId,
});

interface ShareStoryFormProps {
  initialPlaceId?: string;
}

export default function ShareStoryForm({ initialPlaceId }: ShareStoryFormProps) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [form, setForm] = useState<MemoryFormData>(emptyForm(initialPlaceId ?? ''));
  const [errors, setErrors] = useState<Partial<Record<keyof MemoryFormData, string>>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetchApprovedPlaces().then(setPlaces).catch(() => setPlaces([]));
  }, []);

  useEffect(() => {
    if (initialPlaceId) {
      setForm((f) => ({ ...f, place_id: initialPlaceId }));
    }
  }, [initialPlaceId]);

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const next: File[] = [];
    const prev: string[] = [];
    for (const file of Array.from(list)) {
      const err = validateImageFile(file);
      if (err) {
        setSubmitError(err);
        return;
      }
      if (files.length + next.length >= 5) break;
      next.push(file);
      prev.push(URL.createObjectURL(file));
    }
    setFiles((f) => [...f, ...next].slice(0, 5));
    setPreviews((p) => [...p, ...prev].slice(0, 5));
    setSubmitError(null);
  };

  const removeFile = (i: number) => {
    setFiles((f) => f.filter((_, idx) => idx !== i));
    setPreviews((p) => {
      URL.revokeObjectURL(p[i]);
      return p.filter((_, idx) => idx !== i);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validation = validateMemoryForm(form);
    if (!form.place_id) {
      validation.errors.place_id = 'Выберите место';
      validation.valid = false;
    }
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const memoryId = await submitMemory(form.place_id, {
        name: form.name.trim(),
        category: form.category,
        year: form.year,
        title: form.title.trim(),
        story: form.story.trim(),
      });

      for (let i = 0; i < files.length; i++) {
        await uploadMemoryPhoto(memoryId, files[i], i);
      }

      setDone(true);
      setForm(emptyForm());
      setFiles([]);
      previews.forEach(URL.revokeObjectURL);
      setPreviews([]);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Не удалось отправить историю',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-museum-sage/30 bg-museum-cream p-10 text-center"
      >
        <p className="font-display text-2xl text-museum-copper">Спасибо!</p>
        <p className="mt-3 text-museum-ink/70">
          Ваша история отправлена в архив и появится после проверки модератором.
        </p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="mt-6 text-sm text-museum-copper underline"
        >
          Добавить ещё одну историю
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-museum-copper/12 bg-museum-cream p-6 shadow-lg sm:p-10"
    >
      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-museum-rose/10 px-4 py-3 text-sm text-museum-rose">
          Демо-режим: подключите Supabase в .env, чтобы отправлять истории и фото.
        </p>
      )}

      <Field label="Место в Обнинске" error={errors.place_id}>
        <select
          value={form.place_id}
          onChange={(e) => setForm((f) => ({ ...f, place_id: e.target.value }))}
          className="field-input"
        >
          <option value="">Выберите место</option>
          {places.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Ваше имя" error={errors.name}>
          <input
            className="field-input"
            maxLength={FORM_LIMITS.nameMax}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </Field>
        <Field label="Год" error={errors.year}>
          <input
            type="number"
            className="field-input"
            min={FORM_LIMITS.yearMin}
            max={FORM_LIMITS.yearMax}
            value={form.year}
            onChange={(e) =>
              setForm((f) => ({ ...f, year: parseInt(e.target.value, 10) || f.year }))
            }
          />
        </Field>
      </div>

      <Field label="Категория" error={errors.category}>
        <select
          className="field-input"
          value={form.category}
          onChange={(e) =>
            setForm((f) => ({ ...f, category: e.target.value as MemoryCategory }))
          }
        >
          {MEMORY_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Заголовок истории" error={errors.title}>
        <input
          className="field-input"
          maxLength={FORM_LIMITS.titleMax}
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </Field>

      <Field label="Ваша история" error={errors.story}>
        <textarea
          className="field-input min-h-[160px] resize-y"
          maxLength={FORM_LIMITS.storyMax}
          value={form.story}
          onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))}
        />
      </Field>

      <div>
        <p className="mb-2 text-sm font-medium text-museum-ink/80">
          Фотографии (до 5, JPG/PNG/WebP, макс. 5 МБ)
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => onFiles(e.target.files)}
          className="text-sm"
        />
        {previews.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {previews.map((src, i) => (
              <li key={src} className="relative">
                <img
                  src={src}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -right-1 -top-1 rounded-full bg-museum-ink px-1.5 text-xs text-museum-cream"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {submitError && <p className="text-sm text-museum-rose">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting || !isSupabaseConfigured}
        className="w-full rounded-full bg-museum-copper py-3.5 text-sm font-semibold text-museum-cream disabled:opacity-50 sm:w-auto sm:px-12"
      >
        {submitting ? 'Отправка…' : 'Отправить в архив'}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-museum-ink/80">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-museum-rose">{error}</span>}
    </label>
  );
}
