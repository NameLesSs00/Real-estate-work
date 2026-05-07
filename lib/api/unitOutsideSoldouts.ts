import { API_BASE_URL } from './config';
import { getHeaders } from './common';

export interface UnitOutsideSoldout {
  id: number;
  unitOutsideId: number;
  unitOutsideName: string;
  soldoutDate: string;
  isActive: boolean;
  paymentPlans: {
    id: number;
    commissionRate: number;
    installmentMothes: number;
    installmentDownPayment: number;
    paymentType: string;
    status: string;
  }[];
}

export interface PaginatedUnitOutsideSoldouts {
  items: UnitOutsideSoldout[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** GET /api/UnitOutsideSoldouts — paginated list of resale sold units */
export async function getUnitOutsideSoldouts(filters: {
  page?: number;
  size?: number;
  unitName?: string;
} = {}): Promise<PaginatedUnitOutsideSoldouts> {
  const params = new URLSearchParams({
    PageNumber: String(filters.page ?? 1),
    PageSize: String(filters.size ?? 10),
  });
  if (filters.unitName) params.set('UnitName', filters.unitName);

  const res = await fetch(`${API_BASE_URL}/api/UnitOutsideSoldouts?${params}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch resale sold units.');
  const json = await res.json();
  return json.data ?? json;
}

/** GET /api/UnitOutsideSoldouts/{id} — single resale sold unit detail */
export async function getUnitOutsideSoldoutById(id: number): Promise<UnitOutsideSoldout> {
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsideSoldouts/${id}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch resale sold unit detail.');
  const json = await res.json();
  return json.data ?? json;
}
