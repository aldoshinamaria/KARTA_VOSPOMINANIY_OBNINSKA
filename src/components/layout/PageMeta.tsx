import { useEffect } from 'react';
import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/site';

interface PageMetaProps {
  title?: string;
  description?: string;
  path?: string;
}

const SITE_ORIGIN = 'https://zhivaya-pamyat-obninsk.ru';

export default function PageMeta({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
}: PageMetaProps) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_ORIGIN}${path}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', url, true);
    setMeta('og:locale', 'ru_RU', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
  }, [fullTitle, description, url]);

  return null;
}
