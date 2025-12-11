
const CART_KEY = "sgb_cart";
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const setCart = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

function addToCart(id, qtyKg = 1, thickness = "medium") {
  const items = getCart();
  const found = items.find(i => i.id === id && i.thickness === thickness);
  if (found) { found.qtyKg += qtyKg; }
  else { items.push({ id, qtyKg, thickness }); }
  setCart(items);
  updateCartBadge();
}

function cartTotal() {
  const items = getCart();
  return Math.round(items.reduce((sum, it) => {
    const p = PRODUCTS.find(p => p.id === it.id);
    return sum + (p ? p.priceKg * it.qtyKg : 0);
  }, 0) * 100) / 100;
}
