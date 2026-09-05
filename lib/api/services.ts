import { API_BASE_URL } from './config';
import { getHeaders } from './common';
import { LocalizedString } from './projects';


export interface Service {
  id: number;
  name: string | LocalizedString;
  icon: string | null;
}

export interface CreateServicePayload {
  name: { en: string; de: string; it: string };
  icon?: string | null;
}

export interface UpdateServicePayload {
  id: number;
  name: { en: string; de: string; it: string };
  icon?: string | null;
}

type ServiceApiItem = {
  id?: number;
  Id?: number;
  name?: string | LocalizedString;
  Name?: string | LocalizedString;
  icon?: string | null;
  Icon?: string | null;
};

function normalizeService(item: ServiceApiItem): Service {
  return {
    id: item.id !== undefined ? item.id : (item.Id ?? 0),
    name: item.name !== undefined ? item.name : (item.Name ?? ''),
    icon: item.icon !== undefined ? item.icon : (item.Icon ?? null),
  };
}

/** GET /api/Services */
export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Services`, {
      headers: { ...getHeaders() },
      cache: 'no-store'
    });
    if (!res.ok) {
      console.warn('[Services] Fetch failed:', res.status);
      return [];
    }
    const text = await res.text();
    const json = JSON.parse(text);
    let items = [];
    if (json.data && Array.isArray(json.data)) items = json.data;
    else if (Array.isArray(json)) items = json;
    else if (json.success === false) throw new Error(json.message || 'Failed to fetch services.');

    // Normalize keys in case the API returns PascalCase
    return items.map((item: ServiceApiItem) => normalizeService(item));
  } catch (error) {
    console.warn('Network error when fetching services:', error);
    return [];
  }
}

/** GET /api/Services/{id} */
export async function getServiceById(id: number, lang: string = 'en'): Promise<Service> {
  const res = await fetch(`${API_BASE_URL}/api/Services/${id}`, {
    headers: { ...getHeaders(lang) },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch service.');
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    const item = json.data ?? json;
    return normalizeService(item);
  } catch {
    throw new Error('Failed to parse service.');
  }
}

/** POST /api/Services */
export async function createService(payload: CreateServicePayload): Promise<number> {
  const { name, icon = null } = payload;
  
  const res = await fetch(`${API_BASE_URL}/api/Services`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getHeaders() 
    },
    body: JSON.stringify({ name, icon }),
  });
  const text = await res.text();
  console.log('[Services] Create Response:', text);
  if (!res.ok) {
    throw new Error(text || 'Failed to create service.');
  }
  try {
    const json = JSON.parse(text);
    if (json.success) return json.data;
    if (json.message) throw new Error(json.message);
    return json; 
  } catch {
    return parseInt(text, 10) || 0;
  }
}

/** PUT /api/Services */
export async function updateService(payload: UpdateServicePayload): Promise<number> {
  const { id, name, icon = null } = payload;

  const res = await fetch(`${API_BASE_URL}/api/Services`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getHeaders() 
    },
    body: JSON.stringify({ id, name, icon }),
  });
  const text = await res.text();
  console.log('[Services] Update Response:', text);
  if (!res.ok) {
    throw new Error(text || 'Failed to update service.');
  }
  try {
    const json = JSON.parse(text);
    if (json.success) return json.data;
    if (json.message) throw new Error(json.message);
    return json;
  } catch {
    return parseInt(text, 10) || 0;
  }
}

/** DELETE /api/Services/{id} */
export async function deleteService(id: number): Promise<boolean> {
  console.log(`[Services] Deleting service ID: ${id}`);
  const res = await fetch(`${API_BASE_URL}/api/Services/${id}`, {
    method: 'DELETE',
    headers: { 'accept': 'application/json, text/plain, */*', ...getHeaders() },
  });
  const text = await res.text();
  console.log(`[Services] Delete response status: ${res.status}, body:`, text);

  if (!res.ok) {
    let errorMsg = `Failed to delete service (Status: ${res.status}).`;
    try {
      const json = JSON.parse(text);
      if (json.message) errorMsg = json.message;
    } catch {}
    throw new Error(errorMsg);
  }
  if (text.toLowerCase() === 'false') {
    throw new Error('Failed to delete service (server returned false).');
  }
  try {
    const json = JSON.parse(text);
    if (json.success === false) {
      throw new Error(json.message || 'Failed to delete service.');
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
