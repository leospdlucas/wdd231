import { AUTHOR } from './utils-meta.js';

document.addEventListener('DOMContentLoaded', () => {
  const tag = document.querySelector('meta[name="author"]');
  if (tag && !tag.content) tag.content = AUTHOR;
});
