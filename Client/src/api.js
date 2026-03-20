import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-refresh on 401 — but NOT on the refresh route itself ──
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    // Stop if already retried OR if this is the refresh route itself
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url.includes('/auth/refresh')  // ← prevents loop
    ) {
      original._retry = true;
      try {
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh', {},
          { withCredentials: true }
        );
        localStorage.setItem('accessToken', res.data.accessToken);
        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;