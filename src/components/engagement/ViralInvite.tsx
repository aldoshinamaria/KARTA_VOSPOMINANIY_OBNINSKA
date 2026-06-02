import ShareStoryButtons from '@/components/engagement/ShareStoryButtons';

export default function ViralInvite() {
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/share`
      : 'https://zhivaya-pamyat-obninska.ru/share';

  return (
    <section className="viral-invite" aria-labelledby="viral-invite-heading">
      <h2 id="viral-invite-heading" className="viral-invite__title">
        Пригласите тех, кто помнит вместе с вами
      </h2>
      <p className="viral-invite__text">
        Отправьте ссылку одноклассникам, соседям по двору, родственникам. Часто
        одно воспоминание запускает целую цепочку — и архив оживает.
      </p>
      <ul className="viral-invite__channels">
        <li>👨‍👩‍👧 Семейный чат — сохранить историю бабушки и дедушки</li>
        <li>🏫 Чат выпускников — память школы и класса</li>
        <li>📍 Группа двора — кто помнит магазин у поворота</li>
        <li>📱 Telegram-канал района — общая память</li>
      </ul>
      <ShareStoryButtons
        title="Живая память Обнинска"
        url={url}
        text="Добавьте своё воспоминание в народный архив Обнинска"
      />
    </section>
  );
}
