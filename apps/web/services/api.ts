import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token;
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginWithTelegram(initData: string) {
  const resp = await api.post('/auth/telegram', { initData });
  const { token, user } = resp.data;
  return { token, user };
}

export async function updateProfile(data: { firstName: string }) {
  const resp = await api.patch('/auth/profile', data);
  useAuthStore.getState().updateUser({ firstName: data.firstName });
  return resp.data;
}

// ── Wallet ────────────────────────────────────────────────────────────────────

export async function fetchMyWallet() {
  const resp = await api.get('/wallet/me');
  return resp.data;
}

export async function fetchWalletStats() {
  const resp = await api.get('/wallet/stats');
  return resp.data as {
    balance: number;
    todayPayments: number;
    pendingDeposits: number;
  };
}

// ── Games ───────────────────────────────────────────────────────────────────────

export async function fetchGames() {
  const resp = await api.get('/games');
  return resp.data;
}

export async function fetchGameBySlug(slug: string) {
  const resp = await api.get(`/games/slug/${slug}`);
  return resp.data;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function fetchOrders() {
  const resp = await api.get('/orders');
  return resp.data;
}

export async function createOrder(packageId: string, uid: string, region?: string) {
  const resp = await api.post('/orders', { packageId, uid, region });
  return resp.data;
}

// ── Payment cards ─────────────────────────────────────────────────────────────

export async function fetchPaymentCards() {
  const resp = await api.get('/payments/cards');
  return resp.data;
}

// ── Deposits ──────────────────────────────────────────────────────────────────

export async function createDeposit(amount: number, cardId: string) {
  const resp = await api.post('/deposits', { amount, cardId });
  return resp.data;
}

export async function fetchMyDeposits() {
  const resp = await api.get('/deposits/me');
  return resp.data;
}

// ── Transactions ──────────────────────────────────────────────────────────────

export async function fetchMyTransactions() {
  const resp = await api.get('/transactions/me');
  return resp.data;
}

export function logout() {
  useAuthStore.getState().logout();
}

export async function pingBackend() {
  try {
    await api.post('/auth/test-connection');
    return true;
  } catch {
    return false;
  }
}

export default api;
