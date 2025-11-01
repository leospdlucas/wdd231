// Footer dates: current year and last modified
const yearEl = document.getElementById('currentyear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const modifiedEl = document.getElementById('lastModified');
if (modifiedEl) modifiedEl.textContent = 'Last Modification: ' + document.lastModified;
