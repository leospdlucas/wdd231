// Responsive navigation + wayfinding
const menuBtn = document.getElementById('menu');
const primaryNav = document.getElementById('primary-nav');

if (menuBtn && primaryNav) {
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!open));
    menuBtn.classList.toggle('open');
    primaryNav.classList.toggle('open');
    menuBtn.setAttribute('aria-label', !open ? 'Close site menu' : 'Open site menu');
  });

  // Close menu on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.classList.contains('open')) {
      menuBtn.click();
    }
  });

  // Wayfinding
  const links = primaryNav.querySelectorAll('a');
  const here = location.pathname.replace(/\/$/, '/');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === './' || href === '') {
      // home
      if (here.endsWith('/')) a.setAttribute('aria-current', 'page');
    } else if (here.includes(href)) {
      a.setAttribute('aria-current', 'page');
    }
  });
}
