import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';
import { LocalizedString } from './projects';

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface Facility {
  id: number;
  name: string | LocalizedString;
  icon: string | null;
}

export interface CreateFacilityPayload {
  name: { en: string; de: string; it: string };
  icon?: string | null;
}

export interface UpdateFacilityPayload {
  id: number;
  name: { en: string; de: string; it: string };
  icon?: string | null;
}

type FacilityApiItem = {
  id?: number;
  Id?: number;
  name?: string | LocalizedString;
  Name?: string | LocalizedString;
  icon?: string | null;
  Icon?: string | null;
};

function normalizeFacility(item: FacilityApiItem): Facility {
  return {
    id: item.id !== undefined ? item.id : (item.Id ?? 0),
    name: item.name !== undefined ? item.name : (item.Name ?? ''),
    icon: item.icon !== undefined ? item.icon : (item.Icon ?? null),
  };
}

/** GET /api/Facilities */
export async function getFacilities(): Promise<Facility[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Facilities`, {
      headers: { ...authHeader() },
      cache: 'no-store'
    });
    if (!res.ok) {
      console.warn('[Facilities] Fetch failed:', res.status);
      return [];
    }
    const json = await res.json();
    const items: FacilityApiItem[] = Array.isArray(json) ? json : (json.data ?? []);
    return items.map(normalizeFacility);
  } catch (error) {
    console.warn('Network error when fetching facilities:', error);
    return [];
  }
}

/** GET /api/Facilities/{id} */
export async function getFacilityById(id: number, lang: string = 'en'): Promise<Facility> {
  const res = await fetch(`${API_BASE_URL}/api/Facilities/${id}`, {
    headers: { ...authHeader(), 'Accept-Language': lang.toUpperCase() },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch facility.');
  const json = await res.json();
  return normalizeFacility(json.data ?? json);
}

/** POST /api/Facilities */
export async function createFacility(payload: CreateFacilityPayload): Promise<number> {
  const { name, icon = null } = payload;

  const res = await fetch(`${API_BASE_URL}/api/Facilities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ name, icon }),
  });
  if (!res.ok) throw new Error('Failed to create facility.');
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json.data ?? json;
  } catch {
    return parseInt(text, 10);
  }
}

/** PUT /api/Facilities */
export async function updateFacility(payload: UpdateFacilityPayload): Promise<number> {
  const { id, name, icon = null } = payload;

  const res = await fetch(`${API_BASE_URL}/api/Facilities`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ id, name, icon }),
  });
  if (!res.ok) throw new Error('Failed to update facility.');
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return json.data ?? json;
  } catch {
    return parseInt(text, 10);
  }
}

/** DELETE /api/Facilities/{id} */
export async function deleteFacility(id: number): Promise<boolean> {
  console.log(`[Facilities] Deleting facility ID: ${id}`);
  const res = await fetch(`${API_BASE_URL}/api/Facilities/${id}`, {
    method: 'DELETE',
    headers: { 'accept': 'application/json, text/plain, */*', ...authHeader() },
  });
  const text = await res.text();
  console.log(`[Facilities] Delete response status: ${res.status}, body:`, text);

  if (!res.ok) {
    let errorMsg = `Failed to delete facility (Status: ${res.status}).`;
    try {
      const json = JSON.parse(text);
      if (json.message) errorMsg = json.message;
    } catch {}
    throw new Error(errorMsg);
  }
  if (text.toLowerCase() === 'false') {
    throw new Error('Failed to delete facility (server returned false).');
  }
  try {
    const json = JSON.parse(text);
    if (json.success === false) {
      throw new Error(json.message || 'Failed to delete facility.');
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      if (!e.message.includes('JSON') && !e.message.includes('Unexpected token') && !e.message.includes('Unexpected end')) {
        throw e;
      }
    }
  }
  return text.toLowerCase() === 'true' || res.status === 200 || res.status === 204;
}
