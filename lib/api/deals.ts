import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface Deal {
  id: number;
  dealDate: string;
  dealType: string;
  unit: {
    unitId: number;
    unitName: string;
    price: number;
    area: number;
    isActive: boolean;
    projectId: number;
    projectName: string;
  };
  unitDetails: {
    unitDetailId: number;
    commissionRate: number;
    installmentMothes: number;
    installmentDownPayment: number;
    paymentType: string;
    status: string;
  };
  buyer: {
    fullName: string;
    email: string;
    phone: string;
    dealDate: string;
    dealLocation: string;
  };
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
}

export interface PaginatedDeals {
  items: Deal[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateDealPayload {
  unitPlanId: number;
  fullName: string;
  email: string;
  phone: string;
}

/** GET /api/Deals */
export async function getDeals(filters: { unitId?: number; projectId?: number; sortBy?: string; sortDirection?: string; page?: number; size?: number } = {}): Promise<PaginatedDeals> {
  const params = new URLSearchParams({ PageNumber: String(filters.page ?? 1), PageSize: String(filters.size ?? 10) });
  if (filters.unitId) params.set('UnitId', String(filters.unitId));
  if (filters.projectId) params.set('ProjectId', String(filters.projectId));
  if (filters.sortBy) params.set('SortBy', filters.sortBy);
  if (filters.sortDirection) params.set('SortDirection', filters.sortDirection);
  const res = await fetch(`${API_BASE_URL}/api/Deals?${params}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error('Failed to fetch deals.');
  const json = await res.json();
  return json.data ?? json;
}

/** GET /api/Deals/{id} */
export async function getDealById(id: number): Promise<Deal> {
  const res = await fetch(`${API_BASE_URL}/api/Deals/${id}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error('Failed to fetch deal.');
  const json = await res.json();
  return json.data ?? json;
}

/** GET /api/Deals/latest */
export async function getLatestDeals(page = 1, size = 5): Promise<PaginatedDeals> {
  const res = await fetch(`${API_BASE_URL}/api/Deals/latest?pageNumber=${page}&pageSize=${size}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error('Failed to fetch latest deals.');
  const json = await res.json();
  return json.data ?? json;
}

/** GET /api/Deals/unit/{unitId} */
export async function getDealsByUnit(unitId: number, page = 1): Promise<PaginatedDeals> {
  const res = await fetch(`${API_BASE_URL}/api/Deals/unit/${unitId}?pageNumber=${page}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error('Failed to fetch unit deals.');
  const json = await res.json();
  return json.data ?? json;
}

/** GET /api/Deals/project/{projectId} */
export async function getDealsByProject(projectId: number, page = 1): Promise<PaginatedDeals> {
  const res = await fetch(`${API_BASE_URL}/api/Deals/project/${projectId}?pageNumber=${page}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error('Failed to fetch project deals.');
  const json = await res.json();
  return json.data ?? json;
}

/** POST /api/Deals */
export async function createDeal(payload: CreateDealPayload): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/Deals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create deal.');
  const json = await res.json();
  return json.data ?? json;
}

/** GET /api/Deals/unit/{unitId}/compatibility */
export async function getDealsByUnitCompatibility(unitId: number, page = 1, size = 10): Promise<PaginatedDeals> {
  const res = await fetch(
    `${API_BASE_URL}/api/Deals/unit/${unitId}/compatibility?pageNumber=${page}&pageSize=${size}`,
    { headers: { ...authHeader() } }
  );
  if (!res.ok) throw new Error('Failed to fetch compatibility deals.');
  const json = await res.json();
  return json.data ?? json;
}
