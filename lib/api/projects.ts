import { API_BASE_URL } from './config';


// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiUnit {
  id: number;
  name: string;
  description: string;
  price: number;
  propertyType: number;
  noBathRoom: number;
  noBedRoom: number;
  noKitchen: number;
  floorNumber: number;
  floorName: string;
  area: number;
  view: number;
  isFeatured: boolean;
  imageUrls: string[];
  paymentPlans?: PaymentPlan[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  developerId: number | null;
  developerName: string;
  locationId: number | null;
  locationName: string;
  imageUrls: string[];
  units?: ApiUnit[];
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

export interface CreateProjectPayload {
  name: string;
  description: string;
  developerId: number | null;
  locationId: number | null;
}

export interface UpdateProjectPayload {
  id: number;
  name: string;
  description: string;
  developerId: number | null;
}

// ─── Unit Types ───────────────────────────────────────────────────────────────

export interface PaymentPlan {
  installmentMonthes: number;
  installmentDownPayment: number;
  paymentType: string;
  planStatus?: string;
}

export interface UnitPayload {
  name: string;
  description: string;
  price: number;
  propertyType: number;
  noBathRoom: number;
  noBedRoom: number;
  floorNumber: number;
  area: number;
  noKithchen: number;
  floorName: string;
  view: number;
  paymentPlans: PaymentPlan[];
  isFeatured: boolean;
  facilityIds: number[];
  servicesIds: number[];
}

export interface AddUnitPayload {
  projectId: number;
  units: UnitPayload[];
}

export interface UpdateUnitPayload {
  id: number;
  name: string;
  description: string;
  price: number;
  propertyType: number;
  noBathRoom: number;
  noBedRoom: number;
  noKitchen: number;
  floorName: string;
  view: number;
  isFeatured: boolean;
  paymentPlans?: PaymentPlan[];
}

// Rich unit from GET /api/Units/{id}
export interface UnitDetail {
  id: number;
  name: string;
  description: string;
  price: number;
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
  facilities: string[];
  services: string[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
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

function getAuthHeader(): Record<string, string> {
  const token =
    typeof document !== 'undefined'
      ? document.cookie.match(/(?:^|; )rg_at=([^;]*)/)?.[1]
      : null;
  return token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {};
}

/** Prefix a relative image path from the API with the base URL */
export function resolveProjectImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path}`;
}

// ─── Project Endpoints ────────────────────────────────────────────────────────

/** GET /api/Projects?pageNumber=N */
export async function getProjects(pageNumber = 1): Promise<ProjectsPage> {
  const res = await fetch(
    `${API_BASE_URL}/api/Projects?pageNumber=${pageNumber}`,
    { headers: { ...getAuthHeader() } }
  );
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Fetch failed:', res.status, text);
    throw new Error('Failed to fetch projects.');
  }
  const json: ApiResponse<ProjectsPage> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Projects] Fetch error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to fetch projects.');
  }
  return json.data;
}

/** GET /api/Projects/{id} */
export async function getProjectById(id: number): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/${id}`, {
    headers: { ...getAuthHeader() },
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
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
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
  const res = await fetch(`${API_BASE_URL}/api/Projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Update failed:', res.status, text);
    throw new Error('Failed to update project.');
  }
  const json: ApiResponse<number | Project> = await res.json();
  if (!json.success || !json.data) {
    console.error('[Projects] Update error:', json.message, json.errors);
    throw new Error(json.message || 'Failed to update project.');
  }
  return json.data;
}

/** DELETE /api/Projects/{id} */
export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/${id}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
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
    headers: { ...getAuthHeader() },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Image upload failed:', res.status, text);
    throw new Error('Failed to upload project images.');
  }
}

/** DELETE /api/Projects/{id}/deleteproject/images */
export async function deleteProjectImage(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/${id}/deleteproject/images`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Image delete failed:', res.status, text);
    throw new Error('Failed to delete project image.');
  }
}

// ─── Unit Endpoints (via Projects) ───────────────────────────────────────────

/** POST /api/Projects/AddUnitProject */
export async function addUnitToProject(payload: AddUnitPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/AddUnitProject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
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
}

/** PUT /api/Projects/UpdateUnit */
export async function updateUnit(payload: UpdateUnitPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/UpdateUnit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
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
    headers: { ...getAuthHeader() },
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
    headers: { ...getAuthHeader() },
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Upload unit images failed:', res.status, text);
    throw new Error('Failed to upload unit images.');
  }
}

/** DELETE /api/Projects/{id}/deleteUnit/images */
export async function deleteUnitImages(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Projects/${id}/deleteUnit/images`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Projects] Delete unit images failed:', res.status, text);
    throw new Error('Failed to delete unit images.');
  }
}

// ─── Standalone Units Endpoints (/api/Units) ─────────────────────────────────

/** GET /api/Units?pageNumber=N */
export async function getUnits(pageNumber = 1): Promise<UnitsListPage> {
  const res = await fetch(
    `${API_BASE_URL}/api/Units?pageNumber=${pageNumber}`,
    { headers: { ...getAuthHeader() } }
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
export async function getUnitById(id: number): Promise<UnitDetail> {
  const res = await fetch(`${API_BASE_URL}/api/Units/${id}`, {
    headers: { ...getAuthHeader() },
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
export async function markUnitSold(unitId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Units/marksold`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ unitId }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Units] Mark sold failed:', res.status, text);
    throw new Error('Failed to mark unit as sold.');
  }
}
