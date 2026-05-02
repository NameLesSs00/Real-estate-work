import { API_BASE_URL } from './config';
import { ApiResponse } from './auth';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Location {
  id: number;
  country: string;
  city: string;
  district: string;
  street: string | null;
  latitude: string | null;
  longitude: string | null;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
}

export interface LocationsPage {
  items: Location[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateLocationPayload {
  city: string;
  district: string;
  street: string;
  country: string;
  latitude: null;
  longitude: null;
}

export interface UpdateLocationPayload {
  id: number;
  city: string;
  district: string;
  street: string;
  country: string;
  latitude: null;
  longitude: null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAuthHeader(): Record<string, string> {
  const token =
    typeof document !== 'undefined'
      ? document.cookie.match(/(?:^|; )rg_at=([^;]*)/)?.[1]
      : null;
  return token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {};
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

/** GET /api/Locations?pageNumber=N */
export async function getLocations(pageNumber = 1): Promise<LocationsPage> {
  const res = await fetch(
    `${API_BASE_URL}/api/Locations?pageNumber=${pageNumber}`,
    { headers: { ...getAuthHeader() } }
  );
  if (!res.ok) {
    const text = await res.text();
    console.error('[Locations] Fetch failed:', res.status, text);
    throw new Error('Failed to fetch locations.');
  }
  const json: ApiResponse<LocationsPage> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Locations] Fetch error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to fetch locations.');
  }
  return json.data;
}

/** POST /api/Locations */
export async function createLocation(
  payload: CreateLocationPayload
): Promise<Location> {
  const res = await fetch(`${API_BASE_URL}/api/Locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Locations] Create failed:', res.status, text);
    throw new Error('Failed to create location.');
  }
  const json: ApiResponse<Location> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Locations] Create error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to create location.');
  }
  return json.data;
}

/** PUT /api/Locations */
export async function updateLocation(
  payload: UpdateLocationPayload
): Promise<Location> {
  const res = await fetch(`${API_BASE_URL}/api/Locations`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Locations] Update failed:', res.status, text);
    throw new Error('Failed to update location.');
  }
  const json: ApiResponse<Location> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Locations] Update error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to update location.');
  }
  return json.data;
}

/** DELETE /api/Locations/{id} */
export async function deleteLocation(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Locations/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Locations] Delete failed:', res.status, text);
    throw new Error('Failed to delete location.');
  }
}
