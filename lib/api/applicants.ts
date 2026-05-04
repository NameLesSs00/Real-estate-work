import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';
import { ApiResponse } from './auth';

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface Applicant {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface PaginatedApplicants {
  items: Applicant[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** GET /api/Applicants */
export async function getApplicants(page = 1, size = 10): Promise<PaginatedApplicants> {
  const params = new URLSearchParams({ PageNumber: String(page), PageSize: String(size) });
  const res = await fetch(`${API_BASE_URL}/api/Applicants?${params}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch applicants.');
  const json: ApiResponse<PaginatedApplicants> = await res.json();
  return json.data ?? (json as unknown as PaginatedApplicants);
}

/** GET /api/Applicants/{id} */
export async function getApplicantById(id: number): Promise<Applicant> {
  const res = await fetch(`${API_BASE_URL}/api/Applicants/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch applicant.');
  const json: ApiResponse<Applicant> = await res.json();
  return json.data ?? (json as unknown as Applicant);
}

/** POST /api/Applicants */
export async function createApplicant(payload: Omit<Applicant, 'id'>): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/Applicants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create applicant.');
  const json: ApiResponse<number> = await res.json();
  return json.data ?? (json as unknown as number);
}

/** PUT /api/Applicants */
export async function updateApplicant(payload: Applicant): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/Applicants`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update applicant.');
  const json: ApiResponse<number> = await res.json();
  return json.data ?? (json as unknown as number);
}

/** DELETE /api/Applicants/{id} */
export async function deleteApplicant(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Applicants/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete applicant.');
}
