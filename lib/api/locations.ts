
import { API_BASE_URL } from './config';
import { ApiResponse } from './auth';
import { getHeaders } from './common';

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

export interface LocalizedString {
  en: string;
  de: string;
  pl: string;
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
  city: LocalizedString;
  district: LocalizedString;
  street?: string;
  country?: string;
  latitude: string;
  longitude: string;
}

export interface UpdateLocationPayload {
  id: number;
  city: LocalizedString;
  district: LocalizedString;
  street?: string;
  country?: string;
  latitude: string;
  longitude: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────



// ─── Endpoints ───────────────────────────────────────────────────────────────

/** GET /api/Locations?pageNumber=N */
export async function getLocations(pageNumber = 1): Promise<LocationsPage> {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/Locations?pageNumber=${pageNumber}`,
      { headers: { ...getHeaders() } }
    );
    if (!res.ok) {
      const text = await res.text();
      console.warn('[Locations] Fetch failed:', res.status, text);
      return { items: [], pageNumber, totalPages: 1, totalCount: 0, hasPreviousPage: false, hasNextPage: false };
    }
    const json: ApiResponse<LocationsPage> = await res.json();
    if (!json.success || !json.data) {
      console.warn('[Locations] Fetch error:', json.message, json.errors);
      return { items: [], pageNumber, totalPages: 1, totalCount: 0, hasPreviousPage: false, hasNextPage: false };
    }
    return json.data;
  } catch (error) {
    console.warn('Network error when fetching locations:', error);
    return { items: [], pageNumber, totalPages: 1, totalCount: 0, hasPreviousPage: false, hasNextPage: false };
  }
}

/** GET /api/Locations/{id} */
export async function getLocationById(id: number, lang = 'en'): Promise<Location> {
  const dummy: Location = { id, country: '', city: '', district: '', street: null, latitude: null, longitude: null, createdBy: '', createdAt: '', updatedBy: '', updatedAt: null };
  try {
    const res = await fetch(`${API_BASE_URL}/api/Locations/${id}`, {
      headers: { ...getHeaders(lang) }
    });
    if (!res.ok) {
      console.warn('[Locations] Fetch by ID failed:', res.status);
      return dummy;
    }
    const json: ApiResponse<Location> = await res.json();
    if (!json.success || !json.data) {
      return dummy;
    }
    return json.data;
  } catch (error) {
    console.warn('Network error when fetching location by ID:', error);
    return dummy;
  }
}

/** POST /api/Locations */
export async function createLocation(
  payload: CreateLocationPayload
): Promise<Location> {
  const res = await fetch(`${API_BASE_URL}/api/Locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
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
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
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
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Locations] Delete failed:', res.status, text);
    throw new Error('Failed to delete location.');
  }
}
