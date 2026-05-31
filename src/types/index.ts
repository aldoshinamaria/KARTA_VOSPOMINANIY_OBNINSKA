export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface Place {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  status: ModerationStatus;
  created_at: string;
  cover_image_path?: string | null;
  place_story?: string;
}

export interface Memory {
  id: string;
  place_id: string;
  name: string;
  category: MemoryCategory;
  year: number;
  title: string;
  story: string;
  status: ModerationStatus;
  created_at: string;
  place?: Pick<Place, 'id' | 'title'> | null;
  photos?: MemoryPhoto[];
  featured_story?: boolean;
  pull_quote?: string | null;
  view_count?: number;
}

export interface MuseumExhibitMeta {
  inventoryNumber: string;
  period: string;
  archivedAt: string;
  historicalValue: string[];
}

/** Экспонат «История дня» для главной */
export interface StoryOfTheDayPayload {
  memory: Memory;
  imageUrl: string;
  pullQuote: string;
  excerpt: string;
  museum: MuseumExhibitMeta;
  stats: {
    todayReads: number;
    totalViews: number;
    archiveCount: number;
  };
  exhibitIndex: number;
  exhibitTotal: number;
}

export interface MemoryPhoto {
  id: string;
  memory_id: string;
  storage_path: string;
  sort_order: number;
  url?: string;
}

export interface PlacePhoto {
  id: string;
  place_id: string;
  storage_path: string;
  caption: string;
  sort_order: number;
  url?: string;
}

export interface ThenNowPair {
  id: string;
  title: string;
  description: string;
  place_id: string | null;
  before_image_path: string;
  after_image_path: string;
  year: number | null;
  status: ModerationStatus;
  created_at: string;
  before_url?: string;
  after_url?: string;
}

export interface SeedPlace {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
}

export type MemoryCategory =
  | 'Детство'
  | 'Школьные годы'
  | 'Семья'
  | 'Любимое место'
  | 'История города'
  | 'Работа'
  | 'Культура'
  | 'Спорт'
  | 'Исчезнувший Обнинск';

export interface MemoryFormData {
  name: string;
  category: MemoryCategory;
  year: number;
  title: string;
  story: string;
  place_id: string;
}

export const VANISHED_CATEGORY: MemoryCategory = 'Исчезнувший Обнинск';

export const RESIDENT_CATEGORIES: MemoryCategory[] = [
  'Детство',
  'Школьные годы',
  'Семья',
  'Любимое место',
  'История города',
  'Работа',
  'Культура',
  'Спорт',
];
