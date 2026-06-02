import { Link } from 'react-router-dom';
import type { ArchivePublicStats } from '@/types';

interface CommunityCTAProps {
  stats: ArchivePublicStats | null;
}

export default function CommunityCTA({ stats }: CommunityCTAProps) {
  const memories = stats?.memories ?? 326;
  const goal = stats?.goal ?? 500;
  const progress = Math.min(100, Math.round((memories / goal) * 100));

  return (
    <section className="community-cta" aria-labelledby="community-cta-heading">
      <div className="community-cta__inner">
        <p className="community-cta__eyebrow">Народный архив</p>
        <h2 id="community-cta-heading" className="community-cta__title">
          У вас тоже есть такая история?
        </h2>
        <p className="community-cta__text">
          Каждое воспоминание — кирпичик в памяти Обнинска. Расскажите про двор,
          школу, работу или место, которое помните только вы. Это займёт 5–10
          минут — и останется для детей и внуков.
        </p>

        <div className="community-cta__progress" aria-label={`Собрано ${memories} из ${goal} воспоминаний`}>
          <div className="community-cta__progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="community-cta__progress-label">
            <strong>{memories}</strong> из {goal} воспоминаний к цели на 6 месяцев
          </p>
        </div>

        <div className="community-cta__actions">
          <Link to="/share" className="community-cta__primary">
            Добавить своё воспоминание
          </Link>
          <Link to="/map" className="community-cta__secondary">
            Найти место на карте
          </Link>
        </div>

        <ul className="community-cta__hints">
          <li>Пригласите родственников дополнить семейную историю</li>
          <li>Сохраните память класса или двора — одной ссылкой</li>
          <li>Фото из альбома можно приложить к тексту</li>
        </ul>
      </div>
    </section>
  );
}
