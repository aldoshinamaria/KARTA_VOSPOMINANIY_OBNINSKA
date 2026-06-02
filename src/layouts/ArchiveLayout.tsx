import { Link, Outlet, useLocation } from 'react-router-dom';
import SiteNav from '@/components/layout/SiteNav';
import SiteFooter from '@/components/layout/SiteFooter';

export default function ArchiveLayout() {
  const { pathname } = useLocation();
  const hideSticky = pathname === '/share';

  return (
    <div className="flex min-h-[100dvh] flex-col bg-museum-paper">
      <SiteNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      {!hideSticky && (
        <Link to="/share" className="sticky-share-cta">
          + Ваша история
        </Link>
      )}
    </div>
  );
}
