import { API_BASE_URL } from './config';
import { getHeaders } from './common';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Question {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface CreateQuestionPayload {
  title: string;
  description: string;
}

export interface UpdateQuestionPayload {
  id: number;
  title: string;
  description: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseQuestionsResponse(text: string): Question[] {
  try {
    const json = JSON.parse(text);
    // Flat array response: [{id, title, description, createdAt}]
    if (Array.isArray(json)) return json as Question[];
    // Wrapped response: { success, data: [...] }
    if (json.data && Array.isArray(json.data)) return json.data as Question[];
    if (json.success === false) throw new Error(json.message || 'Failed to fetch questions.');
    return [];
  } catch {
    return [];
  }
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

/** GET /api/Questions — returns all questions */
export async function getQuestions(): Promise<Question[]> {
  const res = await fetch(`${API_BASE_URL}/api/Questions`, {
    headers: { ...getHeaders() },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    console.warn('[Questions] Fetch failed:', res.status, text);
    throw new Error('Failed to fetch questions.');
  }
  const text = await res.text();
  return parseQuestionsResponse(text);
}

/** GET /api/Questions/{id} */
export async function getQuestionById(id: number): Promise<Question> {
  const res = await fetch(`${API_BASE_URL}/api/Questions/${id}`, {
    headers: { ...getHeaders() },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('[Questions] Fetch by ID failed:', res.status, text);
    throw new Error('Failed to fetch question.');
  }
  const json = await res.json();
  // May be wrapped or bare
  return (json.data ?? json) as Question;
}

/** POST /api/Questions */
export async function createQuestion(payload: CreateQuestionPayload): Promise<Question> {
  const res = await fetch(`${API_BASE_URL}/api/Questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders(undefined, true) },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log('[Questions] Create response:', text);
  if (!res.ok) {
    console.error('[Questions] Create failed:', res.status, text);
    try {
      const j = JSON.parse(text);
      throw new Error(j.message || 'Failed to create question.');
    } catch {
      throw new Error('Failed to create question.');
    }
  }
  try {
    const j = JSON.parse(text);
    return (j.data ?? j) as Question;
  } catch {
    throw new Error('Unexpected response from server.');
  }
}

/** PUT /api/Questions */
export async function updateQuestion(payload: UpdateQuestionPayload): Promise<Question> {
  const res = await fetch(`${API_BASE_URL}/api/Questions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders(undefined, true) },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log('[Questions] Update response:', text);
  if (!res.ok) {
    console.error('[Questions] Update failed:', res.status, text);
    try {
      const j = JSON.parse(text);
      throw new Error(j.message || 'Failed to update question.');
    } catch {
      throw new Error('Failed to update question.');
    }
  }
  try {
    const j = JSON.parse(text);
    return (j.data ?? j) as Question;
  } catch {
    throw new Error('Unexpected response from server.');
  }
}

/** DELETE /api/Questions/{id} */
export async function deleteQuestion(id: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/Questions/${id}`, {
    method: 'DELETE',
    headers: { ...getHeaders(undefined, true) },
  });
  const text = await res.text();
  console.log('[Questions] Delete response:', text);
  if (!res.ok) {
    console.error('[Questions] Delete failed:', res.status, text);
    throw new Error('Failed to delete question.');
  }
  return text.toLowerCase() === 'true' || res.status === 200 || res.status === 204;
}
