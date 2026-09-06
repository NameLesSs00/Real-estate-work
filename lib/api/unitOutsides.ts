import { API_BASE_URL } from './config';
import { getHeaders } from './common';
import type { LocalizedString } from './projects';
import type { Service } from './services';

export const UNIT_OUTSIDE_PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Studio',
  'Penthouse',
  'OneBedroom',
  'TwoBedroom',
  'ThreeBedroom',
  'FourBedroom',
  'Chalet',
] as const;

export type UnitOutsidePropertyType = typeof UNIT_OUTSIDE_PROPERTY_TYPES[number];

export const UNIT_OUTSIDE_CURRENCIES = ['USD', 'EGP', 'EUR', 'GBP'] as const;

export interface UnitOutsidePrice {
  id?: number;
  currency: string;
  price: number;
}

export interface UnitOutsideImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface UnitOutsidePaymentPlan {
  id: number;
  commissionRate: number | null;
  installmentMothes: number | null;
  installmentDownPayment: number | null;
  paymentType: string;
  status?: string;
}

export interface UnitOutside {
  id: number;
  markerId?: string;
  name: string | LocalizedString;
  description: string | LocalizedString;
  price: number;
  currencyCode: string;
  prices: UnitOutsidePrice[];
  area: number;
  noBathRoom: number;
  noBedRoom: number;
  noKitchen: number;
  country: string;
  city: string;
  street: string;
  propertyType: string;
  floorNumber: number;
  view: string;
  type: string;
  status?: string;
  floorName: string;
  isFeatured: boolean;
  isActive: boolean;
  soldCount: number;
  isSoldOutside: boolean;
  noFloor: number;
  images: UnitOutsideImage[];
  paymentPlans: UnitOutsidePaymentPlan[];
  serviceIds: number[];
  services?: Service[];
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
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
  Search?: string;
  PropertyType?: string | number;
  MinPrice?: number;
  MaxPrice?: number;
  City?: string;
  Country?: string;
  IsSoldOutside?: boolean;
  NoFloor?: number;
  MinFloor?: number;
  MaxFloor?: number;
  FeatureId?: number;
  FeatureName?: string;
  SortBy?: string;
  SortDirection?: string;
  Currency?: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface UnitOutsidePaymentPlanPayload {
  commissionRate: number;
  installmentMothes: number;
  installmentDownPayment: number;
  paymentType: string;
}

export interface CreateUnitOutsidePayload {
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  currencyCode: string;
  area: number;
  noBathRoom: number;
  noBedRoom: number;
  noKitchen: number;
  country: string;
  city: string;
  street: string;
  propertyType: string;
  floorNumber: number;
  view: string;
  type: string;
  floorName: string;
  isFeatured: boolean;
  isSoldOutside: boolean;
  noFloor: number;
  prices: UnitOutsidePrice[];
  paymentPlan: UnitOutsidePaymentPlanPayload[];
  serviceIds: number[];
}

export interface UpdateUnitOutsidePayload extends CreateUnitOutsidePayload {
  id: number;
}

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

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

type UnitOutsideApiItem = Partial<UnitOutside> & {
  Id?: number;
  MarkerId?: string;
  Name?: string | LocalizedString;
  Description?: string | LocalizedString;
  Price?: number;
  CurrencyCode?: string;
  Prices?: UnitOutsidePrice[];
  Area?: number;
  NoBathRoom?: number;
  NoBedRoom?: number;
  NoKitchen?: number;
  Country?: string;
  City?: string;
  Street?: string;
  PropertyType?: string | number;
  FloorNumber?: number;
  View?: string;
  Type?: string;
  Status?: string;
  FloorName?: string;
  IsFeatured?: boolean;
  IsActive?: boolean;
  SoldCount?: number;
  IsSoldOutside?: boolean;
  NoFloor?: number;
  Images?: UnitOutsideImage[];
  PaymentPlans?: UnitOutsidePaymentPlan[];
  ServiceIds?: number[];
  Services?: Service[];
  CreatedBy?: string;
  CreatedAt?: string;
  UpdatedBy?: string;
  UpdatedAt?: string | null;
};

type UnitOutsidesApiPage = {
  items?: UnitOutsideApiItem[];
  Items?: UnitOutsideApiItem[];
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

const endpoint = '/api/unit-outsides';

const emptyPage = (pageNumber = 1): PaginatedUnitOutsides => ({
  items: [],
  pageNumber,
  totalPages: 1,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
});

function normalizePrice(price: Partial<UnitOutsidePrice> & { Id?: number; Currency?: string; Price?: number }): UnitOutsidePrice {
  return {
    id: price.id ?? price.Id,
    currency: price.currency ?? price.Currency ?? '',
    price: price.price ?? price.Price ?? 0,
  };
}

function normalizeUnitOutside(item: UnitOutsideApiItem): UnitOutside {
  const prices = (item.prices ?? item.Prices ?? []).map(normalizePrice);
  const fallbackPrice = item.price ?? item.Price ?? prices[0]?.price ?? 0;
  const fallbackCurrency = item.currencyCode ?? item.CurrencyCode ?? prices[0]?.currency ?? 'EGP';

  return {
    id: item.id ?? item.Id ?? 0,
    markerId: item.markerId ?? item.MarkerId,
    name: item.name ?? item.Name ?? '',
    description: item.description ?? item.Description ?? '',
    price: fallbackPrice,
    currencyCode: fallbackCurrency,
    prices,
    area: item.area ?? item.Area ?? 0,
    noBathRoom: item.noBathRoom ?? item.NoBathRoom ?? 0,
    noBedRoom: item.noBedRoom ?? item.NoBedRoom ?? 0,
    noKitchen: item.noKitchen ?? item.NoKitchen ?? 0,
    country: item.country ?? item.Country ?? '',
    city: item.city ?? item.City ?? '',
    street: item.street ?? item.Street ?? '',
    propertyType: String(item.propertyType ?? item.PropertyType ?? ''),
    floorNumber: item.floorNumber ?? item.FloorNumber ?? 0,
    view: item.view ?? item.View ?? '',
    type: item.type ?? item.Type ?? '',
    status: item.status ?? item.Status,
    floorName: item.floorName ?? item.FloorName ?? '',
    isFeatured: item.isFeatured ?? item.IsFeatured ?? false,
    isActive: item.isActive ?? item.IsActive ?? true,
    soldCount: item.soldCount ?? item.SoldCount ?? 0,
    isSoldOutside: item.isSoldOutside ?? item.IsSoldOutside ?? false,
    noFloor: item.noFloor ?? item.NoFloor ?? 0,
    images: item.images ?? item.Images ?? [],
    paymentPlans: item.paymentPlans ?? item.PaymentPlans ?? [],
    serviceIds: item.serviceIds ?? item.ServiceIds ?? [],
    services: item.services ?? item.Services,
    createdBy: item.createdBy ?? item.CreatedBy ?? '',
    createdAt: item.createdAt ?? item.CreatedAt ?? '',
    updatedBy: item.updatedBy ?? item.UpdatedBy ?? '',
    updatedAt: item.updatedAt ?? item.UpdatedAt ?? null,
  };
}

async function readJsonOrText<T>(res: Response, fallback: string): Promise<T> {
  const text = await res.text();

  if (!res.ok) {
    let message = fallback;
    try {
      const parsed = JSON.parse(text);
      message = parsed.message || parsed.title || message;
      if (parsed.errors) message = JSON.stringify(parsed.errors);
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  if (!text) return true as T;

  try {
    const json: ApiResponse<T> | T = JSON.parse(text);
    if (typeof json === 'object' && json && 'success' in json && (json as ApiResponse<T>).success === false) {
      throw new Error((json as ApiResponse<T>).message || fallback);
    }
    return ((json as ApiResponse<T>).data ?? json) as T;
  } catch (error) {
    if (error instanceof Error && !error.message.includes('Unexpected')) throw error;
    if (text.toLowerCase() === 'true') return true as T;
    if (text.toLowerCase() === 'false') return false as T;
    const numeric = Number(text);
    return (Number.isFinite(numeric) ? numeric : text) as T;
  }
}

export function getUnitOutsideDisplayPrice(
  unit: Pick<UnitOutside, 'prices' | 'price' | 'currencyCode'>,
  preferredCurrency?: string,
): UnitOutsidePrice {
  const prices = unit.prices ?? [];
  const targetCurrency = (preferredCurrency || 'EUR').toUpperCase();
  const preferred = prices.find((price) => price.currency.toUpperCase() === targetCurrency);
  return preferred ?? prices[0] ?? { currency: unit.currencyCode || targetCurrency, price: unit.price || 0 };
}

export function normalizeUnitOutsidePropertyType(value: string | number | undefined): string | undefined {
  if (value === undefined || value === '') return undefined;
  const raw = String(value);
  const normalized = raw.toLowerCase().replace(/[\s_-]/g, '');
  const aliases: Record<string, UnitOutsidePropertyType> = {
    '0': 'Apartment',
    apartment: 'Apartment',
    '1': 'Villa',
    villa: 'Villa',
    '2': 'Townhouse',
    townhouse: 'Townhouse',
    townhome: 'Townhouse',
    '3': 'Studio',
    studio: 'Studio',
    '4': 'Penthouse',
    penthouse: 'Penthouse',
    '5': 'OneBedroom',
    onebedroom: 'OneBedroom',
    onebed: 'OneBedroom',
    '6': 'TwoBedroom',
    twobedroom: 'TwoBedroom',
    twobedroon: 'TwoBedroom',
    twobed: 'TwoBedroom',
    '7': 'ThreeBedroom',
    threebedroom: 'ThreeBedroom',
    threebed: 'ThreeBedroom',
    '8': 'Chalet',
    chalet: 'Chalet',
    '9': 'FourBedroom',
    fourbedroom: 'FourBedroom',
    fourbed: 'FourBedroom',
  };
  return aliases[normalized] ?? raw;
}

export async function getUnitOutsides(filters: UnitOutsideFilters = {}): Promise<PaginatedUnitOutsides> {
  const pageNumber = filters.PageNumber ?? 1;
  try {
    const params = new URLSearchParams();
    if (filters.SearchTerm) params.set('SearchTerm', filters.SearchTerm);
    if (filters.Search) params.set('Search', filters.Search);
    if (filters.PropertyType !== undefined) params.set('PropertyType', String(normalizeUnitOutsidePropertyType(filters.PropertyType)));
    if (filters.MinPrice !== undefined) params.set('MinPrice', String(filters.MinPrice));
    if (filters.MaxPrice !== undefined) params.set('MaxPrice', String(filters.MaxPrice));
    if (filters.City) params.set('City', filters.City);
    if (filters.Country) params.set('Country', filters.Country);
    if (filters.IsSoldOutside !== undefined) params.set('IsSoldOutside', String(filters.IsSoldOutside));
    if (filters.NoFloor !== undefined) params.set('NoFloor', String(filters.NoFloor));
    if (filters.MinFloor !== undefined) params.set('MinFloor', String(filters.MinFloor));
    if (filters.MaxFloor !== undefined) params.set('MaxFloor', String(filters.MaxFloor));
    if (filters.FeatureId !== undefined) params.set('FeatureId', String(filters.FeatureId));
    if (filters.FeatureName) params.set('FeatureName', filters.FeatureName);
    if (filters.SortBy) params.set('SortBy', filters.SortBy);
    if (filters.SortDirection) params.set('SortDirection', filters.SortDirection);
    if (filters.Currency) params.set('Currency', filters.Currency);
    params.set('PageNumber', String(pageNumber));
    params.set('PageSize', String(filters.PageSize ?? 10));

    const data = await fetch(`${API_BASE_URL}${endpoint}?${params}`, {
      headers: { ...getHeaders() },
    }).then((res) => readJsonOrText<UnitOutsidesApiPage | UnitOutsideApiItem[]>(res, 'Failed to fetch resale units.'));

    if (Array.isArray(data)) {
      return {
        ...emptyPage(pageNumber),
        items: data.map(normalizeUnitOutside),
        totalCount: data.length,
      };
    }

    const items = data.items ?? data.Items ?? [];
    return {
      items: items.map(normalizeUnitOutside),
      pageNumber: data.pageNumber ?? data.PageNumber ?? pageNumber,
      totalPages: data.totalPages ?? data.TotalPages ?? 1,
      totalCount: data.totalCount ?? data.TotalCount ?? items.length,
      hasPreviousPage: data.hasPreviousPage ?? data.HasPreviousPage ?? false,
      hasNextPage: data.hasNextPage ?? data.HasNextPage ?? false,
    };
  } catch (error) {
    console.warn('Network error when fetching outside units:', error);
    return emptyPage(pageNumber);
  }
}

export async function getUnitOutsideById(id: number, lang?: string, currency = 'EGP'): Promise<UnitOutside> {
  const params = new URLSearchParams();
  if (currency) params.set('currency', currency);

  const data = await fetch(`${API_BASE_URL}${endpoint}/${id}?${params}`, {
    headers: { ...getHeaders(lang) },
    cache: 'no-store',
  }).then((res) => readJsonOrText<UnitOutsideApiItem>(res, 'Failed to fetch outside unit details.'));

  return normalizeUnitOutside(data);
}

export async function createUnitOutside(payload: CreateUnitOutsidePayload): Promise<number> {
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  }).then((res) => readJsonOrText<number>(res, 'Failed to create outside unit.'));
}

export async function updateUnitOutside(id: number, payload: UpdateUnitOutsidePayload): Promise<boolean> {
  return fetch(`${API_BASE_URL}${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  }).then((res) => readJsonOrText<boolean>(res, 'Failed to update outside unit.'));
}

export async function deleteUnitOutside(id: number): Promise<boolean> {
  return fetch(`${API_BASE_URL}${endpoint}/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  }).then((res) => readJsonOrText<boolean>(res, 'Failed to delete outside unit.'));
}

export async function addUnitOutsideImages(unitOutsideId: number, files: File[]): Promise<boolean> {
  const fd = new FormData();
  fd.append('UnitOutsideId', String(unitOutsideId));
  files.forEach((file) => fd.append('Images', file));

  return fetch(`${API_BASE_URL}${endpoint}/images`, {
    method: 'POST',
    headers: { ...getHeaders() },
    body: fd,
  }).then((res) => readJsonOrText<boolean>(res, 'Failed to upload outside unit images.'));
}

export async function deleteUnitOutsideImage(unitId: number, imageId: number): Promise<boolean> {
  return fetch(`${API_BASE_URL}${endpoint}/${unitId}/images/${imageId}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  }).then((res) => readJsonOrText<boolean>(res, 'Failed to delete outside unit image.'));
}

export async function markUnitOutsideSold(id: number, paymentplanId: number): Promise<boolean> {
  return fetch(`${API_BASE_URL}${endpoint}/marksold`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify({ id, paymentplanId }),
  }).then((res) => readJsonOrText<boolean>(res, 'Failed to mark outside unit as sold.'));
}

export async function getUnitOutsideSoldouts(page = 1, pageSize = 10): Promise<PaginatedUnitOutsideSoldouts> {
  const params = new URLSearchParams({
    PageNumber: String(page),
    PageSize: String(pageSize),
  });

  return fetch(`${API_BASE_URL}/api/UnitOutsideSoldouts?${params}`, {
    headers: { ...getHeaders() },
  }).then((res) => readJsonOrText<PaginatedUnitOutsideSoldouts>(res, 'Failed to fetch outside soldouts.'));
}

export async function getUnitOutsideSoldoutById(id: number): Promise<UnitOutsideSoldout> {
  return fetch(`${API_BASE_URL}/api/UnitOutsideSoldouts/${id}`, {
    headers: { ...getHeaders() },
  }).then((res) => readJsonOrText<UnitOutsideSoldout>(res, 'Failed to fetch outside soldout details.'));
}

export async function deleteUnitOutsideSoldout(id: number): Promise<boolean> {
  return fetch(`${API_BASE_URL}/api/UnitOutsideSoldouts/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  }).then((res) => readJsonOrText<boolean>(res, 'Failed to delete outside soldout.'));
}
