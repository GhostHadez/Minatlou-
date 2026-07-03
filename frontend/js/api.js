/**
 * =============================================================
 * MINATLOU SECURITY & PROJECTS — API SERVICE LAYER
 * =============================================================
 * Single source of truth for every backend call in the app.
 * No page should call fetch() directly — everything routes
 * through the functions below so the backend team has exactly
 * one file to point at a real API.
 *
 * Swap API_BASE_URL for the real backend origin when ready.
 * All functions return Promises that resolve with parsed JSON
 * (or reject with an Error carrying a `.status` and `.data`).
 * =============================================================
 */

const API_BASE_URL = window.MINATLOU_API_BASE_URL || 'https://api.minatlousecurity.co.za';

/**
 * Low-level request helper. Attaches auth token automatically
 * when present, handles JSON parsing and error normalisation.
 */
async function apiRequest(path, { method = 'GET', body = null, auth = true, isFormData = false } = {}) {
  const headers = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = Auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const opts = { method, headers };
  if (body !== null) opts.body = isFormData ? body : JSON.stringify(body);

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, opts);
  } catch (networkErr) {
    const err = new Error('Network error — could not reach the server.');
    err.status = 0;
    err.data = null;
    throw err;
  }

  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const err = new Error((data && data.message) || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/* =============================================================
   AUTH ENDPOINTS
   ============================================================= */
const AuthAPI = {
  /**
   * POST /api/auth/register
   * body: { fullName, email, password, phone }
   */
  register(payload) {
    return apiRequest('/api/auth/register', { method: 'POST', body: payload, auth: false });
  },

  /**
   * POST /api/auth/login
   * body: { email, password }
   * expected response: { token, user: {...} }
   */
  login(payload) {
    return apiRequest('/api/auth/login', { method: 'POST', body: payload, auth: false });
  },

  /**
   * POST /api/auth/forgot-password
   * body: { email }
   */
  forgotPassword(payload) {
    return apiRequest('/api/auth/forgot-password', { method: 'POST', body: payload, auth: false });
  },
};

/* =============================================================
   JOBS ENDPOINTS
   ============================================================= */
const JobsAPI = {
  /**
   * GET /api/jobs
   * query: { search, location, type }
   */
  list(query = {}) {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(query).filter(([, v]) => v !== '' && v != null))
    );
    const qs = params.toString();
    return apiRequest(`/api/jobs${qs ? `?${qs}` : ''}`, { auth: false });
  },

  /**
   * GET /api/jobs/:id
   */
  get(id) {
    return apiRequest(`/api/jobs/${encodeURIComponent(id)}`, { auth: false });
  },
};

/* =============================================================
   APPLICATIONS ENDPOINTS
   ============================================================= */
const ApplicationsAPI = {
  /**
   * POST /api/applications/:jobId
   * body: FormData containing applicant fields + files (cv, documents[])
   */
  submit(jobId, formData) {
    return apiRequest(`/api/applications/${encodeURIComponent(jobId)}`, {
      method: 'POST',
      body: formData,
      isFormData: true,
    });
  },

  /**
   * GET /api/applications
   * Returns the current user's applications.
   */
  list() {
    return apiRequest('/api/applications');
  },
};

/* =============================================================
   PROFILE ENDPOINTS
   ============================================================= */
const ProfileAPI = {
  /**
   * GET /api/profile
   */
  get() {
    return apiRequest('/api/profile');
  },

  /**
   * PATCH /api/profile
   */
  update(payload) {
    return apiRequest('/api/profile', { method: 'PATCH', body: payload });
  },
};

// Expose on window for plain-script pages (no bundler in this build).
window.ApiService = { apiRequest, AuthAPI, JobsAPI, ApplicationsAPI, ProfileAPI, API_BASE_URL };
