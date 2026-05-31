import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ArchiveLayout from '@/layouts/ArchiveLayout';
import HomePage from '@/pages/HomePage';

const MapPage = lazy(() => import('@/pages/MapPage'));
const PlacePage = lazy(() => import('@/pages/PlacePage'));
const StoryPage = lazy(() => import('@/pages/StoryPage'));
const ShareStoryPage = lazy(() => import('@/pages/ShareStoryPage'));
const ThenNowPage = lazy(() => import('@/pages/ThenNowPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center font-display text-museum-copper/60">
      Загрузка…
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<ArchiveLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/story/:id" element={<StoryPage />} />
          <Route path="/share" element={<ShareStoryPage />} />
          <Route path="/then-and-now" element={<ThenNowPage />} />
        </Route>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}
