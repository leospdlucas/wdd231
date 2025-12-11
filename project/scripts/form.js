
// form.js — accessible validation with localStorage persistence
(() => {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  // Prefill from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem('sg_contact') || '{}');
    for (const [k,v] of Object.entries(saved)) {
      const el = form.elements.namedItem(k);
      if (el && !el.value) el.value = v;
    }
  } catch {}

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = 'Please fix the highlighted fields.';
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem('sg_contact', JSON.stringify(data));
    localStorage.setItem('sg_name', data.name || '');
    status.textContent = 'Thanks! Your message has been saved locally for this demo.';
    form.reset();
  });
})();
