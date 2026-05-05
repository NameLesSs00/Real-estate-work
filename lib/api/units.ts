import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';
import { ApiResponse } from './auth';

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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
    headers: { ...authHeader() },
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
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to fetch unit details.');
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/Units/marksold */
export async function markUnitSold(id: number, notes?: string): Promise<void> {
  const params = new URLSearchParams({ id: String(id) });
  if (notes) params.set('Notes', notes);
  const res = await fetch(`${API_BASE_URL}/api/Units/marksold?${params}`, {
    method: 'PUT',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to mark unit as sold.');
}
