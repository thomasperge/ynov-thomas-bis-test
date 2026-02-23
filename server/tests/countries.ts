const API_URL = "https://api.first.org/data/v1/countries?limit=1000";

interface CountryEntry {
  country: string;
  region: string;
}

interface ApiResponse {
  data: Record<string, CountryEntry>;
}

/**
 * Retourne tous les pays dont le nom commence par la chaîne donnée (insensible à la casse).
 */
export async function getCountriesStartingWith(srch: string): Promise<string[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = (await res.json()) as ApiResponse;
  const data = json.data ?? {};
  const prefix = srch.trim().toLowerCase();
  const names: string[] = [];
  for (const code of Object.keys(data)) {
    const name = data[code].country;
    if (name && name.toLowerCase().startsWith(prefix)) {
      names.push(name);
    }
  }
  return names.sort((a, b) => a.localeCompare(b));
}
