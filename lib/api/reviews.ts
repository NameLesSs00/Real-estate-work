import { API_BASE_URL } from './config';
import { getHeaders } from './common';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  fullName: string;
  unitId: number;
  unitName: string;
  comment: string;
  rate: number;
  createdAt: string;
}

export interface PaginatedReviews {
  reviews: Review[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface AverageRatingData {
  unitId: number;
  averageRating: number;
}

export interface CreateReviewPayload {
  fullName: string;
  unitId: number;
  comment: string;
  rate: number;
}

export interface UpdateReviewPayload {
  id: number;
  fullName: string;
  comment: string;
  rate: number;
}

// ── API Functions ─────────────────────────────────────────────────────────────

/** GET /api/Review — paginated list of all reviews */
export async function getReviews(
  pageNumber = 1,
  pageSize = 100
): Promise<PaginatedReviews> {
  const dummy: PaginatedReviews = { reviews: [], pageNumber, pageSize, totalCount: 0 };
  try {
    const params = new URLSearchParams({
      pageNumber: String(pageNumber),
      pageSize: String(pageSize),
    });
    const res = await fetch(`${API_BASE_URL}/api/Review?${params}`, {
      headers: { ...getHeaders(undefined, true) },
    });
    if (!res.ok) {
      console.warn('[Reviews] Fetch failed:', res.status);
      return dummy;
    }
    const json = await res.json();
    return json.data ?? json;
  } catch (error) {
    console.warn('Network error when fetching reviews:', error);
    return dummy;
  }
}

/** GET /api/Review/unit/{unitId} — all reviews for a specific unit */
export async function getReviewsByUnit(unitId: number): Promise<Review[]> {
  const res = await fetch(`${API_BASE_URL}/api/Review/unit/${unitId}`, {
    headers: { ...getHeaders(undefined, true) },
  });
  if (!res.ok) throw new Error('Failed to fetch unit reviews.');
  const json = await res.json();
  // Returns an array directly or wrapped
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  return [];
}

/** GET /api/Review/unit/{unitId}/average — average rating for a unit */
export async function getAverageRating(unitId: number): Promise<AverageRatingData> {
  const res = await fetch(
    `${API_BASE_URL}/api/Review/unit/${unitId}/average`,
    { headers: { ...getHeaders(undefined, true) } }
  );
  if (!res.ok) throw new Error('Failed to fetch average rating.');
  const json = await res.json();
  // Returns { success, data: { unitId, averageRating } }
  return json.data ?? json;
}

/** POST /api/Review — create a new review (no auth required) */
export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const res = await fetch(`${API_BASE_URL}/api/Review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(undefined, true),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to submit review.');
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/Review — update an existing review */
export async function updateReview(payload: UpdateReviewPayload): Promise<Review> {
  const res = await fetch(`${API_BASE_URL}/api/Review`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getHeaders(undefined, true),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update review.');
  const json = await res.json();
  return json.data ?? json;
}

/** DELETE /api/Review/{id} — delete a review (admin uses auth headers) */
export async function deleteReview(id: number, withAuth = false): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/Review/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders(undefined, !withAuth) },
  });
  if (!res.ok) throw new Error('Failed to delete review.');
}
