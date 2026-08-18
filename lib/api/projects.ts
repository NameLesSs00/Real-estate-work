import { API_BASE_URL } from './config';
import { ApiResponse } from './auth';
import { getHeaders } from './common';
import { Facility } from './facilities';
import { Service } from './services';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiUnit {
  id: number;
  markerId?: string;
  name: string | LocalizedString;
  description: string | LocalizedString;
  price: number;
  propertyType: number | string;
  noBathRoom: number;
  noBedRoom: number;
  noKithchen: number;
  noKitchen?: number;
  floorNumber: number;
  floorName: string;
  area: number;
  view: string | number;
  isFeatured: boolean;
  currencyCode: string;
  imageUrls: string[];
  paymentPlans?: PaymentPlan[];
  isActive?: boolean;
  type?: 'Buy' | 'Rent';
  status?: 'primary' | 'resale';
}

export interface Project {
  id: number;
  name: string;
  description: string;
  developerId: number | null;
  developerName: string;
  logoImage: string;
  locationId: number | null;
  locationName: string;
  imageUrls: string[];
  units?: ApiUnit[];
  facilities?: number[] | string[];
  facilityIds?: number[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
}


export interface ProjectsPage {
  items: Project[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LocalizedString {
  en: string;
  de: string;
  pl: string;
  [key: string]: string;
}

export interface CreateProjectPayload {
  name: LocalizedString;
  description: LocalizedString;
  developerId: number | null;
  locationId: number | null;
  facilityIds?: number[];
}

export interface UpdateProjectPayload {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  developerId: number;
  locationId: number;
  facilityIds?: number[];
  Facilities?: { id: number }[];
}

// ─── Unit Types ───────────────────────────────────────────────────────────────

export interface PaymentPlan {
  id?: number;
  paymentPlanId?: number;
  installmentMonthes: number;
  installmentMonths?: number;
  installmentMothes?: number;
  InstallmentMonthes?: number;
  InstallmentMothes?: number;
  installmentDownPayment: number;
  InstallmentDownPayment?: number;
  paymentType: string;
  PaymentType?: string;
  planStatus?: string;
  PlanStatus?: string;
  unitStatus?: string;
  unitDetailId?: number;
  Id?: number;
  unitId?: number;
  unitName?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string | null;
  updatedAt?: string | null;
}

export interface UnitPayload {
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  propertyType: number;
  noBathRoom: number;
  noBedRoom: number;
  floorNumber: number;
  area: number;
  noKithchen: number;
  noKitchen?: number;
  floorName: string;
  view: string;
  paymentPlans: PaymentPlan[];
  isFeatured: boolean;
  currencyCode: string;
  servicesIds: number[];
  status: string;
  type: string;
  isActive: boolean;
}

export interface AddUnitPayload {
  projectId: number;
  units: UnitPayload[];
}

export interface UpdateUnitPayload {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  propertyType: number;
  noBathRoom: number;
  noBedRoom: number;
  noKitchen: number;
  noKithchen?: number;
  area: number;
  status: string;
  type: string;
  floorNumber: number;
  view: string;
  floorName: string;
  servicesIds?: number[];
  paymentPlans?: PaymentPlan[];
  isFeatured: boolean;
  currencyCode?: string;
  isActive?: boolean;
}

// Rich unit from GET /api/Units/{id}
export interface UnitDetail {
  Id: number;
  markerId?: string;
  MarkerId?: string;
  Name: string | LocalizedString;
  Description: string | LocalizedString;
  Price: number;
  PropertyType: string;
  IsFeatured: boolean;
  IsActive: boolean;
  Status: string;
  Type: string;
  LocationName: string;
  ProjectName: string;
  NoBathRoom: number;
  NoBedRoom: number;
  FloorNumber: number;
  FloorName: string;
  Area: number;
  NoKitchen: number;
  View: string | number;
  CurrencyCode?: string;
  PaymentPlans: PaymentPlan[];
  ImageUrls: string[];
  Facilities: Facility[];
  Services: Service[];
  CreatedBy: string;
  CreatedAt: string;
  UpdatedBy: string;
  UpdatedAt: string | null;

  // Fallbacks for UI compatibility
  id?: number;
  name?: string | LocalizedString;
  description?: string | LocalizedString;
  price?: number;
  propertyType?: string;
  imageUrls?: string[];
  noBedRoom?: number;
  noBathRoom?: number;
  area?: number;
  floorNumber?: number;
  floorName?: string;
  noKitchen?: number;
  view?: string | number;
  isActive?: boolean;
  isFeatured?: boolean;
  services?: Service[];
  paymentPlans?: PaymentPlan[];
  currencyCode?: string;
  type?: string;
  status?: string;
  projectName?: string;
  locationName?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface UnitsListPage {
  items: ApiUnit[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────


/** Prefix a relative image path from the API with the base URL */
export function resolveProjectImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path}`;
}

// ─── Project Endpoints ────────────────────────────────────────────────────────

/** GET /api/Projects?pageNumber=N&pageSize=M */
export async function getProjects(pageNumber = 1, pageSize = 10, lang?: string): Promise<ProjectsPage> {
  const res = await fetch(
    `${API_BASE_URL}/api/Projects?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    { headers: { ...getHeaders(lang) } }
  );
  if (!res.ok) {
    const text = await res.text();
    console.warn('[Projects] Fetch failed:', res.status, text);
    throw new Error('Failed to fetch projects.');
  }
  const json: ApiResponse<ProjectsPage> = await res.json();
  if (!json.success || !json.data) {
    console.warn('[Projects] Fetch error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to fetch projects.');
  }
  return json.data;
}

/** GET /api/Projects/{id} */
export async function getProjectById(id: number, lang?: string): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/${id}`, {
    headers: { ...getHeaders(lang) },
  });
 if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Fetch by ID failed:', res.status, text);
    throw new Error('Failed to fetch project.');
  }
  const json: ApiResponse<Project> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Projects] Fetch by ID error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to fetch project.');
  }
  return json.data;
}

/** POST /api/Projects */
export async function createProject(payload: CreateProjectPayload): Promise<number | Project> {
  const res = await fetch(`${API_BASE_URL}/api/Projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(undefined, true) },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Create failed:', res.status, text);
    throw new Error('Failed to create project.');
  }
  const json: ApiResponse<number | Project> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Projects] Create error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to create project.');
  }
  return json.data;
}

/** PUT /api/Projects/{id} */
export async function updateProject(id: number, payload: UpdateProjectPayload): Promise<number | Project> {
  const headers = { 'Content-Type': 'application/json', ...getHeaders(undefined, true) };
  
  const res = await fetch(`${API_BASE_URL}/api/Projects`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Update failed:', res.status, text);
    console.error('[Projects] Payload sent:', payload);
    
    let message = 'Failed to update project.';
    try {
      const json = JSON.parse(text);
      if (json.message) message = json.message;
      else if (json.errors) message = JSON.stringify(json.errors);
    } catch {
      // use default
    }
    throw new Error(message);
  }
  
  const json: ApiResponse<number | Project> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Projects] Update logical error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to update project.');
  }
  return json.data;
}

/** DELETE /api/Projects/{id} */
export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Delete failed:', res.status, text);
    try {
      const json = JSON.parse(text);
      if (json.message) throw new Error(json.message);
    } catch (e: unknown) {
      const err = e as Error;
      if (err.message && err.message !== 'Unexpected end of JSON input' && !err.message.startsWith('Unexpected token')) {
        throw err;
      }
    }
    throw new Error('Failed to delete project.');
  }
}

/** POST /api/Projects/{id}/images — upload multiple images */
export async function uploadProjectImages(id: number, files: File[]): Promise<void> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const res = await fetch(`${API_BASE_URL}/api/Projects/${id}/images`, {
    method: 'POST',
    headers: { ...getHeaders() },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Image upload failed:', res.status, text);
    try {
      const json = JSON.parse(text);
      if (json.errors && json.errors.Files) {
        throw new Error(json.errors.Files[0]);
      }
      if (json.message) throw new Error(json.message);
    } catch (e: unknown) {
      const err = e as Error;
      if (err.message && err.message !== 'Unexpected end of JSON input' && !err.message.startsWith('Unexpected token')) {
        throw err;
      }
    }
    throw new Error('Failed to upload project images.');
  }
}

/** DELETE /api/Projects/{id}/deleteproject/images */
export async function deleteProjectImage(id: number, imageUrl?: string): Promise<void> {
  const url = `${API_BASE_URL}/api/Projects/${id}/deleteproject/images${imageUrl ? `?url=${encodeURIComponent(imageUrl)}` : ''}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Image delete failed:', res.status, text);
    throw new Error('Failed to delete project image.');
  }
}

// ─── Unit Endpoints (via Projects) ───────────────────────────────────────────

/** POST /api/Projects/AddUnitProject — returns the new unit ID */
export async function addUnitToProject(payload: AddUnitPayload): Promise<number | null> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/AddUnitProject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Add unit failed:', res.status, text);
    try {
      const json = JSON.parse(text);
      if (json.message) throw new Error(json.message);
    } catch (e: unknown) {
      const err = e as Error;
      if (err.message && err.message !== 'Unexpected end of JSON input' && !err.message.startsWith('Unexpected token')) {
        throw err;
      }
    }
    throw new Error('Failed to add unit to project.');
  }
  try {
    const json = await res.json();
    // Some APIs return a raw integer ID, others return an ApiResponse object
    if (typeof json === 'number') return json;
    return json?.data ?? json?.id ?? null;
  } catch {
    return null;
  }
}

/** PUT /api/Projects/UpdateUnit */
export async function updateUnit(payload: UpdateUnitPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/UpdateUnit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Update unit failed:', res.status, text);
    try {
      const json = JSON.parse(text);
      if (json.message) throw new Error(json.message);
    } catch (e: unknown) {
      const err = e as Error;
      if (err.message && err.message !== 'Unexpected end of JSON input' && !err.message.startsWith('Unexpected token')) {
        throw err;
      }
    }
    throw new Error('Failed to update unit.');
  }
}

/** DELETE /api/Projects/DeleteUnit/{id} */
export async function deleteUnit(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/DeleteUnit/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Delete unit failed:', res.status, text);
    throw new Error('Failed to delete unit.');
  }
}

/** POST /api/Projects/{id}/uploadUnit/images */
export async function uploadUnitImages(id: number, files: File[]): Promise<void> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const res = await fetch(`${API_BASE_URL}/api/Projects/${id}/uploadUnit/images`, {
    method: 'POST',
    headers: { ...getHeaders() },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Upload unit images failed:', res.status, text);
    try {
      const json = JSON.parse(text);
      if (json.errors && json.errors.Files) {
        throw new Error(json.errors.Files[0]);
      }
      if (json.message) throw new Error(json.message);
    } catch (e: unknown) {
      const err = e as Error;
      if (err.message && err.message !== 'Unexpected end of JSON input' && !err.message.startsWith('Unexpected token')) {
        throw err;
      }
    }
    throw new Error('Failed to upload unit images.');
  }
}

/** DELETE /api/Projects/{id}/deleteUnit/images */
export async function deleteUnitImages(id: number, imageUrl?: string): Promise<void> {
  const url = `${API_BASE_URL}/api/Projects/${id}/deleteUnit/images${imageUrl ? `?url=${encodeURIComponent(imageUrl)}` : ''}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Delete unit images failed:', res.status, text);
    throw new Error('Failed to delete unit images.');
  }
}

// ─── Standalone Units Endpoints (/api/Units) ─────────────────────────────────

/** GET /api/Units?pageNumber=N */
export async function getUnits(pageNumber = 1, projectId?: number): Promise<UnitsListPage> {
  let url = `${API_BASE_URL}/api/Units?pageNumber=${pageNumber}`;
  if (projectId) url += `&ProjectId=${projectId}`;
  const res = await fetch(
    url,
    { headers: { ...getHeaders() } }
  );
  if (!res.ok) {
    const text = await res.text();
    console.error('[Units] Fetch failed:', res.status, text);
    throw new Error('Failed to fetch units.');
  }
  const json: ApiResponse<UnitsListPage> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Units] Fetch error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to fetch units.');
  }
  return json.data;
}

/** GET /api/Units/{id} — returns rich UnitDetail */
export async function getUnitById(id: number, lang?: string): Promise<UnitDetail> {
  const res = await fetch(`${API_BASE_URL}/api/Units/${id}`, {
    headers: { ...getHeaders(lang) },
    cache: 'no-store'
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Units] Fetch by ID failed:', res.status, text);
    throw new Error('Failed to fetch unit details.');
  }
  const json: ApiResponse<UnitDetail> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Units] Fetch by ID error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to fetch unit details.');
  }
  return json.data;
}

/** PUT /api/Units/marksold — mark a unit as sold */
export async function markUnitSold(unitId: number, notes = ''): Promise<void> {
  const params = new URLSearchParams({ id: String(unitId), Notes: notes });
  const res = await fetch(`${API_BASE_URL}/api/Units/marksold?${params}`, {
    method: 'PUT',
    headers: { ...getHeaders() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Units] Mark sold failed:', res.status, text);
    throw new Error('Failed to mark unit as sold.');
  }
}

/** PUT /api/Projects/add-prject-facility (Actually trying POST if PUT failed) */
export async function addProjectFacility(projectId: number, facilityId: number): Promise<void> {
  // If the user didn't specify the add endpoint, it's possible it doesn't exist 
  // or it's a POST request. Let's try POST to avoid the {id} route conflict.
  const res = await fetch(`${API_BASE_URL}/api/Projects/add-prject-facility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify({ projectId, faciltyId: facilityId }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Add facility failed:', res.status, text);
    throw new Error('Failed to add facility to project.');
  }
}

/** PUT /api/Projects/delete-prject-facility */
export async function deleteProjectFacility(projectId: number, facilityId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/delete-prject-facility`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify({ projectId, faciltyId: facilityId }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Delete facility failed:', res.status, text);
    throw new Error('Failed to remove facility from project.');
  }
}
