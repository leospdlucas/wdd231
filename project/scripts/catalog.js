window.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  if (typeof loadProducts !== "function") {
    console.error("loadProducts is not defined. Did you include data.js?");
    return;
  }

  const q = document.getElementById("q");
  const category = document.getElementById("category");
  const availability = document.getElementById("availability");
  const THICKNESS = ["thin", "medium", "thick"];

  function matches(p) {
    const term = (q?.value || "").toLowerCase().trim();
    const cat = (category?.value || "all");
    const avail = (availability?.value || "any");
    let ok = true;

    if (cat !== "all") ok = ok && p.category === cat;
    if (term) ok = ok && p.name.toLowerCase().includes(term);
    if (avail === "in") ok = ok && p.inStock;
    if (avail === "out") ok = ok && !p.inStock;

    return ok;
  }

  const price = v => `R$ ${v.toFixed(2)}`;

  function card(p) {
    return `<article class="product card" data-id="${p.id}">
    <img src="${p.img}" alt="${p.name}" loading="lazy" width="480" height="320">
    <div class="title">${p.name} ${p.deal ? '<span class="badge">Deal</span>' : ''}</div>
    <div class="price"><strong>${price(p.priceKg)}</strong> <span class="small">/ kg</span></div>
    <div class="small">Availability: ${p.inStock ? `${p.availabilityKg.toFixed(1)} kg` : 'Out of stock'}</div>
    <div class="controls">
      <label class="sr-only" for="qty-${p.id}">Quantity in kg</label>
      <input id="qty-${p.id}" type="number" inputmode="decimal" step="0.1" min="0.1" value="1" style="width:5.5rem">
      <select id="thick-${p.id}" aria-label="Thickness">
        ${THICKNESS.map(t => `<option value="${t}" ${t === 'medium' ? 'selected' : ''}>${t}</option>`).join("")}
      </select>
      <button class="btn" data-add="${p.id}">Add</button>
    </div>
  </article>`;
  }

  function render() {
    const items = PRODUCTS.filter(matches);
    grid.innerHTML = items.map(card).join("");

    grid.onclick = (ev) => {
      const btn = ev.target.closest("[data-add]");
      if (!btn) return;

      const id = btn.getAttribute("data-add");
      const qty = parseFloat(document.getElementById(`qty-${id}`).value) || 1;
      const thick = document.getElementById(`thick-${id}`).value || "medium";
      const p = PRODUCTS.find(p => p.id === id);

      if (!p || !p.inStock) {
        alert("Item unavailable at the moment.");
        return;
      }

      if (qty <= 0) {
        alert("Please enter a positive quantity.");
        return;
      }

      addToCart(id, qty, thick);
      btn.textContent = "Added!";
      setTimeout(() => btn.textContent = "Add", 1200);
      updateCartBadge();
    };
  }

  loadProducts().then(() => {
    render();

    [q, category, availability].forEach(c => {
      if (!c) return;
      c.addEventListener("input", render);
      c.addEventListener("change", render);
    });
  });
});
