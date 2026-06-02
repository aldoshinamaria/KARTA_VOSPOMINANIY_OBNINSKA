import { useSearchParams } from 'react-router-dom';
import PageMeta from '@/components/layout/PageMeta';
import ShareStoryForm from '@/components/story/ShareStoryForm';
import ContributorBadges from '@/components/engagement/ContributorBadges';
import ViralInvite from '@/components/engagement/ViralInvite';

export default function ShareStoryPage() {
  const [params] = useSearchParams();
  const placeId = params.get('place') ?? undefined;

  return (
    <>
      <PageMeta
        title="Поделиться историей"
        description="Расскажите воспоминание об Обнинске — текст и фотографии попадут в народный архив после модерации."
        path="/share"
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-museum-copper">
          Ваш вклад в архив
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-museum-ink">
          У вас тоже есть такая история?
        </h1>
        <p className="mt-4 text-museum-ink/65">
          5–10 минут — и ваше воспоминание станет частью народного архива Обнинска.
          Можно приложить до 5 фотографий из семейного альбома.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_220px]">
          <ShareStoryForm initialPlaceId={placeId} />
          <ContributorBadges />
        </div>

        <ViralInvite />
      </div>
    </>
  );
}
