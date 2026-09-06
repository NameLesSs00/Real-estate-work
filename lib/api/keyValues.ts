import { API_BASE_URL } from './config';
import { getHeaders } from './common';

export interface KeyValue {
  id: number;
  key: string;
  value: string;
}

export interface CreateKeyValuePayload {
  key: string;
  value: string;
}

export interface UpdateKeyValuePayload {
  id: number;
  key: string;
  value: string;
}

async function readJson<T>(res: Response, fallback: string): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    let message = fallback;
    try {
      const parsed = JSON.parse(text);
      message = parsed.message || parsed.title || message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }
  if (!text) return true as T;
  try {
    const json = JSON.parse(text);
    return (json?.data ?? json) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function getKeyValues(): Promise<KeyValue[]> {
  const res = await fetch(`${API_BASE_URL}/api/KeyValues`, {
    headers: { ...getHeaders() },
    cache: 'no-store',
  });
  return readJson<KeyValue[]>(res, 'Failed to fetch key values.');
}

export async function createKeyValue(payload: CreateKeyValuePayload): Promise<KeyValue> {
  const res = await fetch(`${API_BASE_URL}/api/KeyValues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });
  return readJson<KeyValue>(res, 'Failed to create key value.');
}

export async function updateKeyValue(payload: UpdateKeyValuePayload): Promise<KeyValue> {
  const res = await fetch(`${API_BASE_URL}/api/KeyValues`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify(payload),
  });
  return readJson<KeyValue>(res, 'Failed to update key value.');
}
