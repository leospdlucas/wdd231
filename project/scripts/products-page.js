// Products page filters and sorting (arrays + conditionals)
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('grid');
  const filter = document.getElementById('filter');
  const sort = document.getElementById('sort');
  const onlyDeals = document.getElementById('onlyDeals');

  function render(){
    let items = [...PRODUCTS];
    if (filter.value !== 'all') items = items.filter(p => p.cut === filter.value);
    if (onlyDeals.checked) items = items.filter(p => p.promo);
    if (sort.value === 'name') items.sort((a,b) => a.name.localeCompare(b.name));
    if (sort.value === 'price') items.sort((a,b) => a.price - b.price);
    grid.innerHTML = items.map(productCard).join('');
  }

  [filter, sort, onlyDeals].forEach(el => el.addEventListener('change', render));
  render();
});
