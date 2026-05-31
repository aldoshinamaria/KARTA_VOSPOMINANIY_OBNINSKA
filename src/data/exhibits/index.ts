import type { MemoryObjectExhibit } from '@/types/exhibit';
import { sputnikExhibit, SPUTNIK_PLACE_ID } from '@/data/exhibits/sputnik';

const exhibits: Record<string, MemoryObjectExhibit> = {
  [SPUTNIK_PLACE_ID]: sputnikExhibit,
};

export function getExhibitByPlaceId(placeId: string): MemoryObjectExhibit | null {
  return exhibits[placeId] ?? null;
}

export { SPUTNIK_PLACE_ID, sputnikExhibit };
