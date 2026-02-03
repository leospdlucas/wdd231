// cart.js — Shopping cart functionality with localStorage

const CART_KEY = "sgb_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addToCart(id, qtyKg = 1, thickness = "medium") {
  const items = getCart();
  const found = items.find((i) => i.id === id && i.thickness === thickness);
  
  if (found) {
    found.qtyKg += qtyKg;
  } else {
    items.push({ id, qtyKg, thickness });
  }
  
  setCart(items);
  updateCartBadge();
}

function removeFromCart(id, thickness) {
  const items = getCart();
  const index = items.findIndex(
    (item) => item.id === id && item.thickness === thickness
  );
  
  if (index > -1) {
    items.splice(index, 1);
    setCart(items);
  }
}

function cartTotal() {
  const items = getCart();
  return (
    Math.round(
      items.reduce((sum, item) => {
        const product =
          typeof PRODUCTS !== "undefined"
            ? PRODUCTS.find((p) => p.id === item.id)
            : null;
        return sum + (product ? product.priceKg * item.qtyKg : 0);
      }, 0) * 100
    ) / 100
  );
}

function clearCart() {
  setCart([]);
  updateCartBadge();
}
