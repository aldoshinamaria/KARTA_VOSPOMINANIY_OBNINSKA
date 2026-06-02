import type { ReactionCounts, ReactionType } from '@/types';

export const REACTIONS: {
  type: ReactionType;
  emoji: string;
  label: string;
}[] = [
  { type: 'dear', emoji: '❤️', label: 'Это место мне дорого' },
  { type: 'remember', emoji: '📍', label: 'Я тоже это помню' },
  { type: 'important', emoji: '⭐', label: 'Важно сохранить' },
  { type: 'studied', emoji: '🏫', label: 'Учился здесь' },
  { type: 'lived_nearby', emoji: '👨‍👩‍👧', label: 'Жил рядом' },
];

export const EMPTY_REACTION_COUNTS: ReactionCounts = {
  dear: 0,
  remember: 0,
  important: 0,
  studied: 0,
  lived_nearby: 0,
};
