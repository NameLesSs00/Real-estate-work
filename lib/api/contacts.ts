import { API_BASE_URL } from './config';
import { getHeaders } from './common';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ContactType = 'BuyUnit' | 'SellUnit' | 'RentUnit' | 'GeneralInquiry' | string;
export type HearFrom = 'SocialMedia' | 'Friend' | 'SearchEngine' | 'Other' | string;
export type ContactStatus = 'Pending' | 'Viewed' | string;

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: ContactType;
  hearFrom: HearFrom;
  status: ContactStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: ContactType;
  hearFrom: HearFrom;
  notes: string;
}

export interface PaginatedContacts {
  items: Contact[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

/** GET /api/Contacts */
export async function getContacts(pageNumber = 1, pageSize = 10): Promise<PaginatedContacts> {
  const dummy: PaginatedContacts = { items: [], pageNumber, totalPages: 1, totalCount: 0, hasPreviousPage: false, hasNextPage: false };
  try {
    const params = new URLSearchParams({
      PageNumber: pageNumber.toString(),
      PageSize: pageSize.toString(),
    });

    const res = await fetch(`${API_BASE_URL}/api/Contacts?${params}`, {
      headers: { ...getHeaders() },
    });

    if (!res.ok) {
      console.warn('[Contacts] Fetch failed:', res.status);
      return dummy;
    }

    const json = await res.json();
    console.log('[API] GET /api/Contacts response:', json);
    
    // 1. Raw Array fallback
    if (Array.isArray(json)) {
      return {
        items: json,
        pageNumber: 1,
        totalPages: 1,
        totalCount: json.length,
        hasPreviousPage: false,
        hasNextPage: false
      };
    }

    // 2. Wrapped response (either paginated object or array)
    const isSuccess = json.success || json.succeeded;
    const data = json.data;

    if (isSuccess && data) {
      if (Array.isArray(data)) {
        return {
          items: data,
          pageNumber: 1,
          totalPages: 1,
          totalCount: data.length,
          hasPreviousPage: false,
          hasNextPage: false
        };
      }
      return data;
    }
    
    // 3. Fallback structure if neither
    if (json.items && Array.isArray(json.items)) {
      return json;
    }

    return dummy;
  } catch (error) {
    console.warn('Network error when fetching contacts:', error);
    return dummy;
  }
}

/** POST /api/Contacts */
export async function createContact(payload: CreateContactPayload): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/Contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit contact request.');
  }

  const json = await res.json();
  const isSuccess = json.success || json.succeeded;
  if (!isSuccess) {
    throw new Error(json.message || 'Failed to submit contact request.');
  }

  return json.data;
}

/** GET /api/Contacts/{id} */
export async function getContactById(id: number): Promise<Contact> {
  const res = await fetch(`${API_BASE_URL}/api/Contacts/${id}`, {
    headers: { ...getHeaders() },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch contact details.');
  }

  const json = await res.json();
  const data = json.data || json;
  return data;
}

/** DELETE /api/Contacts/{id} */
export async function deleteContact(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/Contacts/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders() },
  });

  if (!res.ok) {
    throw new Error('Failed to delete contact.');
  }

  const json = await res.json();
  const isSuccess = json.success || json.succeeded;
  const data = json.data;
  
  return data ?? isSuccess === true;
}

/** PUT /api/Contacts/{id}/status */
export async function updateContactStatus(id: number, status: ContactStatus): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/Contacts/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error('Failed to update contact status.');
  }

  const json = await res.json();
  const isSuccess = json.success || json.succeeded;
  const data = json.data;

  return data ?? isSuccess === true;
}
