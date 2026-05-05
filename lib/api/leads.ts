import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface LeadRequest {
  fullName: string;
  email: string;
  phone: string;
  unitId?: number;
  notes: string;
}

export interface Lead {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  projectName?: string;
  unitId?: number;
  propertyName?: string;
  notes?: string;
  statusLead: string;
  createdBy?: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface PaginatedLeads {
  items: Lead[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export async function getLeads(page = 1, size = 10, unitId?: number): Promise<PaginatedLeads> {
  const params = new URLSearchParams({ PageNumber: String(page), PageSize: String(size) });
  if (unitId) params.set('UnitId', String(unitId));

  const res = await fetch(`${API_BASE_URL}/api/Leads?${params}`, {
    headers: { ...authHeader() },
  });

  if (!res.ok) throw new Error('Failed to fetch leads.');
  const json = await res.json();
  return json.data || json;
}

export async function createLead(lead: LeadRequest): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit request.');
  }
}

