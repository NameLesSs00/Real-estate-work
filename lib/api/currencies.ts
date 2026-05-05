import { API_BASE_URL } from './config';
import { getHeaders } from './common';

export interface CurrencyConfig {
  usdToEgp: number;
  usdToEur: number;
}



/** GET /api/Currencies */
// Assuming this returns the current exchange rates. The schema didn't specify the exact response structure,
// but usually it's either an array of objects or an object like { egpVsUsd: 50, eurVsUsd: 0.9 }.
// For now, returning any so we can inspect it or assuming a default structure if not provided.
export interface CurrencyRatesResponse {
  egpVsUsd?: number;
  usdToEgp?: number;
  egpRate?: number;
  eurVsUsd?: number;
  usdToEur?: number;
  eurRate?: number;
}

export async function getCurrencies(): Promise<CurrencyRatesResponse> {
  const res = await fetch(`${API_BASE_URL}/api/Currencies`, {
    headers: { ...getHeaders() }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch currencies.');
  }
  // The API might return raw data or wrapped in ApiResponse depending on the backend consistency.
  // The schema says Media type text/plain, but it's likely JSON.
  const json = await res.json();
  return json;
}

/** PUT /api/Currencies/egp-vs-usd */
export async function updateEgpExchangeRate(exchangeRate: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/Currencies/egp-vs-usd`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify({ exchangeRate }),
  });
  if (!res.ok) {
    throw new Error('Failed to update EGP vs USD exchange rate.');
  }
  return true;
}

/** PUT /api/Currencies/eur-vs-usd */
export async function updateEurExchangeRate(exchangeRate: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/Currencies/eur-vs-usd`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getHeaders() },
    body: JSON.stringify({ exchangeRate }),
  });
  if (!res.ok) {
    throw new Error('Failed to update EUR vs USD exchange rate.');
  }
  return true;
}
