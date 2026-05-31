import PageMeta from '@/components/layout/PageMeta';
import ExhibitContribution from '@/components/exhibit/ExhibitContribution';
import ExhibitDiaryMemories from '@/components/exhibit/ExhibitDiaryMemories';
import ExhibitGallery from '@/components/exhibit/ExhibitGallery';
import ExhibitHero from '@/components/exhibit/ExhibitHero';
import ExhibitHistoryPlaque from '@/components/exhibit/ExhibitHistoryPlaque';
import ExhibitMiniMap from '@/components/exhibit/ExhibitMiniMap';
import ExhibitRelated from '@/components/exhibit/ExhibitRelated';
import ExhibitThenNow from '@/components/exhibit/ExhibitThenNow';
import ExhibitTimeline from '@/components/exhibit/ExhibitTimeline';
import ExhibitVoicesCarousel from '@/components/exhibit/ExhibitVoicesCarousel';
import type { MemoryObjectExhibit } from '@/types/exhibit';

import '@/styles/exhibit.css';

interface MemoryObjectPageProps {
  exhibit: MemoryObjectExhibit;
}

export default function MemoryObjectPage({ exhibit }: MemoryObjectPageProps) {
  return (
    <>
      <PageMeta
        title={exhibit.title}
        description={`${exhibit.tagline} ${exhibit.yearsActive}. Цифровой музей Обнинска.`}
        path={`/place/${exhibit.placeId}`}
      />

      <article className="exhibit-page">
        <ExhibitHero exhibit={exhibit} />
        <ExhibitHistoryPlaque history={exhibit.history} />
        <ExhibitTimeline events={exhibit.timeline} />
        <ExhibitGallery items={exhibit.gallery} />
        <ExhibitThenNow thenNow={exhibit.thenNow} title={exhibit.title} />
        <ExhibitDiaryMemories memories={exhibit.memories} />
        <ExhibitVoicesCarousel voices={exhibit.voices} />
        <ExhibitMiniMap exhibit={exhibit} />
        <ExhibitRelated relatedIds={exhibit.relatedPlaceIds} />
        <ExhibitContribution
          placeId={exhibit.placeId}
          placeTitle={exhibit.title}
        />
      </article>
    </>
  );
}
