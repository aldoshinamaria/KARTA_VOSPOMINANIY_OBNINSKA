import { useEffect, useState } from 'react';
import HeroSection from '@/components/archive/HeroSection';
import StoryOfTheDay from '@/components/archive/StoryOfTheDay';
import MapTeaser from '@/components/archive/MapTeaser';
import SectionHeader from '@/components/archive/SectionHeader';
import StoryCard from '@/components/archive/StoryCard';
import PageMeta from '@/components/layout/PageMeta';
import { fetchLatestMemories, fetchResidentStories, fetchVanishedStories } from '@/api/memories';
import { SITE_DESCRIPTION } from '@/constants/site';
import type { Memory } from '@/types';

export default function HomePage() {
  const [latest, setLatest] = useState<Memory[]>([]);
  const [vanished, setVanished] = useState<Memory[]>([]);
  const [residents, setResidents] = useState<Memory[]>([]);

  useEffect(() => {
    Promise.all([
      fetchLatestMemories(6),
      fetchVanishedStories(6),
      fetchResidentStories(8),
    ]).then(([l, v, r]) => {
      setLatest(l);
      setVanished(v);
      setResidents(r);
    });
  }, []);

  return (
    <>
      <PageMeta description={SITE_DESCRIPTION} path="/" />
      <HeroSection />
      <StoryOfTheDay />

      <section id="latest-stories" className="scroll-mt-20 border-t border-museum-copper/10 bg-museum-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            eyebrow="Архив"
            title="Последние истории"
            description="Свежие воспоминания жителей — живой поток народной памяти."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((m, i) => (
              <StoryCard key={m.id} memory={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="vanished"
        className="scroll-mt-20 bg-museum-ink py-16 text-museum-cream sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            dark
            eyebrow="Экспозиция"
            title="Исчезнувший Обнинск"
            description="Места, которых больше нет: магазины, дворы, кинотеатры, маршруты. Истории как музейные экспонаты."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vanished.map((m, i) => (
              <StoryCard key={m.id} memory={m} variant="exhibit" index={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="residents" className="scroll-mt-20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            eyebrow="Голоса города"
            title="Обнинск глазами жителей"
            description="Детство, школа, семья, работа, любимые уголки и городские праздники."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {residents.map((m, i) => (
              <StoryCard key={m.id} memory={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section id="map-teaser" className="scroll-mt-20 border-t border-museum-copper/10 bg-museum-warm/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <MapTeaser />
        </div>
      </section>
    </>
  );
}
