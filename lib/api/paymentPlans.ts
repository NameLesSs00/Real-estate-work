import { API_BASE_URL } from './config';
import { getAccessToken } from '@/lib/auth/tokens';

function authHeader(): Record<string, string> {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface PaymentPlan {
  id: number;
  unitId: number;
  unitName: string;
  installmentDownPayment: number;
  installmentMonths: number;
  paymentType: string;
  unitStatus: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string | null;
}

export interface CreatePaymentPlanPayload {
  paymentType: string;
  unitId: number;
  installmentDownPayment: number;
  installmentYears: number;
}

export interface UpdatePaymentPlanPayload {
  paymentPlanId: number;
  paymentType: string;
  status: number;
  installmentDownPayment: number;
  installmentYears: number;
}

/** GET /api/payment-plans/unit/{unitId} */
export async function getPaymentPlansByUnit(unitId: number): Promise<PaymentPlan[]> {
  const res = await fetch(`${API_BASE_URL}/api/payment-plans/unit/${unitId}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error('Failed to fetch payment plans.');
  const json = await res.json();
  return json.data ?? json;
}

/** POST /api/payment-plans */
export async function createPaymentPlan(payload: CreatePaymentPlanPayload): Promise<number> {
  const res = await fetch(`${API_BASE_URL}/api/payment-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create payment plan.');
  const json = await res.json();
  return json.data ?? json;
}

/** PUT /api/payment-plans */
export async function updatePaymentPlan(payload: UpdatePaymentPlanPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/payment-plans`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update payment plan.');
}

/** DELETE /api/payment-plans/{id} */
export async function deletePaymentPlan(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/payment-plans/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Failed to delete payment plan.');
}
