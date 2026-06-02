import type { MemoryCategory as MemoryCategoryType } from '@/constants/categories';

export type { MemoryCategoryType as MemoryCategory };

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
  category: MemoryCategoryType;
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
  likes?: number;
  show_on_map?: boolean;
  published_archive?: boolean;
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

export {
  VANISHED_CATEGORY,
  RESIDENT_CATEGORIES,
  MEMORY_CATEGORIES,
} from '@/constants/categories';

export type ReactionType =
  | 'dear'
  | 'remember'
  | 'important'
  | 'studied'
  | 'lived_nearby';

export interface ReactionCounts {
  dear: number;
  remember: number;
  important: number;
  studied: number;
  lived_nearby: number;
}

export interface ArchivePublicStats {
  places: number;
  memories: number;
  views: number;
  pending: number;
  goal: number;
}

export interface PopularPlace {
  place_id: string;
  place_title: string;
  memory_count: number;
  total_views: number;
}

export interface MemoryRoute {
  id: string;
  title: string;
  description: string;
  place_ids: string[];
  era?: string;
}

export interface MemoryFormData {
  name: string;
  category: import('@/constants/categories').MemoryCategory;
  year: number;
  title: string;
  story: string;
  place_id: string;
}
