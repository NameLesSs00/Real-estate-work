import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';

export interface Admin {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface PaginatedAdmins {
  items: Admin[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UpdateAdminPayload {
  userName: string;
  email: string;
  phoneNumber: string;
}

/**
 * GET /api/Admins
 * Returns a paginated list of administrators.
 */
export async function getAdmins(page: number = 1, size: number = 10): Promise<PaginatedAdmins> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}/api/Admins?PageNumber=${page}&PageSize=${size}`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch administrators.');
  }

  const json = await res.json();

  // Handle the structure: { success: true, data: [...] }
  if (json.success && Array.isArray(json.data)) {
    return {
      items: json.data,
      pageNumber: 1,
      totalPages: 1,
      totalCount: json.data.length,
      hasPreviousPage: false,
      hasNextPage: false
    };
  }

  // Fallback for standard paginated object or the data field itself
  return json.data || json;
}

/**
 * PUT /api/Admins/update
 * Updates the current administrator's profile information.
 */
export async function updateAdmin(payload: UpdateAdminPayload): Promise<void> {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}/api/Admins/update`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    let errorMessage = json.message || 'Failed to update profile information.';
    
    if (Array.isArray(json.errors)) {
      errorMessage = json.errors.join(' ');
    } else if (Array.isArray(json)) {
      errorMessage = json.join(' ');
    }
    
    throw new Error(errorMessage);
  }
}
