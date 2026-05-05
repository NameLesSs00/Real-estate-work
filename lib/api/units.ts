import { API_BASE_URL } from './config';
import { ApiResponse } from './auth';
import { getHeaders } from './common';

export interface UnitFilters {
  SearchTerm?: string;
  MinPrice?: number;
  MaxPrice?: number;

  ProjectId?: number;
  PageNumber?: number;
  PageSize?: number;
  Currency?: string;
  UnitType?: string;   // "Buy" or "Rent" as per user request
  PropertyType?: string; // For Apartment/Villa/etc
  Status?: string;      // For primary/resale
}

export interface UnitListItem {
  id: number;
  name: string;
  description: string;
  price: number;
  area: number;
  noBathRoom: number;
  noBedRoom: number;
  noKitchen: number;
  floorName: string;
  floorNumber: number;
  unitType: string;
  unitStatus: string;
  propertyType: string;
  isFeatured: boolean;
  isActive: boolean;
  locationName: string;
  projectName: string;
  paymentPlans: {
    planStatus: string;
    installmentMothes: number;
    installmentDownPayment: number;
    paymentType: string;
  }[];
  imageUrls: string[];
  services: string[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
}

export interface PaginatedUnits {
  items: UnitListItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/** GET /api/Units — supports full text search + price/type/project filters */
export async function getUnitsFiltered(filters: UnitFilters = {}): Promise<PaginatedUnits> {
  const params = new URLSearchParams();
  if (filters.SearchTerm) params.set('SearchTerm', filters.SearchTerm);
  if (filters.MinPrice !== undefined) params.set('MinPrice', String(filters.MinPrice));
  if (filters.MaxPrice !== undefined) params.set('MaxPrice', String(filters.MaxPrice));
  if (filters.UnitType) params.set('UnitType', filters.UnitType);
  if (filters.ProjectId !== undefined) params.set('ProjectId', String(filters.ProjectId));
  if (filters.Currency) params.set('Currency', filters.Currency);

  if (filters.PropertyType) params.set('PropertyType', filters.PropertyType);
  if (filters.Status) params.set('Status', filters.Status);
  params.set('PageNumber', String(filters.PageNumber ?? 1));
  params.set('PageSize', String(filters.PageSize ?? 12));

  const res = await fetch(`${API_BASE_URL}/api/Units?${params}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch units.');
  const json: ApiResponse<PaginatedUnits> | UnitListItem[] = await res.json();

  // Handle both array and paginated responses
  if (Array.isArray(json)) {
    return {
      items: json,
      pageNumber: 1,
      totalPages: 1,
      totalCount: json.length,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }
  const wrapped = json as ApiResponse<PaginatedUnits>;
  return wrapped.data ?? (json as unknown as PaginatedUnits);
}

/** GET /api/Units/{id} */
export async function getUnitDetail(id: number): Promise<UnitListItem> {
  const res = await fetch(`${API_BASE_URL}/api/Units/${id}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch unit details.');
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/Units/marksold */
export async function markUnitSold(id: number, notes = ''): Promise<void> {
  const params = new URLSearchParams({ id: String(id), Notes: notes });
  const res = await fetch(`${API_BASE_URL}/api/Units/marksold?${params}`, {
    method: 'PUT',
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to mark unit as sold.');
}

// ── Sold-Units (UnitSoldout) domain ──────────────────────────────────────────

export interface SoldUnit {
  id: number;
  unitId: number;
  unitName: string;
  projectName: string;
  city: string;
  country: string;
  unitImages: string[];
  soldoutDate: string;
  soldType: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface PaginatedSoldUnits {
  items: SoldUnit[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ReactivateUnitPayload {
  projectId: number;
  unitId: number;
  isFeatured: boolean;
  paymentPlans: {
    installmentMonthes: number;
    installmentDownPayment: number;
    paymentType: string;
  }[];
}

/** GET /api/unit-soldout — paginated list of sold units */
export async function getSoldUnits(filters: {
  unitName?: string;
  soldType?: string;
  page?: number;
  size?: number;
} = {}): Promise<PaginatedSoldUnits> {
  const params = new URLSearchParams({
    PageNumber: String(filters.page ?? 1),
    PageSize: String(filters.size ?? 10),
  });
  if (filters.unitName) params.set('UnitName', filters.unitName);
  if (filters.soldType) params.set('SoldType', filters.soldType);
  const res = await fetch(`${API_BASE_URL}/api/unit-soldout?${params}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch sold units.');
  const json = await res.json();
  return json.data ?? json;
}

/** GET /api/unit-soldout/{id} — single sold unit detail */
export async function getSoldUnitById(id: number): Promise<SoldUnit> {
  const res = await fetch(`${API_BASE_URL}/api/unit-soldout/${id}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch sold unit detail.');
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/Units/reactivte-unit — reactivate a previously sold unit */
export async function reactivateUnit(payload: ReactivateUnitPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Units/reactivte-unit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to reactivate unit.');
}
