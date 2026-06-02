import { useEffect, useState } from 'react';
import HeroSection from '@/components/archive/HeroSection';
import StoryOfTheDay from '@/components/archive/StoryOfTheDay';
import MapTeaser from '@/components/archive/MapTeaser';
import SectionHeader from '@/components/archive/SectionHeader';
import StoryCard from '@/components/archive/StoryCard';
import CommunityCTA from '@/components/engagement/CommunityCTA';
import PageMeta from '@/components/layout/PageMeta';
import { fetchArchivePublicStats } from '@/api/archiveStats';
import { fetchLatestMemories, fetchResidentStories, fetchVanishedStories } from '@/api/memories';
import { SITE_DESCRIPTION } from '@/constants/site';
import type { ArchivePublicStats, Memory } from '@/types';

export default function HomePage() {
  const [latest, setLatest] = useState<Memory[]>([]);
  const [vanished, setVanished] = useState<Memory[]>([]);
  const [residents, setResidents] = useState<Memory[]>([]);
  const [stats, setStats] = useState<ArchivePublicStats | null>(null);

  useEffect(() => {
    fetchArchivePublicStats().then(setStats);
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
      <CommunityCTA stats={stats} />

      <section id="latest-stories" className="scroll-mt-20 border-t border-museum-copper/10 bg-museum-paper py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeader
            eyebrow="Архив"
            title="Последние истории"
            description="Свежие воспоминания жителей — живой поток народной памяти."
          />
          {latest.length === 0 ? (
            <p className="text-center text-museum-ink/50">
              Скоро здесь появятся первые истории.{' '}
              <a href="/share" className="text-museum-copper underline">
                Станьте первым автором
              </a>
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((m, i) => (
                <StoryCard key={m.id} memory={m} index={i} />
              ))}
            </div>
          )}
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
            description="Места, которых больше нет: магазины, дворы, кинотеатры, маршруты."
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
            description="Детство, школа, семья, работа — истории, которые пишет сам город."
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
