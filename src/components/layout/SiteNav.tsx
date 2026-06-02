import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_NAME } from '@/constants/site';

const links = [
  { to: '/', label: 'Архив', end: true },
  { to: '/map', label: 'Карта памяти' },
  { to: '/then-and-now', label: 'Тогда и сейчас' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-museum-copper/10 bg-museum-cream/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:py-4">
        <Link to="/" className="group min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-museum-copper">
            Обнинск
          </p>
          <p className="font-display text-lg font-semibold text-museum-ink transition group-hover:text-museum-copper sm:text-xl">
            {SITE_NAME}
          </p>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm transition ${
                  isActive
                    ? 'bg-museum-copper text-museum-cream'
                    : 'text-museum-ink/70 hover:bg-museum-warm hover:text-museum-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/share"
            className="ml-2 rounded-full bg-museum-copper px-4 py-1.5 text-sm font-medium text-museum-cream"
          >
            Добавить историю
          </Link>
          <Link
            to="/admin"
            className="ml-1 text-xs text-museum-ink/40 hover:text-museum-copper"
          >
            Админ
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-lg border border-museum-copper/20 px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Меню"
        >
          {open ? '✕' : 'Меню'}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-museum-copper/10 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-museum-ink/80 hover:bg-museum-warm"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/share"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-museum-copper px-3 py-2 text-center text-sm font-medium text-museum-cream"
              >
                Добавить историю
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
