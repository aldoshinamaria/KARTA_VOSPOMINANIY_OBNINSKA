import { Link } from 'react-router-dom';
import { SITE_NAME, SITE_TAGLINE } from '@/constants/site';

export default function SiteFooter() {
  return (
    <footer className="border-t border-museum-copper/12 bg-museum-ink text-museum-cream/80">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-xl text-museum-cream">{SITE_NAME}</p>
            <p className="mt-1 max-w-sm text-sm text-museum-cream/55">
              {SITE_TAGLINE}. Истории сохраняют жители — для музеев, школ и будущих
              поколений.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/map" className="hover:text-museum-amber">
              Карта памяти
            </Link>
            <Link to="/then-and-now" className="hover:text-museum-amber">
              Тогда и сейчас
            </Link>
            <Link to="/share" className="hover:text-museum-amber">
              Поделиться историей
            </Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-museum-cream/35">
          © {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
