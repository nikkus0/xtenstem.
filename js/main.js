/* XtenSTEM — main.js */

// ── Nav scroll ───────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Mobile hamburger ─────────────────────────────────────
const toggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => mobileMenu.classList.add('open'));
}
if (mobileClose && mobileMenu) {
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
}
// Close on link click
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ── Fade-up animations (IntersectionObserver) ────────────
const fadeEls = document.querySelectorAll('.fade-up');
if ('IntersectionObserver' in window && fadeEls.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => obs.observe(el));
} else {
  // Fallback: show everything
  fadeEls.forEach(el => el.classList.add('visible'));
}

// ── Evidence bars ────────────────────────────────────────
const bars = document.querySelectorAll('.ebar-fill');
if (bars.length) {
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.dataset.width || '0';
        e.target.style.width = target + '%';
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barObs.observe(b));
}

// ── Smooth scroll (offset for fixed nav) ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── FAQ toggle (module pages) ─────────────────────────────
function togFaq(el) {
  const item = el.closest('.faq-item');
  item.classList.toggle('open');
}
// Make togFaq available globally
window.togFaq = togFaq;
