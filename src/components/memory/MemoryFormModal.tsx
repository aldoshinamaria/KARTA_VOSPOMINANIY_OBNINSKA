import { useState, type FormEvent, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitMemory } from '@/api/places';
import { FORM_LIMITS, MEMORY_CATEGORIES } from '@/constants/categories';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { MemoryCategory, MemoryFormData, Place } from '@/types';
import { validateMemoryForm } from '@/utils/validation';

interface MemoryFormModalProps {
  place: Place | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const emptyForm = (placeId = ''): MemoryFormData => ({
  name: '',
  category: 'Любимое место',
  year: new Date().getFullYear(),
  title: '',
  story: '',
  place_id: placeId,
});

export default function MemoryFormModal({
  place,
  open,
  onClose,
  onSuccess,
}: MemoryFormModalProps) {
  const [form, setForm] = useState<MemoryFormData>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof MemoryFormData, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    setForm(emptyForm());
    setErrors({});
    setSubmitError(null);
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!place) return;

    const validation = validateMemoryForm({ ...form, place_id: place.id });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      await submitMemory(place.id, {
        name: form.name.trim(),
        category: form.category,
        year: form.year,
        title: form.title.trim(),
        story: form.story.trim(),
      });
      setSubmitted(true);
      onSuccess();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Не удалось отправить воспоминание',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && place && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-museum-ink/40 p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-labelledby="memory-form-title"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-museum-paper shadow-2xl sm:rounded-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 border-b border-museum-ink/10 bg-museum-paper px-5 py-4">
              <h2 id="memory-form-title" className="text-lg font-semibold">
                Новое воспоминание
              </h2>
              <p className="text-sm text-museum-ink/60">{place.title}</p>
            </div>

            {submitted ? (
              <div className="p-6 text-center">
                <p className="text-museum-copper font-medium">
                  Спасибо! Ваше воспоминание отправлено на модерацию.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-4 rounded-xl bg-museum-copper px-6 py-2 text-sm text-white"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 p-5">
                {!isSupabaseConfigured && (
                  <p className="rounded-lg bg-museum-rose/10 px-3 py-2 text-sm text-museum-rose">
                    Supabase не подключён — отправка недоступна. Настройте .env
                  </p>
                )}

                <Field label="Имя" error={errors.name}>
                  <input
                    type="text"
                    maxLength={FORM_LIMITS.nameMax}
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="field-input"
                    placeholder="Как к вам обращаться"
                  />
                  <CharCount
                    current={form.name.length}
                    max={FORM_LIMITS.nameMax}
                  />
                </Field>

                <Field label="Категория" error={errors.category}>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as MemoryCategory,
                      }))
                    }
                    className="field-input"
                  >
                    {MEMORY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Год" error={errors.year}>
                  <input
                    type="number"
                    min={FORM_LIMITS.yearMin}
                    max={FORM_LIMITS.yearMax}
                    value={form.year}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        year: parseInt(e.target.value, 10) || f.year,
                      }))
                    }
                    className="field-input"
                  />
                </Field>

                <Field label="Заголовок" error={errors.title}>
                  <input
                    type="text"
                    maxLength={FORM_LIMITS.titleMax}
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="field-input"
                    placeholder="Коротко о моменте"
                  />
                  <CharCount
                    current={form.title.length}
                    max={FORM_LIMITS.titleMax}
                  />
                </Field>

                <Field label="История" error={errors.story}>
                  <textarea
                    rows={5}
                    maxLength={FORM_LIMITS.storyMax}
                    value={form.story}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, story: e.target.value }))
                    }
                    className="field-input resize-y"
                    placeholder="Расскажите, что здесь было важного для вас"
                  />
                  <CharCount
                    current={form.story.length}
                    max={FORM_LIMITS.storyMax}
                  />
                </Field>

                {submitError && (
                  <p className="text-sm text-museum-rose">{submitError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 rounded-xl border border-museum-ink/15 py-2.5 text-sm"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !isSupabaseConfigured}
                    className="flex-1 rounded-xl bg-museum-copper py-2.5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {submitting ? 'Отправка…' : 'Отправить'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
      <span className="mb-1 block text-sm font-medium text-museum-ink/80">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-museum-rose">{error}</span>}
    </label>
  );
}

function CharCount({ current, max }: { current: number; max: number }) {
  return (
    <span className="mt-0.5 block text-right text-xs text-museum-ink/40">
      {current}/{max}
    </span>
  );
}
