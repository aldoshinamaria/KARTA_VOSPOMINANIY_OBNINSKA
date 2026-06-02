import { useEffect, useState } from 'react';
import { REACTIONS } from '@/constants/reactions';
import {
  addReaction,
  fetchReactionCounts,
  fetchUserReactions,
} from '@/api/reactions';
import type { ReactionType } from '@/types';

interface StoryReactionsProps {
  memoryId: string;
  compact?: boolean;
}

export default function StoryReactions({
  memoryId,
  compact = false,
}: StoryReactionsProps) {
  const [counts, setCounts] = useState<Record<ReactionType, number>>({
    dear: 0,
    remember: 0,
    important: 0,
    studied: 0,
    lived_nearby: 0,
  });
  const [mine, setMine] = useState<ReactionType[]>([]);
  const [busy, setBusy] = useState<ReactionType | null>(null);

  useEffect(() => {
    fetchReactionCounts(memoryId).then(setCounts);
    fetchUserReactions(memoryId).then(setMine);
  }, [memoryId]);

  const handleReact = async (type: ReactionType) => {
    if (mine.includes(type) || busy) return;
    setBusy(type);
    try {
      const next = await addReaction(memoryId, type);
      setCounts(next);
      setMine((prev) => [...prev, type]);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className={compact ? 'story-reactions story-reactions--compact' : 'story-reactions'}
      role="group"
      aria-label="Реакции жителей"
    >
      {!compact && (
        <p className="story-reactions__title">Отметьте, если это откликается</p>
      )}
      <ul className="story-reactions__list">
        {REACTIONS.map((r) => {
          const active = mine.includes(r.type);
          return (
            <li key={r.type}>
              <button
                type="button"
                className={`story-reaction-btn ${active ? 'story-reaction-btn--active' : ''}`}
                onClick={() => handleReact(r.type)}
                disabled={active || busy === r.type}
                aria-pressed={active}
              >
                <span className="story-reaction-btn__emoji" aria-hidden>
                  {r.emoji}
                </span>
                <span className="story-reaction-btn__label">{r.label}</span>
                <span className="story-reaction-btn__count">{counts[r.type]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
