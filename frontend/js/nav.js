/**
 * =============================================================
 * MINATLOU SECURITY & PROJECTS — SHARED NAV / FOOTER BEHAVIOR
 * =============================================================
 * Handles the mobile hamburger menu, marks the current page's
 * nav link active, back-to-top button, and swaps the
 * Login/Register nav item for Dashboard/Logout when a session
 * is active. Included on every page.
 * =============================================================
 */

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

function initActiveNavLink() {
  const current = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'home';
  const map = { index: 'home' };
  const key = map[current] || current;
  document.querySelectorAll('[data-nav]').forEach((el) => {
    el.classList.toggle('active-link', el.getAttribute('data-nav') === key);
  });
}

function initBackToTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initAuthAwareNav() {
  const isLoggedIn = window.Auth && Auth.isLoggedIn();
  const user = window.Auth && Auth.getUser();

  document.querySelectorAll('[data-auth="guest-only"]').forEach((el) => {
    el.style.display = isLoggedIn ? 'none' : '';
  });
  document.querySelectorAll('[data-auth="user-only"]').forEach((el) => {
    el.style.display = isLoggedIn ? '' : 'none';
  });
  document.querySelectorAll('[data-user-name]').forEach((el) => {
    if (user) el.textContent = user.fullName || user.email || 'Account';
  });
  document.querySelectorAll('[data-logout]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  });
}

function triggerReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initActiveNavLink();
  initBackToTop();
  initAuthAwareNav();
  triggerReveals();
});
