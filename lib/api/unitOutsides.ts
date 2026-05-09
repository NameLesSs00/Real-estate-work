import { API_BASE_URL } from './config';
import { getHeaders } from './common';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UnitOutsideImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface UnitOutsidePaymentPlan {
  id: number;
  commissionRate: number;
  installmentMothes: number;
  installmentDownPayment: number;
  paymentType: string;
  status: string;
}

export interface UnitOutside {
  id: number;
  markerId?: string;
  name: string;
  description: string;
  price: number;
  currencyCode: string;
  area: number;
  noBathRoom: number;
  noBedRoom: number;
  noKitchen: number;
  country: string;
  city: string;
  street: string;
  propertyType: string | number;
  floorNumber: number;
  view: string;
  type: string;
  status?: string;
  floorName: string;
  isFeatured: boolean;
  isActive: boolean;
  soldCount: number;
  images: UnitOutsideImage[];
  paymentPlans: UnitOutsidePaymentPlan[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface PaginatedUnitOutsides {
  items: UnitOutside[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UnitOutsideFilters {
  SearchTerm?: string;
  MinPrice?: number;
  MaxPrice?: number;
  City?: string;
  Country?: string;
  PropertyType?: string | number;
  Currency?: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface CreateUnitOutsidePayload {
  name: { en: string; de: string; pl: string };
  description: { en: string; de: string; pl: string };
  price: number;
  currencyCode: string;
  area: number;
  noBathRoom: number;
  noBedRoom: number;
  noKitchen: number;
  country: string;
  city: string;
  street: string;
  propertyType: string | number;
  floorNumber: number;
  view: string;
  type: string;
  status?: string;
  floorName: string;
  isFeatured: boolean;
  paymentPlans: {
    commissionRate: number;
    installmentMothes: number;
    installmentDownPayment: number;
    paymentType: string;
  }[];
  paymentPlan?: {
    commissionRate: number;
    installmentMothes: number;
    installmentDownPayment: number;
    paymentType: string;
  }[];
}

// ─── UnitOutsideSoldout types ──────────────────────────────────────────────────
export interface UnitOutsideSoldout {
  id: number;
  unitOutsideId: number;
  unitOutsideName: string;
  soldoutDate: string;
  isActive: boolean;
  paymentPlans: UnitOutsidePaymentPlan[];
}

export interface PaginatedUnitOutsideSoldouts {
  items: UnitOutsideSoldout[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ─── UnitOutside CRUD ─────────────────────────────────────────────────────────

/** GET /api/UnitOutsides — paginated list with optional filters */
export async function getUnitOutsides(
  filters: UnitOutsideFilters = {}
): Promise<PaginatedUnitOutsides> {
  const params = new URLSearchParams();
  if (filters.SearchTerm) params.set('SearchTerm', filters.SearchTerm);
  if (filters.MinPrice !== undefined) params.set('MinPrice', String(filters.MinPrice));
  if (filters.MaxPrice !== undefined) params.set('MaxPrice', String(filters.MaxPrice));
  if (filters.City) params.set('City', filters.City);
  if (filters.Country) params.set('Country', filters.Country);
  if (filters.PropertyType !== undefined) params.set('PropertyType', String(filters.PropertyType));
  if (filters.Currency) params.set('Currency', filters.Currency);
  params.set('PageNumber', String(filters.PageNumber ?? 1));
  params.set('PageSize', String(filters.PageSize ?? 10));

  const res = await fetch(`${API_BASE_URL}/api/UnitOutsides?${params}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch outside units.');
  const json = await res.json();
  return json.data ?? json;
}

/** GET /api/UnitOutsides/{id} */
export async function getUnitOutsideById(id: number, lang?: string): Promise<UnitOutside> {
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsides/${id}`, {
    headers: { ...getHeaders(lang) },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Failed to fetch outside unit details.');
  const json = await res.json();
  return json.data ?? json;
}

/** POST /api/UnitOutsides — create new outside unit (JSON) */
export async function createUnitOutside(
  payload: CreateUnitOutsidePayload
): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsides`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create outside unit.');
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/UnitOutsides — update outside unit (multipart/form-data) */
export async function updateUnitOutside(formData: FormData): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsides`, {
    method: 'PUT',
    headers: { ...getHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update outside unit.');
  const json = await res.json();
  return json.data ?? json;
}

/** DELETE /api/UnitOutsides/{id} */
export async function deleteUnitOutside(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsides/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to delete outside unit.');
  const json = await res.json();
  return json.data ?? json;
}

/** POST /api/UnitOutsides/images — upload images for an outside unit */
export async function addUnitOutsideImages(
  unitOutsideId: number,
  files: File[]
): Promise<boolean> {
  const fd = new FormData();
  fd.append('UnitOutsideId', String(unitOutsideId));
  files.forEach((f) => fd.append('Images', f));
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsides/images`, {
    method: 'POST',
    headers: { ...getHeaders() },
    body: fd,
  });
  if (!res.ok) throw new Error('Failed to upload outside unit images.');
  const json = await res.json();
  return json.data ?? json;
}

/** DELETE /api/UnitOutsides/{unitId}/images/{imageId} */
export async function deleteUnitOutsideImage(
  unitId: number,
  imageId: number
): Promise<boolean> {
  const res = await fetch(
    `${API_BASE_URL}/api/UnitOutsides/${unitId}/images/${imageId}`,
    { method: 'DELETE', headers: { ...getHeaders() } }
  );
  if (!res.ok) throw new Error('Failed to delete outside unit image.');
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/UnitOutsides/marksold — mark outside unit as sold */
export async function markUnitOutsideSold(
  id: number,
  paymentplanId: number
): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsides/marksold`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify({ id, paymentplanId }),
  });
  if (!res.ok) throw new Error('Failed to mark outside unit as sold.');
  const json = await res.json();
  return json.data ?? json;
}

// ─── UnitOutsideSoldouts ──────────────────────────────────────────────────────

/** GET /api/UnitOutsideSoldouts — paginated list */
export async function getUnitOutsideSoldouts(
  page = 1,
  pageSize = 10
): Promise<PaginatedUnitOutsideSoldouts> {
  const params = new URLSearchParams({
    PageNumber: String(page),
    PageSize: String(pageSize),
  });
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsideSoldouts?${params}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch outside soldouts.');
  const json = await res.json();
  return json.data ?? json;
}

/** GET /api/UnitOutsideSoldouts/{id} */
export async function getUnitOutsideSoldoutById(
  id: number
): Promise<UnitOutsideSoldout> {
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsideSoldouts/${id}`, {
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to fetch outside soldout details.');
  const json = await res.json();
  return json.data ?? json;
}

/** DELETE /api/UnitOutsideSoldouts/{id} */
export async function deleteUnitOutsideSoldout(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/UnitOutsideSoldouts/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });
  if (!res.ok) throw new Error('Failed to delete outside soldout.');
  const json = await res.json();
  return json.data ?? json;
}
