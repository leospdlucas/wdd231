// Deals page just shows promos
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('dealsGrid');
  const list = PRODUCTS.filter(p => p.promo);
  grid.innerHTML = list.map(productCard).join('');
});
