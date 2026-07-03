/**
 * =============================================================
 * MINATLOU SECURITY & PROJECTS — AUTH / SESSION UTILITIES
 * =============================================================
 * Stores the JWT and a light user snapshot in localStorage so
 * pages can render user-aware UI (navbar, dashboard) without an
 * extra round trip. The token itself is always the source of
 * truth for the backend — this is just a client-side cache.
 * =============================================================
 */

const AUTH_TOKEN_KEY = 'minatlou_auth_token';
const AUTH_USER_KEY = 'minatlou_auth_user';

const Auth = {
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setSession(token, user) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  getUser() {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  isLoggedIn() {
    return !!Auth.getToken();
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.href = 'login.html';
  },

  /**
   * Redirects to login if there is no active session. Call at
   * the top of any page that requires authentication (dashboard,
   * apply flow).
   */
  requireAuth() {
    if (!Auth.isLoggedIn()) {
      const next = encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search);
      window.location.href = `login.html?next=${next}`;
      return false;
    }
    return true;
  },
};

window.Auth = Auth;
