import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach JWT if present
api.interceptors.request.use((cfg) => {
  try {
    const storage = typeof window !== 'undefined' ? localStorage.getItem('gp_auth_storage') : null;
    if (storage) {
      const { state } = JSON.parse(storage);
      if (state && state.token) {
        cfg.headers = { ...cfg.headers, Authorization: `Bearer ${state.token}` };
      }
    }
  } catch (e) {
    // ignore
  }
  return cfg;
});

// Response helper to centralize error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
       // Optional: handle logout on 401
    }
    return Promise.reject(err);
  }
);

// Telegram WebApp helper: send initData to backend and store token
export async function loginWithTelegram(initData: string) {
  const resp = await api.post('/auth/telegram', { initData });
  const { token, user } = resp.data;
  return { token, user };
}

export async function updateProfile(data: { firstName: string }) {
  console.log('Updating profile with:', data);
  try {
    const resp = await api.patch('/auth/profile', data);
    console.log('Update response:', resp.data);
    return resp.data;
  } catch (error: any) {
    console.error('API Error details:', error.response?.data || error.message);
    throw error;
  }
}

export async function pingBackend() {
  try {
    const resp = await api.post('/auth/test-connection');
    console.log('Ping response:', resp.data);
    return true;
  } catch (error: any) {
    console.error('Ping failed:', error.message);
    return false;
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gp_auth_storage');
    window.location.href = '/';
  }
}

export default api;
