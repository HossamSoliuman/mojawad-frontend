// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // for Sanctum cookie-based auth if needed
});

// Attach token on every request (client-side only)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 globally — clear stale token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      // Let each page decide whether to redirect
    }
    return Promise.reject(err);
  }
);

export default api;

// ── Typed endpoint helpers ────────────────────────────────────────────────────

import type { HomeData, PaginatedResponse, Qari, SearchResult, Tilawa, User } from '@/types';

export const apiClient = {
  // Home
  getHome: () => api.get<HomeData>('/api/home').then((r) => r.data),

  // Qaris
  getQaris: (params?: { search?: string; page?: number }) =>
    api.get<PaginatedResponse<Qari>>('/api/qaris', { params }).then((r) => r.data),

  getQari: (slug: string) =>
    api
      .get<{ qari: Qari; tilawat: PaginatedResponse<Tilawa> }>(`/api/qaris/${slug}`)
      .then((r) => r.data),

  // Tilawat
  getTilawa: (slug: string) =>
    api
      .get<{ tilawa: Tilawa; related: Tilawa[]; liked: boolean; saved: boolean }>(
        `/api/tilawat/${slug}`
      )
      .then((r) => r.data),

  // Search
  search: (q: string) =>
    api.get<SearchResult>('/api/search', { params: { q } }).then((r) => r.data),

  // Auth
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/api/auth/login', { email, password }).then((r) => r.data),

  register: (name: string, email: string, password: string, password_confirmation: string) =>
    api
      .post<{ user: User; token: string }>('/api/auth/register', {
        name,
        email,
        password,
        password_confirmation,
      })
      .then((r) => r.data),

  logout: () => api.post('/api/auth/logout'),

  me: () => api.get<{ user: User }>('/api/auth/me').then((r) => r.data),

  // Interactions
  toggleLike: (tilawaId: number) =>
    api.post<{ liked: boolean; count: number }>(`/api/like/${tilawaId}`).then((r) => r.data),

  toggleSave: (tilawaId: number) =>
    api.post<{ saved: boolean }>(`/api/save/${tilawaId}`).then((r) => r.data),

  // Library
  getLibrary: (page = 1) =>
    api.get<PaginatedResponse<Tilawa>>('/api/library', { params: { page } }).then((r) => r.data),
};
