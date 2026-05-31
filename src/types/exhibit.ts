/** Цифровой музей — страница объекта памяти */

export interface ExhibitStats {
  memories: number;
  photos: number;
  contributors: number;
}

export interface ExhibitTimelineEvent {
  year: number | string;
  title: string;
  description?: string;
}

export interface ExhibitGalleryItem {
  id: string;
  src: string;
  date: string;
  source: string;
  description: string;
  /** Для masonry-раскладки */
  tall?: boolean;
  wide?: boolean;
}

export interface ExhibitDiaryMemory {
  id: string;
  author: string;
  year: number;
  title?: string;
  text: string;
  photo?: string;
  pullQuote?: string;
}

export interface ExhibitVoice {
  id: string;
  quote: string;
  author?: string;
  year?: number;
}

export interface MemoryObjectExhibit {
  placeId: string;
  title: string;
  yearsActive: string;
  tagline: string;
  heroImage: string;
  lat: number;
  lng: number;
  stats: ExhibitStats;
  history: {
    lead: string;
    paragraphs: string[];
    facts: string[];
  };
  timeline: ExhibitTimelineEvent[];
  gallery: ExhibitGalleryItem[];
  thenNow: {
    before: string;
    after: string;
    caption?: string;
  };
  memories: ExhibitDiaryMemory[];
  voices: ExhibitVoice[];
  relatedPlaceIds: string[];
  nearbyPlaceIds: string[];
}
