import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface Facility {
  id: number;
  name: string | { en?: string; de?: string; pl?: string; [key: string]: unknown };
}

/** GET /api/Facilities */
export async function getFacilities(): Promise<Facility[]> {
  const res = await fetch(`${API_BASE_URL}/api/Facilities`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch facilities.');
  const json = await res.json();
  if (Array.isArray(json)) return json;
  return json.data ?? [];
}

/** GET /api/Facilities/{id} */
export async function getFacilityById(id: number): Promise<Facility> {
  const res = await fetch(`${API_BASE_URL}/api/Facilities/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch facility.');
  const json = await res.json();
  return json.data ?? json;
}

/** POST /api/Facilities */
export async function createFacility(name: { en: string; de: string; pl: string }): Promise<number> {
  const mappedName = { En: name.en, De: name.de, Pl: name.pl };
  const res = await fetch(`${API_BASE_URL}/api/Facilities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ name: mappedName }),
  });
  if (!res.ok) throw new Error('Failed to create facility.');
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/Facilities */
export async function updateFacility(id: number, name: { en: string; de: string; pl: string }): Promise<number> {
  const mappedName = { En: name.en, De: name.de, Pl: name.pl };
  const res = await fetch(`${API_BASE_URL}/api/Facilities`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ id, name: mappedName }),
  });
  if (!res.ok) throw new Error('Failed to update facility.');
  const json = await res.json();
  return json.data ?? json;
}

/** DELETE /api/Facilities/{id} */
export async function deleteFacility(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Facilities/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete facility.');
}
