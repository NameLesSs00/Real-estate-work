import { API_BASE_URL } from './config';
import { ApiResponse } from './auth';
import { getHeaders } from './common';

export interface LocalizedString {
  en: string;
  de: string;
  it: string;
}

export interface Location {
  id: number;
  mainLocation: string;
  locationImageUrl: string | null;
  subLocation: string;
  subLocationImageUrl: string | null;
  isFeature: boolean;
  imageUrl: string | null;
  country: string;
  city: string;
  district: string;
  street: string | null;
  latitude: string | null;
  longitude: string | null;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

export interface LocationsQuery {
  isFeature?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface LocationsPage {
  items: Location[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateLocationPayload {
  mainLocation?: LocalizedString;
  subLocation?: LocalizedString;
  locationImage?: File | null;
  isFeature?: boolean;
  city?: LocalizedString;
  district?: LocalizedString;
  street?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
}

export interface UpdateLocationPayload extends CreateLocationPayload {
  id: number;
}

type LocationApiItem = {
  id?: number;
  Id?: number;
  mainLocation?: string;
  MainLocation?: string;
  locationImageUrl?: string | null;
  LocationImageUrl?: string | null;
  subLocation?: string;
  SubLocation?: string;
  subLocationImageUrl?: string | null;
  SubLocationImageUrl?: string | null;
  isFeature?: boolean;
  IsFeature?: boolean;
  imageUrl?: string | null;
  ImageUrl?: string | null;
  country?: string;
  Country?: string;
  city?: string;
  City?: string;
  district?: string;
  District?: string;
  street?: string | null;
  Street?: string | null;
  latitude?: string | null;
  Latitude?: string | null;
  longitude?: string | null;
  Longitude?: string | null;
  createdBy?: string;
  CreatedBy?: string;
  createdAt?: string;
  CreatedAt?: string;
  updatedBy?: string | null;
  UpdatedBy?: string | null;
  updatedAt?: string | null;
  UpdatedAt?: string | null;
};

type LocationsApiPage = {
  items?: LocationApiItem[];
  Items?: LocationApiItem[];
  pageNumber?: number;
  PageNumber?: number;
  totalPages?: number;
  TotalPages?: number;
  totalCount?: number;
  TotalCount?: number;
  hasPreviousPage?: boolean;
  HasPreviousPage?: boolean;
  hasNextPage?: boolean;
  HasNextPage?: boolean;
};

const emptyPage = (pageNumber = 1): LocationsPage => ({
  items: [],
  pageNumber,
  totalPages: 1,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
});

const emptyLocation = (id: number): Location => ({
  id,
  mainLocation: '',
  locationImageUrl: null,
  subLocation: '',
  subLocationImageUrl: null,
  isFeature: false,
  imageUrl: null,
  country: '',
  city: '',
  district: '',
  street: null,
  latitude: null,
  longitude: null,
  createdBy: '',
  createdAt: '',
  updatedBy: null,
  updatedAt: null,
});

function normalizeLocation(item: LocationApiItem): Location {
  const mainLocation = item.mainLocation ?? item.MainLocation ?? item.city ?? item.City ?? '';
  const subLocation = item.subLocation ?? item.SubLocation ?? item.district ?? item.District ?? '';
  const locationImageUrl = item.locationImageUrl ?? item.LocationImageUrl ?? item.imageUrl ?? item.ImageUrl ?? null;

  return {
    id: item.id ?? item.Id ?? 0,
    mainLocation,
    locationImageUrl,
    subLocation,
    subLocationImageUrl: item.subLocationImageUrl ?? item.SubLocationImageUrl ?? null,
    isFeature: item.isFeature ?? item.IsFeature ?? false,
    imageUrl: item.imageUrl ?? item.ImageUrl ?? locationImageUrl,
    country: item.country ?? item.Country ?? '',
    city: item.city ?? item.City ?? mainLocation,
    district: item.district ?? item.District ?? subLocation,
    street: item.street ?? item.Street ?? null,
    latitude: item.latitude ?? item.Latitude ?? null,
    longitude: item.longitude ?? item.Longitude ?? null,
    createdBy: item.createdBy ?? item.CreatedBy ?? '',
    createdAt: item.createdAt ?? item.CreatedAt ?? '',
    updatedBy: item.updatedBy ?? item.UpdatedBy ?? null,
    updatedAt: item.updatedAt ?? item.UpdatedAt ?? null,
  };
}

function buildLocationsUrl(query: LocationsQuery = {}) {
  const params = new URLSearchParams();
  const pageNumber = query.pageNumber ?? 1;
  const pageSize = query.pageSize ?? 10;

  params.set('PageNumber', String(pageNumber));
  params.set('PageSize', String(pageSize));
  if (query.isFeature !== undefined) params.set('IsFeature', String(query.isFeature));

  return `${API_BASE_URL}/api/Locations?${params.toString()}`;
}

function coerceLocationPayload(payload: CreateLocationPayload): Required<Pick<CreateLocationPayload, 'mainLocation' | 'subLocation' | 'isFeature'>> & Pick<CreateLocationPayload, 'locationImage'> {
  const mainLocation = payload.mainLocation ?? payload.city ?? { en: '', de: '', it: '' };
  const subLocation = payload.subLocation ?? payload.district ?? { en: '', de: '', it: '' };
  const mainEn = mainLocation.en.trim();
  const subEn = subLocation.en.trim();

  return {
    mainLocation: {
      en: mainEn,
      de: mainLocation.de.trim() || mainEn,
      it: mainLocation.it.trim() || mainEn,
    },
    subLocation: {
      en: subEn,
      de: subLocation.de.trim() || subEn,
      it: subLocation.it.trim() || subEn,
    },
    locationImage: payload.locationImage ?? null,
    isFeature: payload.isFeature ?? false,
  };
}

function buildLocationFormData(payload: CreateLocationPayload | UpdateLocationPayload) {
  const coerced = coerceLocationPayload(payload);
  const formData = new FormData();

  if ('id' in payload) formData.append('Id', String(payload.id));
  formData.append('MainLocation.En', coerced.mainLocation.en);
  formData.append('MainLocation.De', coerced.mainLocation.de);
  formData.append('MainLocation.It', coerced.mainLocation.it);
  formData.append('SubLocation.En', coerced.subLocation.en);
  formData.append('SubLocation.De', coerced.subLocation.de);
  formData.append('SubLocation.It', coerced.subLocation.it);
  formData.append('IsFeature', String(coerced.isFeature));
  if (coerced.locationImage) formData.append('LocationImage', coerced.locationImage);

  return formData;
}

async function readLocationCommandResponse(res: Response, fallback: string): Promise<Location | number | boolean> {
  const text = await res.text();
  if (!res.ok) {
    console.error('[Locations] Command failed:', res.status, text);
    throw new Error(text || fallback);
  }

  if (!text) return true;

  try {
    const json: ApiResponse<LocationApiItem | number | boolean> = JSON.parse(text);
    if (json.success === false) throw new Error(json.message || fallback);
    const data = json.data ?? json;
    if (typeof data === 'number' || typeof data === 'boolean') return data;
    return normalizeLocation(data as LocationApiItem);
  } catch (error) {
    if (error instanceof Error && error.message !== 'Unexpected end of JSON input') throw error;
    const numeric = parseInt(text, 10);
    return Number.isFinite(numeric) ? numeric : true;
  }
}

export async function getLocations(pageNumberOrQuery: number | LocationsQuery = 1): Promise<LocationsPage> {
  const query = typeof pageNumberOrQuery === 'number' ? { pageNumber: pageNumberOrQuery } : pageNumberOrQuery;
  const pageNumber = query.pageNumber ?? 1;

  try {
    const res = await fetch(buildLocationsUrl(query), {
      headers: { ...getHeaders() },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.warn('[Locations] Fetch failed:', res.status, text);
      return emptyPage(pageNumber);
    }

    const json: ApiResponse<LocationsApiPage | LocationApiItem[]> = await res.json();
    const data = json.data ?? json;

    if (Array.isArray(data)) {
      return {
        ...emptyPage(pageNumber),
        items: data.map(normalizeLocation),
        totalCount: data.length,
      };
    }

    const page = data as LocationsApiPage;
    const items = page.items ?? page.Items ?? [];

    return {
      items: items.map(normalizeLocation),
      pageNumber: page.pageNumber ?? page.PageNumber ?? pageNumber,
      totalPages: page.totalPages ?? page.TotalPages ?? 1,
      totalCount: page.totalCount ?? page.TotalCount ?? items.length,
      hasPreviousPage: page.hasPreviousPage ?? page.HasPreviousPage ?? false,
      hasNextPage: page.hasNextPage ?? page.HasNextPage ?? false,
    };
  } catch (error) {
    console.warn('Network error when fetching locations:', error);
    return emptyPage(pageNumber);
  }
}

export async function getLocationById(id: number, lang = 'en'): Promise<Location> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/Locations/${id}`, {
      headers: { ...getHeaders(lang) },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn('[Locations] Fetch by ID failed:', res.status);
      return emptyLocation(id);
    }

    const json: ApiResponse<LocationApiItem> = await res.json();
    return normalizeLocation((json.data ?? json) as LocationApiItem);
  } catch (error) {
    console.warn('Network error when fetching location by ID:', error);
    return emptyLocation(id);
  }
}

export async function createLocation(payload: CreateLocationPayload): Promise<Location | number> {
  const res = await fetch(`${API_BASE_URL}/api/Locations`, {
    method: 'POST',
    headers: { ...getHeaders() },
    body: buildLocationFormData(payload),
  });

  return readLocationCommandResponse(res, 'Failed to create location.') as Promise<Location | number>;
}

export async function updateLocation(payload: UpdateLocationPayload): Promise<Location | number | boolean> {
  const res = await fetch(`${API_BASE_URL}/api/Locations`, {
    method: 'PUT',
    headers: { ...getHeaders() },
    body: buildLocationFormData(payload),
  });

  return readLocationCommandResponse(res, 'Failed to update location.');
}

export async function deleteLocation(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Locations/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[Locations] Delete failed:', res.status, text);
    throw new Error('Failed to delete location.');
  }
}

export function resolveLocationImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}/${path}`;
}
