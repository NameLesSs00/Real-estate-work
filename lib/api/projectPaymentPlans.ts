import { API_BASE_URL } from './config';
import { getHeaders } from './common';

export type ProjectPaymentType = 'Cash' | 'Installment';
export type ProjectPaymentPlanStatus = 0 | 1;
export type ProjectPaymentPlanStatusLabel = 'Approved' | 'Sold' | string;

export interface ProjectPaymentPlan {
  id: number;
  projectId: number;
  projectName: string;
  commissionRate: number | null;
  installmentDownPayment: number;
  installmentYears?: number;
  installmentMonths: number;
  paymentType: ProjectPaymentType | string;
  status: ProjectPaymentPlanStatusLabel;
  createdBy: string;
  createdAt: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

export interface ProjectPaymentPlansQuery {
  projectId?: number;
  paymentType?: ProjectPaymentType | '';
  status?: ProjectPaymentPlanStatus | '';
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ProjectPaymentPlansPage {
  items: ProjectPaymentPlan[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateProjectPaymentPlanPayload {
  projectId: number;
  paymentType: ProjectPaymentType;
  installmentDownPayment: number;
  installmentYears: number;
  installmentMonths: number;
  commissionRate: number | null;
  status: ProjectPaymentPlanStatus;
}

export interface UpdateProjectPaymentPlanPayload extends CreateProjectPaymentPlanPayload {
  id: number;
}

type ProjectPaymentPlanApiItem = {
  id?: number;
  Id?: number;
  projectId?: number;
  ProjectId?: number;
  projectName?: string;
  ProjectName?: string;
  commissionRate?: number | null;
  CommissionRate?: number | null;
  installmentDownPayment?: number;
  InstallmentDownPayment?: number;
  installmentYears?: number;
  InstallmentYears?: number;
  installmentMonths?: number;
  InstallmentMonths?: number;
  paymentType?: string;
  PaymentType?: string;
  status?: string;
  Status?: string;
  createdBy?: string;
  CreatedBy?: string;
  createdAt?: string;
  CreatedAt?: string;
  updatedBy?: string | null;
  UpdatedBy?: string | null;
  updatedAt?: string | null;
  UpdatedAt?: string | null;
};

type ProjectPaymentPlansApiPage = {
  items?: ProjectPaymentPlanApiItem[];
  Items?: ProjectPaymentPlanApiItem[];
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

type ApiEnvelope<T> = {
  success?: boolean;
  succeeded?: boolean;
  message?: string;
  errors?: string[] | Record<string, string[]> | string | null;
  data?: T;
};

const emptyPage = (pageNumber = 1): ProjectPaymentPlansPage => ({
  items: [],
  pageNumber,
  totalPages: 1,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
});

function normalizeProjectPaymentPlan(item: ProjectPaymentPlanApiItem): ProjectPaymentPlan {
  return {
    id: item.id ?? item.Id ?? 0,
    projectId: item.projectId ?? item.ProjectId ?? 0,
    projectName: item.projectName ?? item.ProjectName ?? '',
    commissionRate: item.commissionRate ?? item.CommissionRate ?? null,
    installmentDownPayment: item.installmentDownPayment ?? item.InstallmentDownPayment ?? 0,
    installmentYears: item.installmentYears ?? item.InstallmentYears,
    installmentMonths: item.installmentMonths ?? item.InstallmentMonths ?? 0,
    paymentType: item.paymentType ?? item.PaymentType ?? 'Installment',
    status: item.status ?? item.Status ?? 'Approved',
    createdBy: item.createdBy ?? item.CreatedBy ?? '',
    createdAt: item.createdAt ?? item.CreatedAt ?? '',
    updatedBy: item.updatedBy ?? item.UpdatedBy ?? null,
    updatedAt: item.updatedAt ?? item.UpdatedAt ?? null,
  };
}

function getErrorMessage(errors: ApiEnvelope<unknown>['errors'], fallback: string) {
  if (!errors) return fallback;
  if (typeof errors === 'string') return errors;
  if (Array.isArray(errors)) return errors.join(', ') || fallback;

  const firstErrors = Object.values(errors).flat();
  return firstErrors.join(', ') || fallback;
}

function buildProjectPaymentPlansUrl(projectId: number, query: ProjectPaymentPlansQuery = {}) {
  const params = new URLSearchParams();
  const pageNumber = query.pageNumber ?? 1;
  const pageSize = query.pageSize ?? 10;

  params.set('PageNumber', String(pageNumber));
  params.set('PageSize', String(pageSize));
  params.set('ProjectId', String(query.projectId ?? projectId));
  if (query.paymentType) params.set('PaymentType', query.paymentType);
  if (query.status !== undefined && query.status !== '') params.set('Status', String(query.status));
  if (query.searchTerm) params.set('SearchTerm', query.searchTerm);
  if (query.sortBy) params.set('SortBy', query.sortBy);
  if (query.sortDirection) params.set('SortDirection', query.sortDirection);

  return `${API_BASE_URL}/api/projects/${projectId}/payment-plans?${params.toString()}`;
}

export async function getProjectPaymentPlans(projectId: number, query: ProjectPaymentPlansQuery = {}): Promise<ProjectPaymentPlansPage> {
  const pageNumber = query.pageNumber ?? 1;

  try {
    const res = await fetch(buildProjectPaymentPlansUrl(projectId, query), {
      headers: { ...getHeaders() },
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[ProjectPaymentPlans] Fetch failed:', res.status, text);
      return emptyPage(pageNumber);
    }

    const json = await res.json() as ApiEnvelope<ProjectPaymentPlansApiPage> | ProjectPaymentPlansApiPage;
    const page = ((json as ApiEnvelope<ProjectPaymentPlansApiPage>).data ?? json) as ProjectPaymentPlansApiPage;

    return {
      items: (page.items ?? page.Items ?? []).map(normalizeProjectPaymentPlan),
      pageNumber: page.pageNumber ?? page.PageNumber ?? pageNumber,
      totalPages: page.totalPages ?? page.TotalPages ?? 1,
      totalCount: page.totalCount ?? page.TotalCount ?? page.items?.length ?? page.Items?.length ?? 0,
      hasPreviousPage: page.hasPreviousPage ?? page.HasPreviousPage ?? false,
      hasNextPage: page.hasNextPage ?? page.HasNextPage ?? false,
    };
  } catch (error) {
    console.error('[ProjectPaymentPlans] Network error:', error);
    return emptyPage(pageNumber);
  }
}

export async function getProjectPaymentPlan(projectId: number, id: number): Promise<ProjectPaymentPlan> {
  const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/payment-plans/${id}`, {
    headers: { ...getHeaders() },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[ProjectPaymentPlans] Fetch by ID failed:', res.status, text);
    throw new Error('Failed to load payment plan.');
  }

  const json = await res.json() as ApiEnvelope<ProjectPaymentPlanApiItem> | ProjectPaymentPlanApiItem;
  return normalizeProjectPaymentPlan(((json as ApiEnvelope<ProjectPaymentPlanApiItem>).data ?? json) as ProjectPaymentPlanApiItem);
}

async function readCommandResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  const text = await res.text();

  if (!res.ok) {
    console.error('[ProjectPaymentPlans] Command failed:', res.status, text);
    throw new Error(text || fallbackMessage);
  }

  if (!text) return true as T;

  const json: ApiEnvelope<T> | T = JSON.parse(text);
  if (typeof json === 'object' && json !== null && 'succeeded' in json && json.succeeded === false) {
    throw new Error(getErrorMessage(json.errors, fallbackMessage));
  }
  if (typeof json === 'object' && json !== null && 'success' in json && json.success === false) {
    throw new Error(json.message || getErrorMessage(json.errors, fallbackMessage));
  }

  return typeof json === 'object' && json !== null && 'data' in json ? (json.data as T) : (json as T);
}

export async function createProjectPaymentPlan(projectId: number, payload: CreateProjectPaymentPlanPayload): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/payment-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });

  return readCommandResponse<number>(res, 'Failed to create payment plan.');
}

export async function updateProjectPaymentPlan(projectId: number, id: number, payload: UpdateProjectPaymentPlanPayload): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/payment-plans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });

  return readCommandResponse<boolean>(res, 'Failed to update payment plan.');
}

export async function deleteProjectPaymentPlan(projectId: number, id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/payment-plans/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });

  return readCommandResponse<boolean>(res, 'Failed to delete payment plan.');
}
