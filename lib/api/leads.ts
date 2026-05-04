import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface Lead {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  projectName: string;
  unitId: number;
  propertyName: string;
  notes: string;
  statusLead: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface PaginatedLeads {
  items: Lead[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateLeadPayload {
  fullName: string;
  email: string;
  phone: string;
  unitId?: number;
  notes?: string;
}

/** GET /api/Leads */
export async function getLeads(page = 1, size = 10, unitId?: number): Promise<PaginatedLeads> {
  const params = new URLSearchParams({ PageNumber: String(page), PageSize: String(size) });
  if (unitId !== undefined) params.set('UnitId', String(unitId));
  const res = await fetch(`${API_BASE_URL}/api/Leads?${params}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch leads.');
  const json = await res.json();
  return json.data || json;
}

/** GET /api/Leads/{id} */
export async function getLeadById(id: number): Promise<Lead> {
  const res = await fetch(`${API_BASE_URL}/api/Leads/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch lead.');
  const json = await res.json();
  return json.data || json;
}

/** POST /api/Leads — public, no auth required */
export async function createLead(payload: CreateLeadPayload): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/Leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || 'Failed to submit inquiry.');
  }
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/Leads/view/lead/{LeadId} */
export async function markLeadViewed(leadId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Leads/view/lead/${leadId}`, {
    method: 'PUT',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to mark lead as viewed.');
}

/** PUT /api/Leads/cancel/lead/{LeadId} */
export async function cancelLead(leadId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Leads/cancel/lead/${leadId}`, {
    method: 'PUT',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to cancel lead.');
}
