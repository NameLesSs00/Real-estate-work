import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface RequestItem {
  id: number;
  unitName: string;
  applicantName: string;
  status: string;
  createdAt: string;
  approvedAt: string | null;
}

export interface RequestDetail {
  id: number;
  unitId: number;
  unitName: string;
  unitPrice: number;
  unitArea: number;
  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
  approvedBy: string;
  approvedAt: string | null;
}

export interface PaginatedRequests {
  items: RequestItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApproveRequestPayload {
  id: number;
  paymentPlans: {
    commisionRate: number;
    installmentMoths: number;
    installmentDownPayment: number;
    paymentType: string;
  }[];
}

/** GET /api/Requests — status: 0=Pending, 1=Approved, 2=Rejected */
export async function getRequests(page = 1, size = 10, status?: number): Promise<PaginatedRequests> {
  const dummy: PaginatedRequests = { items: [], pageNumber: page, totalPages: 1, totalCount: 0, hasPreviousPage: false, hasNextPage: false };
  try {
    const params = new URLSearchParams({ PageNumber: String(page), PageSize: String(size) });
    if (status !== undefined) params.set('Status', String(status));
    const res = await fetch(`${API_BASE_URL}/api/Requests?${params}`, {
      headers: { ...authHeader() },
    });
    if (!res.ok) {
      console.warn('[Requests] Fetch failed:', res.status);
      return dummy;
    }
    const json = await res.json();
    return json.data || json;
  } catch (error) {
    console.warn('Network error when fetching requests:', error);
    return dummy;
  }
}

/** GET /api/Requests/{id} */
export async function getRequestById(id: number): Promise<RequestDetail> {
  const res = await fetch(`${API_BASE_URL}/api/Requests/${id}`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch request.');
  const json = await res.json();
  return json.data || json;
}

/** POST /api/Requests */
export async function createRequest(payload: { unitName: string; applicantId: number }): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/Requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create request.');
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/Requests/approve */
export async function approveRequest(payload: ApproveRequestPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Requests/approve`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || 'Failed to approve request.');
  }
}

/** PUT /api/Requests/{id}/reject */
export async function rejectRequest(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Requests/${id}/reject`, {
    method: 'PUT',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to reject request.');
}
