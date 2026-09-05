import { API_BASE_URL } from './config';
import { getHeaders } from './common';
import type { LocalizedString } from './projects';

export interface ProjectType {
  id: number;
  name: string | LocalizedString;
  icon: string | null;
}

export interface ProjectTypesQuery {
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ProjectTypesPage {
  items: ProjectType[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateProjectTypePayload {
  name: LocalizedString;
  icon: string | null;
}

export interface UpdateProjectTypePayload {
  id: number;
  name: LocalizedString;
  icon: string | null;
}

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

type ProjectTypeApiItem = {
  id?: number;
  Id?: number;
  name?: string | LocalizedString;
  Name?: string | LocalizedString;
  icon?: string | null;
  Icon?: string | null;
};

type ProjectTypesApiPage = {
  items?: ProjectTypeApiItem[];
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
};

const emptyProjectTypesPage = (pageNumber = 1): ProjectTypesPage => ({
  items: [],
  pageNumber,
  totalPages: 1,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
});

function normalizeProjectType(item: ProjectTypeApiItem): ProjectType {
  return {
    id: item.id !== undefined ? item.id : (item.Id ?? 0),
    name: item.name !== undefined ? item.name : (item.Name ?? ''),
    icon: item.icon !== undefined ? item.icon : (item.Icon ?? null),
  };
}

function buildProjectTypesUrl(query: ProjectTypesQuery): string {
  const params = new URLSearchParams();

  if (query.searchTerm) params.set('SearchTerm', query.searchTerm);
  if (query.sortBy) params.set('SortBy', query.sortBy);
  if (query.sortDirection) params.set('SortDirection', query.sortDirection);
  if (query.pageNumber) params.set('PageNumber', String(query.pageNumber));
  if (query.pageSize) params.set('PageSize', String(query.pageSize));

  const qs = params.toString();
  return `${API_BASE_URL}/api/project-types${qs ? `?${qs}` : ''}`;
}

/** GET /api/project-types */
export async function getProjectTypes(query: ProjectTypesQuery = {}): Promise<ProjectTypesPage> {
  const pageNumber = query.pageNumber ?? 1;

  try {
    const res = await fetch(buildProjectTypesUrl({ pageSize: 10, ...query, pageNumber }), {
      headers: { ...getHeaders() },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn('[ProjectTypes] Fetch failed:', res.status, text);
      return emptyProjectTypesPage(pageNumber);
    }

    const json: ApiResponse<ProjectTypesApiPage | ProjectTypeApiItem[]> = await res.json();
    const data = json.data ?? json;

    if (Array.isArray(data)) {
      return {
        ...emptyProjectTypesPage(pageNumber),
        items: data.map(normalizeProjectType),
        totalCount: data.length,
      };
    }

    const pageData = data as ProjectTypesApiPage;

    return {
      items: (pageData.items ?? []).map(normalizeProjectType),
      pageNumber: pageData.pageNumber ?? pageNumber,
      totalPages: pageData.totalPages ?? 1,
      totalCount: pageData.totalCount ?? pageData.items?.length ?? 0,
      hasPreviousPage: pageData.hasPreviousPage ?? false,
      hasNextPage: pageData.hasNextPage ?? false,
    };
  } catch (error) {
    console.warn('Network error when fetching project types:', error);
    return emptyProjectTypesPage(pageNumber);
  }
}

/** GET /api/project-types/{id} */
export async function getProjectTypeById(id: number, lang = 'en'): Promise<ProjectType> {
  const res = await fetch(`${API_BASE_URL}/api/project-types/${id}`, {
    headers: { ...getHeaders(lang) },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch project type.');

  const json: ApiResponse<ProjectTypeApiItem> = await res.json();
  return normalizeProjectType((json.data ?? json) as ProjectTypeApiItem);
}

/** POST /api/project-types */
export async function createProjectType(payload: CreateProjectTypePayload): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/project-types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('[ProjectTypes] Create failed:', res.status, text);
    throw new Error(text || 'Failed to create project type.');
  }

  try {
    const json = JSON.parse(text);
    if (json.success === false) throw new Error(json.message || 'Failed to create project type.');
    return json.data ?? json;
  } catch {
    return parseInt(text, 10) || 0;
  }
}

/** PUT /api/project-types/{id} */
export async function updateProjectType(payload: UpdateProjectTypePayload): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/project-types/${payload.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('[ProjectTypes] Update failed:', res.status, text);
    throw new Error(text || 'Failed to update project type.');
  }

  try {
    const json = JSON.parse(text);
    if (json.success === false) throw new Error(json.message || 'Failed to update project type.');
    return Boolean(json.data ?? json);
  } catch {
    return text.toLowerCase() === 'true' || res.status === 200 || res.status === 204;
  }
}

/** DELETE /api/project-types/{id} */
export async function deleteProjectType(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/project-types/${id}`, {
    method: 'DELETE',
    headers: { accept: 'application/json, text/plain, */*', ...getHeaders() },
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('[ProjectTypes] Delete failed:', res.status, text);
    throw new Error(text || 'Failed to delete project type.');
  }

  try {
    const json = JSON.parse(text);
    if (json.success === false) throw new Error(json.message || 'Failed to delete project type.');
    return Boolean(json.data ?? json);
  } catch {
    return text.toLowerCase() === 'true' || res.status === 200 || res.status === 204;
  }
}
