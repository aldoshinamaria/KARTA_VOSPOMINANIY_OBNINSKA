import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App';
import ErrorBoundary from '@/components/ErrorBoundary';
import { fixLeafletDefaultIcons } from '@/utils/leafletIcons';

fixLeafletDefaultIcons();

const root = document.getElementById('root');
if (!root) {
  throw new Error('Элемент #root не найден');
}

createRoot(root).render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>,
);
