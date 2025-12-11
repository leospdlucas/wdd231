// Year + last modified
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('currentyear');
  if (y) y.textContent = new Date().getFullYear();
  const lm = document.getElementById('lm');
  if (lm) lm.textContent = `Last updated: ${document.lastModified}`;
});
