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
    if (Array.isArray(json)) return json;
    return json.data ?? [];
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
  return json.data ?? json;
}

/** POST /api/Facilities */
export async function createFacility(name: { en: string; de: string; pl: string }): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/Facilities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ name }),
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
export async function updateFacility(id: number, name: { en: string; de: string; pl: string }): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/Facilities`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ id, name }),
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
