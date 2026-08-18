import { API_BASE_URL } from './config';
import { getHeaders } from './common';

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
  const dummy: PaginatedLeads = { items: [], pageNumber: page, totalPages: 1, totalCount: 0, hasPreviousPage: false, hasNextPage: false };
  try {
    const params = new URLSearchParams({ PageNumber: String(page), PageSize: String(size) });
    if (unitId) params.set('UnitId', String(unitId));

    const res = await fetch(`${API_BASE_URL}/api/Leads?${params}`, {
      headers: { ...getHeaders() },
    });

    if (!res.ok) {
      console.warn('[Leads] Fetch failed:', res.status);
      return dummy;
    }
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.warn('Network error when fetching leads:', error);
    return dummy;
  }
}

export async function createLead(lead: LeadRequest): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders()
    },
    body: JSON.stringify(lead),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit request.');
  }
}

