import { FORM_LIMITS, MEMORY_CATEGORIES } from '@/constants/categories';
import type { MemoryCategory, MemoryFormData } from '@/types';

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof MemoryFormData, string>>;
}

export function validateMemoryForm(data: MemoryFormData): ValidationResult {
  const errors: Partial<Record<keyof MemoryFormData, string>> = {};

  const name = data.name.trim();
  if (!name) {
    errors.name = 'Укажите имя';
  } else if (name.length > FORM_LIMITS.nameMax) {
    errors.name = `Не более ${FORM_LIMITS.nameMax} символов`;
  }

  if (!MEMORY_CATEGORIES.includes(data.category as MemoryCategory)) {
    errors.category = 'Выберите категорию';
  }

  if (
    !Number.isInteger(data.year) ||
    data.year < FORM_LIMITS.yearMin ||
    data.year > FORM_LIMITS.yearMax
  ) {
    errors.year = `Год от ${FORM_LIMITS.yearMin} до ${FORM_LIMITS.yearMax}`;
  }

  const title = data.title.trim();
  if (!title) {
    errors.title = 'Укажите заголовок';
  } else if (title.length > FORM_LIMITS.titleMax) {
    errors.title = `Не более ${FORM_LIMITS.titleMax} символов`;
  }

  const story = data.story.trim();
  if (!story) {
    errors.story = 'Напишите историю';
  } else if (story.length > FORM_LIMITS.storyMax) {
    errors.story = `Не более ${FORM_LIMITS.storyMax} символов`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
