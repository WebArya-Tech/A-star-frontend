import api from './api';

const STORAGE_KEY = 'astar_reviews';

const API_BASE = import.meta.env.DEV ? window.location.origin : 'https://api.astarclasses.com';

function readLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function writeLocal(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

async function apiFetch(method, path, body, query, useAuth = false) {
  const endpoint = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(endpoint, API_BASE);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v != null) url.searchParams.set(k, String(v));
    });
  }

  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('icfy_token');
  const isPublic =
    (method === 'GET' && endpoint === '/api/reviews') ||
    endpoint === '/api/reviews/{id}' ||
    (endpoint.startsWith('/api/reviews/') && !endpoint.startsWith('/api/reviews/me'));

  if (token && (useAuth || !isPublic)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url.toString(), {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const err = { status: response.status, message: `HTTP ${response.status}: ${response.statusText}`, data: null };
    try { err.data = await response.json(); } catch { try { err.data = await response.text(); } catch {} }
    if (response.status === 401 && token) {
      localStorage.removeItem('icfy_token');
      localStorage.removeItem('icfy_user');
      localStorage.removeItem('icfy_role');
      localStorage.removeItem('adminAuth');
    }
    throw err;
  }

  return response.headers.get('content-type')?.includes('application/json') ? await response.json() : null;
}

/**
 * OTP Authentication (for review submission)
 */

// POST /api/auth/start
export const sendReviewOtp = async (email) => {
  const response = await fetch(`${API_BASE}/api/auth/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const err = { status: response.status, message: `HTTP ${response.status}`, data: null };
    try { err.data = await response.json(); } catch {}
    throw err;
  }
  return response.json();
};

// POST /api/auth/verify — returns { token, user }
export const verifyReviewOtp = async (email, otp, name, mobile) => {
  const body = { email, otp };
  if (name) body.name = name;
  if (mobile) body.mobile = mobile;

  const response = await fetch(`${API_BASE}/api/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = { status: response.status, message: `HTTP ${response.status}`, data: null };
    try { err.data = await response.json(); } catch {}
    throw err;
  }
  const result = await response.json();
  if (result.token) {
    localStorage.setItem('icfy_token', result.token);
    localStorage.setItem('icfy_user', JSON.stringify(result.user || {}));
  }
  return result;
};

/**
 * Public Endpoints
 */

// GET /api/reviews (paginated)
export const getPublishedReviews = async (params = { page: 0, size: 10 }) => {
  try {
    return await apiFetch('GET', '/api/reviews', null, params);
  } catch {
    const all = readLocal().filter((r) => r.status === 'PUBLISHED' || !r.status);
    const page = params.page || 0;
    const size = params.size || 10;
    const start = page * size;
    return { content: all.slice(start, start + size), totalPages: Math.ceil(all.length / size), totalElements: all.length, page, size, first: page === 0, last: start + size >= all.length };
  }
};

// GET /api/reviews/{id}
export const getReviewById = async (id) => {
  try {
    return await apiFetch('GET', `/api/reviews/${id}`);
  } catch {
    return readLocal().find((r) => String(r.id) === String(id)) || null;
  }
};

/**
 * User/Guest Endpoints (require auth token)
 */

// POST /api/reviews — uses icfy_token from localStorage for auth
export const submitReview = async (data) => {
  const token = localStorage.getItem('icfy_token');
  if (!token) throw { status: 401, message: 'Authentication required. Please verify your email first.' };

  try {
    return await apiFetch('POST', '/api/reviews', data, null, true);
  } catch (error) {
    if (error?.status === 403 || error?.status === 401) throw error;
    const local = readLocal();
    const next = { ...data, id: Date.now(), status: 'PENDING', createdAt: new Date().toISOString() };
    writeLocal([next, ...local]);
    return next;
  }
};

// GET /api/reviews/me
export const getMyReviews = async (params = { page: 0, size: 10 }) => {
  const token = localStorage.getItem('icfy_token');
  if (!token) return { content: [], totalPages: 0, totalElements: 0, page: 0, size: 10, first: true, last: true };
  try {
    return await apiFetch('GET', '/api/reviews/me', null, params);
  } catch {
    const email = (() => { try { return JSON.parse(localStorage.getItem('icfy_user') || '{}').email || ''; } catch { return ''; } })();
    const mine = readLocal().filter((r) => r.email === email);
    const page = params.page || 0;
    const size = params.size || 10;
    const start = page * size;
    return { content: mine.slice(start, start + size), totalPages: Math.ceil(mine.length / size), totalElements: mine.length, page, size, first: page === 0, last: start + size >= mine.length };
  }
};

/**
 * Admin Endpoints (use Axios for proper auth interceptor support)
 */

// GET /admin/api/reviews/{id}
export const getAdminReviewById = async (id) => {
  const response = await api.get(`/admin/api/reviews/${id}`);
  return response.data;
};

// GET /admin/api/reviews
export const getAllReviewsAdmin = async (params = { page: 0, size: 10 }) => {
  const response = await api.get('/admin/api/reviews', { params });
  return response.data;
};

// POST /admin/api/reviews/{id}/approve
export const approveReview = async (id) => {
  const response = await api.post(`/admin/api/reviews/${id}/approve`);
  return response.data;
};

// POST /admin/api/reviews/{id}/reject — matches swagger RejectReviewRequest { reason }
export const rejectReview = async (id, reason) => {
  const response = await api.post(`/admin/api/reviews/${id}/reject`, { reason });
  return response.data;
};

// DELETE /admin/api/reviews/{id}
export const deleteReview = async (id) => {
  const response = await api.delete(`/admin/api/reviews/${id}`);
  return response.data;
};
