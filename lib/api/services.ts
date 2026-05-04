import { API_BASE_URL } from './config';


export interface Service {
  id: number;
  name: string;
}

export interface CreateServicePayload {
  name: string;
}

export interface UpdateServicePayload {
  id: number;
  name: string;
}

function getAuthHeader(): Record<string, string> {
  const token = typeof document !== 'undefined' 
    ? document.cookie.match(/(?:^|; )rg_at=([^;]*)/)?.[1] 
    : null;
  if (!token) console.warn('[Services] No auth token found in cookies (rg_at)');
  return token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {};
}

/** GET /api/Services */
export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE_URL}/api/Services`, {
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch services.');
  }
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    let items = [];
    if (json.data && Array.isArray(json.data)) items = json.data;
    else if (Array.isArray(json)) items = json;
    else if (json.success === false) throw new Error(json.message || 'Failed to fetch services.');

    // Normalize keys in case the API returns PascalCase
    return items.map((item: { id?: number; Id?: number; name?: string; Name?: string }) => ({
      id: item.id !== undefined ? item.id : (item.Id ?? 0),
      name: item.name !== undefined ? item.name : (item.Name ?? ''),
    }));
  } catch {
    return [];
  }
}

/** POST /api/Services */
export async function createService(payload: CreateServicePayload): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/Services`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader() 
    },
    body: JSON.stringify(payload),
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
  const res = await fetch(`${API_BASE_URL}/api/Services`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader() 
    },
    body: JSON.stringify(payload),
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
  const res = await fetch(`${API_BASE_URL}/api/Services/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  const text = await res.text();
  console.log('[Services] Delete Response:', text);
  if (!res.ok) {
    throw new Error(text || 'Failed to delete service.');
  }
  return text.toLowerCase() === 'true' || res.status === 200 || res.status === 204;
}
