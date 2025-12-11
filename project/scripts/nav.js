// Accessible hamburger menu
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  if (!burger || !nav) return;

  function setOpen(open) {
    nav.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
  }

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
});
