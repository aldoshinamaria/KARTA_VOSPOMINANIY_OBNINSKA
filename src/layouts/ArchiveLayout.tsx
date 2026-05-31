import { Outlet } from 'react-router-dom';
import SiteNav from '@/components/layout/SiteNav';
import SiteFooter from '@/components/layout/SiteFooter';

export default function ArchiveLayout() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-museum-paper">
      <SiteNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
