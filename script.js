// Accessible mobile navigation and section-aware navigation state.
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-controls', 'navLinks');
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => anchor.addEventListener('click', event => {
  const selector = anchor.getAttribute('href');
  if (!selector || selector === '#') return;
  const target = document.querySelector(selector);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
}));
const navItems = [...document.querySelectorAll('.nav-links a')];
const trackedSections = [...document.querySelectorAll('header, section[id]')];
if ('IntersectionObserver' in window && navItems.length) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio)[0];
    if (!visible || !visible.target.id) return;
    navItems.forEach(link => {
      const active = link.getAttribute('href') === '#' + visible.target.id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
    });
  }, {rootMargin:'-20% 0px -65% 0px',threshold:[0,.15,.35]});
  trackedSections.forEach(section => observer.observe(section));
}