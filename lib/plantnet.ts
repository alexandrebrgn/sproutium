export type Organ = 'leaf' | 'flower' | 'fruit' | 'bark' | 'auto';

export type PlantNetTaxon = {
  scientificName: string;
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
};

export type PlantNetSpecies = {
  scientificName: string;
  scientificNameWithoutAuthor: string;
  scientificNameAuthorship: string;
  commonNames: string[];
  family: PlantNetTaxon;
  genus: PlantNetTaxon;
};

export type PlantNetImage = {
  organ: string;
  url: { o: string; m: string; s: string };
};

export type PlantNetResult = {
  score: number;
  species: PlantNetSpecies;
  images: PlantNetImage[];
  gbif?: { id: string };
};

export class PlantNetError extends Error {
  code: 'NO_API_KEY' | 'INVALID_KEY' | 'QUOTA' | 'NO_MATCH' | 'NETWORK' | 'UNKNOWN';
  constructor(code: PlantNetError['code'], message: string) {
    super(message);
    this.code = code;
  }
}

const ENDPOINT = 'https://my-api.plantnet.org/v2/identify/all';

export async function identify(
  photoUri: string,
  organ: Organ,
  lang: 'fr' | 'en' = 'en',
): Promise<PlantNetResult[]> {
  const apiKey = process.env.EXPO_PUBLIC_PLANTNET_API_KEY;
  if (!apiKey) {
    throw new PlantNetError('NO_API_KEY', 'Missing EXPO_PUBLIC_PLANTNET_API_KEY');
  }

  const form = new FormData();
  const filename = photoUri.split('/').pop() || 'plant.jpg';
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

  form.append('images', {
    uri: photoUri,
    name: filename,
    type: mime,
  } as unknown as Blob);
  form.append('organs', organ);

  const url = `${ENDPOINT}?api-key=${encodeURIComponent(apiKey)}&lang=${lang}&include-related-images=true&nb-results=5&detailed=true`;

  let response: Response;
  try {
    response = await fetch(url, { method: 'POST', body: form });
  } catch {
    throw new PlantNetError('NETWORK', 'Network request failed');
  }

  if (response.status === 401) {
    throw new PlantNetError('INVALID_KEY', 'Invalid Pl@ntNet API key');
  }
  if (response.status === 429) {
    throw new PlantNetError('QUOTA', 'Daily quota exceeded');
  }
  if (response.status === 404) {
    return [];
  }
  if (!response.ok) {
    throw new PlantNetError('UNKNOWN', `Pl@ntNet error ${response.status}`);
  }

  const data = (await response.json()) as { results?: PlantNetResult[] };
  console.log('Pl@ntNet API response:', data.results);
  return data.results ?? [];
}
