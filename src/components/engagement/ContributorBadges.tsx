const BADGES = [
  { id: 'voice', label: 'Голос поколения', desc: 'Поделились воспоминанием' },
  { id: 'keeper', label: 'Хранитель истории', desc: '3+ истории в архиве' },
  { id: 'explorer', label: 'Исследователь Обнинска', desc: '10+ мест на карте' },
  { id: 'family', label: 'Семейный архивист', desc: 'Семейная история' },
] as const;

export default function ContributorBadges() {
  const submitted = parseInt(
    localStorage.getItem('obninsk_stories_submitted') ?? '0',
    10,
  );

  return (
    <aside className="contributor-badges" aria-label="Вклад в память города">
      <p className="contributor-badges__title">Вклад в память города</p>
      <ul className="contributor-badges__list">
        {BADGES.map((b, i) => {
          const unlocked = i === 0 ? submitted > 0 : false;
          return (
            <li
              key={b.id}
              className={`contributor-badges__item ${unlocked ? 'contributor-badges__item--on' : ''}`}
            >
              <span className="contributor-badges__label">{b.label}</span>
              <span className="contributor-badges__desc">{b.desc}</span>
            </li>
          );
        })}
      </ul>
      {submitted === 0 && (
        <p className="contributor-badges__hint">
          Отправьте первую историю — получите значок «Голос поколения».
        </p>
      )}
    </aside>
  );
}
