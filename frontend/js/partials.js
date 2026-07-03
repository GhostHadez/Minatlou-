/**
 * =============================================================
 * MINATLOU SECURITY & PROJECTS — SHARED NAVBAR / FOOTER PARTIALS
 * =============================================================
 * Keeps the navbar and footer markup in exactly one place so
 * branding edits (logo, links, contact info) only need to
 * happen once. Each page includes an empty
 * <div id="site-navbar"></div> and <div id="site-footer"></div>
 * which get filled in on DOMContentLoaded, before nav.js runs
 * its behavior wiring.
 * =============================================================
 */

const SITE_NAV_HTML = `
<nav id="navbar">
  <a class="nav-logo" href="index.html">
    <img src="assets/img/logo.png" alt="Minatlou Logo"/>
    <span>MINATLOU<em>SECURITY & PROJECTS</em></span>
  </a>
  <ul class="nav-links">
    <li><a href="index.html" data-nav="home">Home</a></li>
    <li><a href="about.html" data-nav="about">About</a></li>
    <li><a href="services.html" data-nav="services">Services</a></li>
    <li><a href="careers.html" data-nav="careers">Careers</a></li>
    <li><a href="gallery.html" data-nav="gallery">Gallery</a></li>
    <li><a href="contact.html" data-nav="contact">Contact</a></li>
    <li data-auth="guest-only"><a href="login.html" data-nav="login">Sign In</a></li>
    <li data-auth="user-only"><a href="dashboard.html" data-nav="dashboard">Dashboard</a></li>
  </ul>
  <div class="hamburger" onclick="toggleMenu()">
    <span></span><span></span><span></span>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
  <a href="services.html">Services</a>
  <a href="careers.html">Careers</a>
  <a href="gallery.html">Gallery</a>
  <a href="contact.html">Contact</a>
  <a href="login.html" data-auth="guest-only">Sign In</a>
  <a href="dashboard.html" data-auth="user-only">Dashboard</a>
  <a href="#" data-auth="user-only" data-logout>Logout</a>
</div>
`;

const SITE_FOOTER_HTML = `
<footer>
  <div class="container">
    <img class="footer-logo" src="assets/img/logo.png" alt="Minatlou Logo" onclick="window.location.href='index.html'"/>
    <div class="footer-name">Minatlou Security & Projects</div>
    <div class="footer-sub">Specialising in Security Services · Mmabatho, North West Province</div>
    <div class="footer-socials">
      <a href="https://wa.me/27615254281" target="_blank" rel="noopener" class="social-btn" title="WhatsApp">
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
      <a href="tel:+27183840333" class="social-btn" title="Call Us">📞</a>
      <a href="mailto:info@minatlousp.co.za" class="social-btn" title="Email">✉️</a>
    </div>
    <ul class="footer-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="services.html">Services</a></li>
      <li><a href="careers.html">Careers</a></li>
      <li><a href="gallery.html">Gallery</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <div class="footer-copy">&copy; <span id="footer-year"></span> Minatlou Security &amp; Projects. All rights reserved.</div>
    <div class="footer-reg">Company Reg: 2010/0505/23 &nbsp;|&nbsp; PSIRA Reg: 2353214 &nbsp;|&nbsp; Owner: Motlalepule Annah Taile</div>
  </div>
</footer>
<a class="wa-float" href="https://wa.me/27615254281" target="_blank" rel="noopener" title="Chat on WhatsApp">
  <span class="wa-tooltip">Chat with us!</span>
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
</a>
<button class="back-top" id="backTop" aria-label="Back to top">▲</button>
`;

function injectPartials() {
  const navMount = document.getElementById('site-navbar');
  if (navMount) navMount.innerHTML = SITE_NAV_HTML;

  const footerMount = document.getElementById('site-footer');
  if (footerMount) {
    footerMount.innerHTML = SITE_FOOTER_HTML;
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
}

// Run before other DOMContentLoaded listeners that depend on the
// injected markup (nav.js registers its own listener separately
// and DOM order guarantees this file loads first).
document.addEventListener('DOMContentLoaded', injectPartials);
