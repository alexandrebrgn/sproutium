export type WikiSummary = {
  title: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
  content_urls: { desktop: { page: string }; mobile: { page: string } };
  lang: 'fr' | 'en';
};

async function fetchWiki(name: string, lang: 'fr' | 'en'): Promise<WikiSummary | null> {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    name,
  )}?redirect=true`;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === 'disambiguation') return null;
    return { ...data, lang } as WikiSummary;
  } catch {
    return null;
  }
}

export async function getWikipediaSummary(
  scientificName: string,
  preferredLang: 'fr' | 'en',
): Promise<WikiSummary | null> {
  const primary = await fetchWiki(scientificName, preferredLang);
  if (primary) return primary;
  const fallback: 'fr' | 'en' = preferredLang === 'fr' ? 'en' : 'fr';
  return fetchWiki(scientificName, fallback);
}
