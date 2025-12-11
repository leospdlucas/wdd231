const PRODUCTS_URL = "data/products.json";

let PRODUCTS = [];
let productsReady = null;

function loadProducts() {
  if (productsReady) {
    return productsReady;
  }

  productsReady = (async () => {
    try {
      const res = await fetch(PRODUCTS_URL);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data.products)) {
        PRODUCTS = data.products;
      } else if (Array.isArray(data)) {
        PRODUCTS = data;
      } else {
        PRODUCTS = [];
      }
    } catch (err) {
      console.error("Failed to load products.json", err);
      PRODUCTS = [];
    }
    return PRODUCTS;
  })();

  return productsReady;
}
