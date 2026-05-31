import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchMemoryById } from '@/api/memories';
import PageMeta from '@/components/layout/PageMeta';
import type { Memory } from '@/types';

export default function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchMemoryById(id)
      .then(setMemory)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="py-20 text-center text-museum-ink/50">Загрузка…</p>;
  }

  if (!memory) {
    return (
      <div className="py-20 text-center">
        <p className="font-display text-xl">История не найдена</p>
        <Link to="/" className="mt-4 inline-block text-museum-copper">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={memory.title} path={`/story/${memory.id}`} />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <Link to="/" className="text-xs text-museum-copper hover:underline">
          ← Архив
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <p className="text-xs uppercase tracking-widest text-museum-copper">
            {memory.category} · {memory.year}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-museum-ink">
            {memory.title}
          </h1>
          <p className="mt-3 text-museum-ink/60">
            {memory.name}
            {memory.place?.title && (
              <>
                {' '}
                ·{' '}
                <Link
                  to={`/place/${memory.place_id}`}
                  className="text-museum-copper hover:underline"
                >
                  {memory.place.title}
                </Link>
              </>
            )}
          </p>
        </motion.div>

        <div className="prose-museum mt-10 text-lg leading-relaxed text-museum-ink/85">
          {memory.story.split('\n').map((p, i) => (
            <p key={i} className="mb-4">
              {p}
            </p>
          ))}
        </div>

        {memory.photos && memory.photos.length > 0 && (
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {memory.photos.map((ph) => (
              <li key={ph.id}>
                <img
                  src={ph.url}
                  alt=""
                  className="rounded-xl object-cover"
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to={`/place/${memory.place_id}`}
            className="rounded-full border border-museum-copper/20 px-5 py-2 text-sm text-museum-copper"
          >
            Все истории этого места
          </Link>
          <Link
            to="/share"
            className="rounded-full bg-museum-copper px-5 py-2 text-sm text-museum-cream"
          >
            Поделиться своей историей
          </Link>
        </div>
      </article>
    </>
  );
}
