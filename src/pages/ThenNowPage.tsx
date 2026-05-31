import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchThenNowPairs } from '@/api/thenNow';
import PageMeta from '@/components/layout/PageMeta';
import BeforeAfterSlider from '@/components/thenNow/BeforeAfterSlider';
import type { ThenNowPair } from '@/types';

export default function ThenNowPage() {
  const [pairs, setPairs] = useState<ThenNowPair[]>([]);

  useEffect(() => {
    fetchThenNowPairs().then(setPairs);
  }, []);

  return (
    <>
      <PageMeta
        title="Тогда и сейчас"
        description="Сравните, как менялся Обнинск — архивные и современные фотографии одного и того же места."
        path="/then-and-now"
      />

      <header className="border-b border-museum-copper/10 bg-gradient-to-b from-museum-warm to-museum-paper px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-museum-copper">
            Мультимедийная экспозиция
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-museum-ink sm:text-5xl">
            Тогда и сейчас
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-museum-ink/65">
            Проведите ползунок — и увидите, как менялся город. Один из самых
            наглядных способов прикоснуться к памяти Обнинска.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-12 px-4 py-14 sm:py-20">
        {pairs.map((pair) => (
          <BeforeAfterSlider
            key={pair.id}
            title={pair.title}
            description={pair.description}
            year={pair.year}
            beforeSrc={pair.before_url ?? pair.before_image_path}
            afterSrc={pair.after_url ?? pair.after_image_path}
          />
        ))}

        {pairs.length === 0 && (
          <p className="text-center text-museum-ink/50">
            Пары «тогда/сейчас» появятся после модерации.
          </p>
        )}

        <p className="text-center text-sm text-museum-ink/50">
          Хотите добавить сравнение?{' '}
          <Link to="/share" className="text-museum-copper underline">
            Расскажите нам
          </Link>
        </p>
      </div>
    </>
  );
}
