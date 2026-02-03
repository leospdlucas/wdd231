// site.js — Year + last modified for siteplan
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('currentyear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  const lmEl = document.getElementById('lm');
  if (lmEl) lmEl.textContent = `Last updated: ${document.lastModified}`;
});
