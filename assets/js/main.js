/* ── WhatsApp number — replace with real number before going live ── */
const WA_NUMBER = '51999000000';

function waLink(msg) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* Wire all data-wa elements */
document.querySelectorAll('[data-wa]').forEach(el => {
  el.setAttribute('href', waLink(el.getAttribute('data-wa')));
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener');
});

/* ── Nav: shrink on scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });
nav.classList.toggle('scrolled', window.scrollY > 30);

/* ── Store open/closed status (Piura: Mon–Sat 9:30–19:30) ── */
(function () {
  const el  = document.getElementById('storeStatus');
  const txt = document.getElementById('storeStatusText');
  if (!el || !txt) return;
  const now  = new Date();
  const day  = now.getDay();       // 0 = Sunday
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = day !== 0 && mins >= 570 && mins <= 1170; // 9:30–19:30
  if (open) {
    txt.textContent = 'Abierto ahora · te esperamos';
  } else {
    el.classList.add('closed');
    let next;
    if (day === 0 || day === 6)      next = 'lunes';
    else if (mins < 570)             next = 'hoy';
    else                             next = 'mañana';
    txt.textContent = next === 'hoy'
      ? 'Abrimos hoy 9:30 a.m.'
      : `Cerrado · abrimos ${next} 9:30 a.m.`;
  }
})();

/* ── Reveal on scroll ── */
document.body.classList.add('js-loaded');
const revealEls = document.querySelectorAll('.reveal');
function markInView() {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  revealEls.forEach(el => {
    if (el.classList.contains('in')) return;
    const r = el.getBoundingClientRect();
    if (r.top < vh - 40 && r.bottom > 0) el.classList.add('in');
  });
}
requestAnimationFrame(markInView);
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  window.addEventListener('scroll', markInView, { passive: true });
}
/* Safety net — force-visible after 1.6s so nothing stays hidden */
setTimeout(() => {
  revealEls.forEach(el => el.classList.add('in', 'shown'));
}, 1600);

/* ── Smooth scroll for anchor links ── */
const mm = document.getElementById('mobileMenu');
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
    if (mm.classList.contains('open')) mm.classList.remove('open');
  });
});

/* ── Mobile menu ── */
const burger = document.getElementById('burger');
const burgerClose = document.getElementById('burgerClose');
burger.addEventListener('click', () => {
  mm.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
});
burgerClose.addEventListener('click', () => {
  mm.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
});
/* Close on Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mm.classList.contains('open')) {
    mm.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.focus();
  }
});

/* ── Newsletter form ── */
const form = document.getElementById('newsForm');
const btn  = document.getElementById('newsBtn');
form.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('newsEmail').value.trim();
  if (!email) return;
  btn.textContent = '✓ Te sumamos';
  btn.classList.add('sent');
  form.querySelector('input').value = '';
  setTimeout(() => { btn.textContent = 'Sumarme →'; btn.classList.remove('sent'); }, 3000);
});
