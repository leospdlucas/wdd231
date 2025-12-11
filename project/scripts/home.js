
// home.js — render a few weekly specials from products.json
(async () => {
  const cont = document.getElementById('specials');
  if (!cont) return;
  const res = await fetch('data/products.json');
  const data = await res.json();
  // pick first 3 as "specials"
  const items = data.products.slice(0, 3);

  cont.innerHTML = items.map(p => `
    <article class="card product-card">
      <img src="${p.image}" alt="${p.name}" width="800" height="600" loading="lazy" />
      <div class="p">
        <h3>${p.name}</h3>
        <div class="meta"><span class="price">${p.price}</span><span class="small">${p.weight}</span></div>
        <button data-id="${p.id}" class="add btn">Add to Cart</button>
      </div>
    </article>
  `).join('');

  cont.addEventListener('click', (e) => {
    const b = e.target.closest('.add');
    if (!b) return;
    const id = b.dataset.id;
    const cart = JSON.parse(localStorage.getItem('sg_cart') || '[]');
    cart.push({ id: Number(id), qty: 1, t: Date.now() });
    localStorage.setItem('sg_cart', JSON.stringify(cart));
    alert('Added to cart!');
  });
})();
