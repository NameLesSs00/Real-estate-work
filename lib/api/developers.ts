import { API_BASE_URL } from './config';
import { ApiResponse } from './auth';

import { getHeaders } from './common';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GalleryImage {
  id: number;
  imageUrl: string;
}

export interface Developer {
  id: number;
  name: string;
  description: string;
  logoImage: string | null;
  gallery: GalleryImage[];
  projects: { id: number; name: string }[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
}

export interface DevelopersPage {
  items: Developer[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateDeveloperPayload {
  name: string;
  description: string;
}

export interface UpdateDeveloperPayload {
  id: number;
  name: string;
  description: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────



/** Prefix a relative image path from the API with the base URL */
export function resolveImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path}`;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

/** GET /api/Developers */
export async function getDevelopers(pageNumber = 1, searchKeyword = ''): Promise<DevelopersPage> {
  const base = typeof window !== 'undefined' ? window.location.origin : undefined;
  const url = new URL(`${API_BASE_URL}/api/Developers`, base);
  url.searchParams.append('pageNumber', pageNumber.toString());
  if (searchKeyword) url.searchParams.append('SearchKeyword', searchKeyword);

  const res = await fetch(url.toString(), { 
    headers: { ...getHeaders() } 
  });
  if (!res.ok) {
    throw new Error('Failed to fetch developers.');
  }
  const json: ApiResponse<DevelopersPage> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || 'Failed to fetch developers.');
  }
  return json.data;
}

/** GET /api/Developers/{id} */
export async function getDeveloperById(id: number): Promise<Developer> {
  const res = await fetch(`${API_BASE_URL}/api/Developers/${id}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch developer.');
  }
  const json: ApiResponse<Developer> = await res.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || 'Failed to fetch developer.');
  }
  return json.data;
}

/** POST /api/Developers */
export async function createDeveloper(payload: CreateDeveloperPayload): Promise<number | Developer> {
  const res = await fetch(`${API_BASE_URL}/api/Developers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Developers] Create failed:', res.status, text);
    throw new Error('Failed to create developer.');
  }
  const json: ApiResponse<number | Developer> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Developers] Create error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to create developer.');
  }
  return json.data;
}

/** PUT /api/Developers */
export async function updateDeveloper(payload: UpdateDeveloperPayload): Promise<number | Developer> {
  const res = await fetch(`${API_BASE_URL}/api/Developers`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Developers] Update failed:', res.status, text);
    throw new Error('Failed to update developer.');
  }
  const json: ApiResponse<number | Developer> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Developers] Update error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to update developer.');
  }
  return json.data;
}

/** DELETE /api/Developers/{id} */
export async function deleteDeveloper(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Developers/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Developers] Delete failed:', res.status, text);
    throw new Error('Failed to delete developer.');
  }
}

/** POST /api/Developers/{id}/logo  (multipart/form-data) */
export async function uploadDeveloperLogo(id: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE_URL}/api/Developers/${id}/logo`, {
    method: 'POST',
    headers: { ...getHeaders() },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Developers] Logo upload failed:', res.status, text);
    throw new Error('Failed to upload logo.');
  }
}

/** DELETE /api/Developers/{id}/logo */
export async function deleteDeveloperLogo(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Developers/${id}/logo`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Developers] Logo delete failed:', res.status, text);
    throw new Error('Failed to delete logo.');
  }
}

/** POST /api/Developers/{id}/gallery  (multipart/form-data, multiple files) */
export async function uploadGalleryImages(id: number, files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const res = await fetch(`${API_BASE_URL}/api/Developers/${id}/gallery`, {
    method: 'POST',
    headers: { ...getHeaders() },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Developers] Gallery upload failed:', res.status, text);
    throw new Error('Failed to upload gallery images.');
  }
  const json: ApiResponse<string[]> = await res.json();
  return json.data ?? [];
}

/** DELETE /api/Developers/gallery/{imageId} */
export async function deleteGalleryImage(imageId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Developers/gallery/${imageId}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Developers] Gallery image delete failed:', res.status, text);
    throw new Error('Failed to delete gallery image.');
  }
}
