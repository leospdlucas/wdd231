
// products.js — render catalog with search/filter; lazy-load via loading=lazy; use template literals only
(async () => {
  const root = document.getElementById('products');
  if (!root) return;

  const res = await fetch('data/products.json');
  const { products } = await res.json();

  const searchEl = document.getElementById('search');
  const catEl = document.getElementById('category');
  const clearEl = document.getElementById('clear');
  const cartCount = document.getElementById('cartCount');

  function getCartCount() {
    try { return JSON.parse(localStorage.getItem('sg_cart') || '[]').length; }
    catch { return 0; }
  }
  function render(list){
    root.innerHTML = list.map(p => `
      <article class="card product-card">
        <img src="${p.image}" alt="${p.name}" width="800" height="600" loading="lazy" />
        <div class="p">
          <h3>${p.name}</h3>
          <p class="small">${p.description}</p>
          <div class="meta">
            <span class="price">${p.price}</span>
            <span class="badge">${p.category}</span>
          </div>
          <div class="controls">
            <button class="btn add" data-id="${p.id}">Add to Cart</button>
            <button class="btn ghost save" data-id="${p.id}">Save</button>
          </div>
        </div>
      </article>
    `).join('');
  }
  function applyFilters(){
    const q = (searchEl.value || '').toLowerCase().trim();
    const cat = catEl.value;
    let list = products.slice();
    if (cat && cat !== 'All') list = list.filter(p => p.category === cat);
    if (q) list = list.filter(p => [p.name, p.description].join(' ').toLowerCase().includes(q));
    render(list);
  }

  render(products);
  cartCount.textContent = getCartCount();

  searchEl.addEventListener('input', applyFilters);
  catEl.addEventListener('change', applyFilters);
  clearEl.addEventListener('click', () => { searchEl.value=''; catEl.value='All'; applyFilters(); });

  root.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add');
    const saveBtn = e.target.closest('.save');
    if (addBtn) {
      const id = Number(addBtn.dataset.id);
      const cart = JSON.parse(localStorage.getItem('sg_cart') || '[]');
      cart.push({id, qty: 1, t: Date.now()});
      localStorage.setItem('sg_cart', JSON.stringify(cart));
      cartCount.textContent = getCartCount();
    }
    if (saveBtn) {
      const id = Number(saveBtn.dataset.id);
      const saved = new Set(JSON.parse(localStorage.getItem('sg_saved') || '[]'));
      saved.add(id);
      localStorage.setItem('sg_saved', JSON.stringify(Array.from(saved)));
      saveBtn.textContent = 'Saved';
    }
  });
})();
