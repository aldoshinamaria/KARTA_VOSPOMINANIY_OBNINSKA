import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  buildExhibitPayload,
  fetchExhibitCatalog,
  getInitialExhibitIndex,
} from '@/api/storyOfTheDay';
import type { Memory, StoryOfTheDayPayload } from '@/types';

import '@/styles/story-of-the-day.css';
import { assetUrl } from '@/utils/assetUrl';

const EASE_MUSEUM = [0.22, 1, 0.36, 1] as const;

const fade = {
  hidden: { opacity: 0 },
  show: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.85, delay, ease: EASE_MUSEUM },
  }),
};

const exhibitReveal = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_MUSEUM },
  },
};

export default function StoryOfTheDay() {
  const [catalog, setCatalog] = useState<Memory[]>([]);
  const [payload, setPayload] = useState<StoryOfTheDayPayload | null>(null);
  const [exhibitIndex, setExhibitIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const readsBumped = useRef(false);
  const viewsBumped = useRef(false);

  useEffect(() => {
    fetchExhibitCatalog().then((list) => {
      setCatalog(list);
      setExhibitIndex(getInitialExhibitIndex(list));
    });
  }, []);

  useEffect(() => {
    if (!catalog.length) return;
    const memory = catalog[exhibitIndex];
    if (!memory) return;

    let cancelled = false;
    setLoading(true);

    const bumpReads = !readsBumped.current;
    if (bumpReads) readsBumped.current = true;

    const skipViews = viewsBumped.current;
    if (!skipViews) viewsBumped.current = true;

    buildExhibitPayload(memory, exhibitIndex, catalog.length, {
      bumpTodayReads: bumpReads,
      skipViewIncrement: skipViews,
    }).then((data) => {
      if (!cancelled) {
        setPayload(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [catalog, exhibitIndex]);

  const goToExhibit = (nextIndex: number) => {
    if (catalog.length === 0) return;
    const wrapped =
      ((nextIndex % catalog.length) + catalog.length) % catalog.length;
    setExhibitIndex(wrapped);
  };

  const handleShare = async () => {
    if (!payload) return;
    const url = `${window.location.origin}/story/${payload.memory.id}`;
    const text = `${payload.memory.title} — Живая память Обнинска`;

    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
        return;
      } catch {
        /* fallback */
      }
    }

    await navigator.clipboard.writeText(url);
    alert('Ссылка на историю скопирована');
  };

  if (!payload && loading) {
    return (
      <section className="story-day" id="story-of-the-day" aria-label="История дня">
        <div className="story-day__inner">
          <div className="story-day__loading">Открываем экспонат дня…</div>
        </div>
      </section>
    );
  }

  if (!payload) return null;

  const { memory, imageUrl, pullQuote, excerpt, stats, museum } = payload;
  const placeTitle = memory.place?.title ?? 'Обнинск';
  const quoteText = pullQuote.startsWith('«') ? pullQuote : `«${pullQuote}»`;

  return (
    <section
      className="story-day"
      id="story-of-the-day"
      aria-labelledby="story-day-heading"
      style={
        {
          '--story-ghost-stamp': `url(${assetUrl('/archive/hero/stamp.png')})`,
          '--story-ghost-map': `url(${assetUrl('/archive/hero/fragment-map.png')})`,
          '--story-ghost-note': `url(${assetUrl('/archive/hero/hand-note.png')})`,
          '--story-ghost-photo': `url(${assetUrl('/archive/hero/postcard.png')})`,
        } as React.CSSProperties
      }
    >
      <div className="story-day__ghosts" aria-hidden>
        <div className="story-day__ghost story-day__ghost--stamp" />
        <div className="story-day__ghost story-day__ghost--map" />
        <div className="story-day__ghost story-day__ghost--note" />
        <div className="story-day__ghost story-day__ghost--photo" />
      </div>

      <div className="story-day__inner">
        <header className="story-day__registry">
          <p className="story-day__registry-id">
            Экспонат дня №{museum.inventoryNumber}
          </p>
          <p className="story-day__registry-archive">Архив памяти Обнинска</p>
          <h2 id="story-day-heading" className="story-day__title">
            История дня
          </h2>
          <p className="story-day__lead">
            Каждый день витрина открывает один архивный артефакт — воспоминание
            жителя города.
          </p>
        </header>

        <AnimatePresence mode="wait">
          <motion.article
            key={memory.id}
            className="story-day__exhibit"
            variants={exhibitReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: '-60px' }}
          >
            <div className="story-day__stand">
              <motion.div
                className="story-day__photo-col"
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-80px' }}
                custom={0}
              >
                <div className="story-day__photo-physical">
                  <div className="story-day__photo-mat">
                    <div className="story-day__photo-frame">
                      <div className="story-day__photo-paper">
                        <img src={imageUrl} alt="" loading="eager" />
                      </div>
                      <figcaption className="story-day__photo-caption">
                        <span className="story-day__photo-caption-city">
                          Обнинск
                        </span>
                        <span className="story-day__photo-caption-meta">
                          {memory.year} · {placeTitle}
                        </span>
                        <span className="story-day__photo-caption-inv">
                          Инв. № ОБН-{museum.inventoryNumber}
                        </span>
                      </figcaption>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="story-day__dossier"
                variants={exhibitReveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-48px' }}
              >
                <div className="story-day__stamp" aria-hidden>
                  <span>Архив</span>
                  <span>Обнинск</span>
                  <span>Народная</span>
                  <span>память</span>
                </div>

                <div className="story-day__plaque" aria-label="Музейная табличка">
                  <table className="story-day__plaque-table">
                    <tbody>
                      <tr>
                        <th scope="row">Инвентарный номер</th>
                        <td>ОБН-{museum.inventoryNumber}</td>
                      </tr>
                      <tr>
                        <th scope="row">Категория</th>
                        <td>{memory.category}</td>
                      </tr>
                      <tr>
                        <th scope="row">Период</th>
                        <td>{museum.period}</td>
                      </tr>
                      <tr>
                        <th scope="row">Место</th>
                        <td>{placeTitle}</td>
                      </tr>
                      <tr>
                        <th scope="row">Автор</th>
                        <td>{memory.name}</td>
                      </tr>
                      <tr>
                        <th scope="row">Дата передачи в архив</th>
                        <td>{museum.archivedAt}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="story-day__story-title">{memory.title}</h3>

                <motion.blockquote
                  className="story-day__quote"
                  variants={fade}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={0.35}
                >
                  <span className="story-day__quote-mark" aria-hidden>
                    «
                  </span>
                  <p className="story-day__quote-text">
                    {quoteText.replace(/^«|»$/g, '')}
                  </p>
                  <span className="story-day__quote-mark story-day__quote-mark--end" aria-hidden>
                    »
                  </span>
                </motion.blockquote>

                <p className="story-day__excerpt">{excerpt}</p>

                <div className="story-day__value">
                  <h4 className="story-day__value-title">
                    Историческая ценность воспоминания
                  </h4>
                  <ul className="story-day__value-list">
                    {museum.historicalValue.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="story-day__listen"
                  disabled
                  aria-disabled="true"
                  title="Аудиоверсия появится в следующем обновлении архива"
                >
                  <span className="story-day__listen-icon" aria-hidden>
                    🔊
                  </span>
                  Прослушать воспоминание
                </button>

                <div className="story-day__actions">
                  <Link
                    to={`/story/${memory.id}`}
                    className="story-day__btn-primary"
                  >
                    Читать полностью
                  </Link>
                  <Link
                    to={`/map?place=${memory.place_id}`}
                    className="story-day__btn-secondary"
                  >
                    Показать на карте
                  </Link>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="story-day__btn-secondary"
                  >
                    Поделиться историей
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="story-day__ledger">
              <ul className="story-day__ledger-stats">
                <li>
                  <span className="story-day__ledger-num">
                    {stats.todayReads}
                  </span>
                  <span className="story-day__ledger-label">
                    Сегодня прочитали
                  </span>
                </li>
                <li>
                  <span className="story-day__ledger-num">
                    {stats.totalViews.toLocaleString('ru-RU')}
                  </span>
                  <span className="story-day__ledger-label">
                    Всего просмотров
                  </span>
                </li>
                <li>
                  <span className="story-day__ledger-num">
                    {stats.archiveCount}
                  </span>
                  <span className="story-day__ledger-label">
                    Всего воспоминаний в архиве
                  </span>
                </li>
              </ul>
            </div>
          </motion.article>
        </AnimatePresence>

        <nav
          className="story-day__nav"
          aria-label="Навигация по экспонатам архива"
        >
          <button
            type="button"
            className="story-day__nav-btn"
            onClick={() => goToExhibit(exhibitIndex - 1)}
            disabled={catalog.length <= 1}
          >
            <span className="story-day__nav-arrow" aria-hidden>
              ←
            </span>
            Предыдущий экспонат
          </button>
          <span className="story-day__nav-counter">
            {exhibitIndex + 1} / {catalog.length}
          </span>
          <button
            type="button"
            className="story-day__nav-btn story-day__nav-btn--next"
            onClick={() => goToExhibit(exhibitIndex + 1)}
            disabled={catalog.length <= 1}
          >
            Следующий экспонат
            <span className="story-day__nav-arrow" aria-hidden>
              →
            </span>
          </button>
        </nav>
      </div>
    </section>
  );
}
