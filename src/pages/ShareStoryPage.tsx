import { useSearchParams } from 'react-router-dom';
import PageMeta from '@/components/layout/PageMeta';
import ShareStoryForm from '@/components/story/ShareStoryForm';

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
          Поделиться историей
        </h1>
        <p className="mt-4 text-museum-ink/65">
          Старые фото, семейные истории, школьные воспоминания — всё, что хранит
          память о городе, важно сохранить.
        </p>
        <div className="mt-10">
          <ShareStoryForm initialPlaceId={placeId} />
        </div>
      </div>
    </>
  );
}
