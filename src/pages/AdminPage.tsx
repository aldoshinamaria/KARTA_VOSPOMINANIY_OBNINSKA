import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  adminDeleteMemory,
  adminDeletePlace,
  adminFetchMemories,
  adminFetchPlaces,
  adminUpdateMemoryFlags,
  adminUpdateMemoryStatus,
  adminUpdatePlaceStatus,
  verifyAdminPassword,
} from '@/api/admin';
import { SITE_NAME } from '@/constants/site';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Memory, ModerationStatus, Place } from '@/types';

const ADMIN_KEY = 'karta_admin_password';

type AdminTab = 'places' | 'memories';

export default function AdminPage() {
  const [password, setPassword] = useState(
    () => sessionStorage.getItem(ADMIN_KEY) ?? '',
  );
  const [inputPass, setInputPass] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>('places');
  const [places, setPlaces] = useState<Place[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadData = useCallback(async (pass: string) => {
    setLoading(true);
    setActionError(null);
    try {
      const [p, m] = await Promise.all([
        adminFetchPlaces(pass),
        adminFetchMemories(pass),
      ]);
      setPlaces(p);
      setMemories(m);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Ошибка загрузки данных',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!password || !isSupabaseConfigured) return;

    verifyAdminPassword(password).then((ok) => {
      if (ok) {
        setAuthenticated(true);
        loadData(password);
      } else {
        sessionStorage.removeItem(ADMIN_KEY);
        setPassword('');
      }
    });
  }, [password, loadData]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!isSupabaseConfigured) {
      setAuthError('Supabase не настроен');
      return;
    }

    const ok = await verifyAdminPassword(inputPass);
    if (!ok) {
      setAuthError('Неверный пароль');
      return;
    }

    sessionStorage.setItem(ADMIN_KEY, inputPass);
    setPassword(inputPass);
    setAuthenticated(true);
    await loadData(inputPass);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_KEY);
    setPassword('');
    setAuthenticated(false);
    setInputPass('');
  };

  const runAction = async (fn: () => Promise<void>) => {
    setActionError(null);
    try {
      await fn();
      await loadData(password);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Не удалось выполнить действие',
      );
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-museum-paper">
        <AdminBar />
        <main className="mx-auto max-w-md p-6 text-center">
          <p className="text-museum-rose">
            Подключите Supabase в .env для работы админки.
          </p>
          <Link to="/" className="mt-4 inline-block text-museum-teal underline">
            На карту
          </Link>
        </main>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-museum-paper">
        <AdminBar />
        <main className="mx-auto flex max-w-sm flex-col px-4 py-12">
          <h2 className="text-xl font-semibold">Вход в админку</h2>
          <p className="mt-2 text-sm text-museum-ink/60">
            Пароль задаётся в Supabase (таблица admin_config, по умолчанию
            obninsk2026 — смените после деплоя).
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
              className="field-input"
              placeholder="Пароль"
              autoComplete="current-password"
            />
            {authError && (
              <p className="text-sm text-museum-rose">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-museum-teal py-2.5 text-sm font-medium text-white"
            >
              Войти
            </button>
          </form>
          <Link to="/" className="mt-6 text-center text-sm text-museum-teal">
            ← На карту
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-museum-paper">
      <AdminBar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Модерация</h2>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-museum-ink/60 underline"
          >
            Выйти
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          <TabButton active={tab === 'places'} onClick={() => setTab('places')}>
            Места ({places.length})
          </TabButton>
          <TabButton
            active={tab === 'memories'}
            onClick={() => setTab('memories')}
          >
            Воспоминания ({memories.length})
          </TabButton>
        </div>

        {actionError && (
          <p className="mb-4 rounded-lg bg-museum-rose/10 px-3 py-2 text-sm text-museum-rose">
            {actionError}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-museum-ink/50">Загрузка…</p>
        ) : tab === 'places' ? (
          <ul className="space-y-3">
            {places.map((p) => (
              <motion.li
                key={p.id}
                layout
                className="rounded-xl border border-museum-ink/10 bg-white/70 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{p.title}</h3>
                    <p className="mt-1 text-sm text-museum-ink/60 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <ModerationActions
                  onApprove={() =>
                    runAction(() =>
                      adminUpdatePlaceStatus(password, p.id, 'approved'),
                    )
                  }
                  onReject={() =>
                    runAction(() =>
                      adminUpdatePlaceStatus(password, p.id, 'rejected'),
                    )
                  }
                  onDelete={() => {
                    if (confirm(`Удалить место «${p.title}»?`)) {
                      runAction(() => adminDeletePlace(password, p.id));
                    }
                  }}
                />
              </motion.li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-3">
            {memories.map((m) => (
              <motion.li
                key={m.id}
                layout
                className="rounded-xl border border-museum-ink/10 bg-white/70 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium">{m.title}</h3>
                    <p className="text-xs text-museum-teal">
                      {m.name} · {m.year} · {m.category}
                    </p>
                    <p className="mt-2 text-sm text-museum-ink/75">{m.story}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
                <ModerationActions
                  onApprove={() =>
                    runAction(() =>
                      adminUpdateMemoryStatus(password, m.id, 'approved'),
                    )
                  }
                  onReject={() =>
                    runAction(() =>
                      adminUpdateMemoryStatus(password, m.id, 'rejected'),
                    )
                  }
                  onDelete={() => {
                    if (confirm('Удалить это воспоминание?')) {
                      runAction(() => adminDeleteMemory(password, m.id));
                    }
                  }}
                />
                <MemoryPublicationFlags
                  memory={m}
                  onUpdate={(flags) =>
                    runAction(() =>
                      adminUpdateMemoryFlags(password, m.id, flags),
                    )
                  }
                />
              </motion.li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function AdminBar() {
  return (
    <header className="border-b border-museum-copper/10 bg-museum-cream px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link to="/" className="font-display text-lg text-museum-ink">
          {SITE_NAME}
        </Link>
        <span className="text-xs text-museum-ink/50">Модерация</span>
      </div>
    </header>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-museum-teal text-white'
          : 'bg-museum-ink/5 text-museum-ink/70 hover:bg-museum-ink/10'
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: ModerationStatus }) {
  const styles: Record<ModerationStatus, string> = {
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
  };
  const labels: Record<ModerationStatus, string> = {
    pending: 'На модерации',
    approved: 'Одобрено',
    rejected: 'Отклонено',
  };
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function MemoryPublicationFlags({
  memory,
  onUpdate,
}: {
  memory: Memory;
  onUpdate: (flags: {
    featured_story?: boolean;
    show_on_map?: boolean;
    published_archive?: boolean;
    status?: ModerationStatus;
  }) => void;
}) {
  return (
    <div className="admin-flags">
      <span className="w-full text-[10px] uppercase tracking-wider text-museum-ink/45">
        Публикация
      </span>
      <button
        type="button"
        className={memory.featured_story ? 'is-on' : ''}
        onClick={() => onUpdate({ featured_story: !memory.featured_story })}
      >
        История дня
      </button>
      <button
        type="button"
        className={memory.show_on_map !== false ? 'is-on' : ''}
        onClick={() => onUpdate({ show_on_map: !memory.show_on_map })}
      >
        На карте
      </button>
      <button
        type="button"
        className={memory.published_archive !== false ? 'is-on' : ''}
        onClick={() =>
          onUpdate({ published_archive: !memory.published_archive })
        }
      >
        В архиве
      </button>
      {memory.status === 'pending' && (
        <button type="button" onClick={() => onUpdate({ status: 'pending' })}>
          На проверке
        </button>
      )}
    </div>
  );
}

function ModerationActions({
  onApprove,
  onReject,
  onDelete,
}: {
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onApprove}
        className="rounded-lg bg-emerald-600/90 px-3 py-1.5 text-xs text-white"
      >
        Одобрить
      </button>
      <button
        type="button"
        onClick={onReject}
        className="rounded-lg bg-amber-600/90 px-3 py-1.5 text-xs text-white"
      >
        Отклонить
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg bg-museum-rose px-3 py-1.5 text-xs text-white"
      >
        Удалить
      </button>
    </div>
  );
}
