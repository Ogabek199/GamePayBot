import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach JWT if present
api.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token;
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Response helper to centralize error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Let callers decide how to surface errors; keep interceptor minimal.
    return Promise.reject(err);
  }
);
// ... keep the rest of the file exports ...

// Telegram WebApp helper: send initData to backend and store token
export async function loginWithTelegram(initData: string) {
  const resp = await api.post('/auth/telegram', { initData });
  const { token, user } = resp.data;
  return { token, user };
}

export async function updateProfile(data: { firstName: string }) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Updating profile with:', data);
  }
  try {
    const resp = await api.patch('/auth/profile', data);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Update response:', resp.data);
    }
    return resp.data;
  } catch (error: any) {
    console.error('API Error details:', error.response?.data || error.message);
    throw error;
  }
}

export async function fetchOrders() {
  try {
    const resp = await api.get('/orders');
    return resp.data;
  } catch (error: any) {
    console.error('Fetch orders failed:', error.message);
    throw error;
  }
}

// ──────────────────────────────────────────────
// Payment Cards — active manual-transfer cards
// ──────────────────────────────────────────────
export async function fetchPaymentCards() {
  const resp = await api.get('/payments/cards');
  return resp.data;
}

// ──────────────────────────────────────────────
// Deposits — manual card deposit flow
// ──────────────────────────────────────────────
export async function createDeposit(amount: number, cardId: string) {
  const resp = await api.post('/deposits', { amount, cardId });
  return resp.data;
}

export async function fetchMyDeposits() {
  const resp = await api.get('/deposits/me');
  return resp.data;
}

// ──────────────────────────────────────────────
// Wallet — user balance
// ──────────────────────────────────────────────
export async function fetchMyWallet() {
  const resp = await api.get('/wallet/me');
  return resp.data;
}

// ──────────────────────────────────────────────
// Transactions — deposit / order / refund history
// ──────────────────────────────────────────────
export async function fetchMyTransactions() {
  const resp = await api.get('/transactions/me');
  return resp.data;
}

export async function pingBackend() {
  try {
    const resp = await api.post('/auth/test-connection');
    if (process.env.NODE_ENV !== 'production') {
      console.log('Ping response:', resp.data);
    }
    return true;
  } catch (error: any) {
    console.error('Ping failed:', error.message);
    return false;
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gp_auth_storage');
  }
}

export default api;
