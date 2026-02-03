// catalog.js — Product grid with filtering and add-to-cart

window.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  if (typeof loadProducts !== "function") {
    console.error("loadProducts is not defined. Did you include data.js?");
    return;
  }

  const searchInput = document.getElementById("q");
  const categorySelect = document.getElementById("category");
  const availabilitySelect = document.getElementById("availability");
  const THICKNESS_OPTIONS = ["thin", "medium", "thick"];

  // Check if product matches current filters
  function matchesFilters(product) {
    const searchTerm = (searchInput?.value || "").toLowerCase().trim();
    const category = categorySelect?.value || "all";
    const availability = availabilitySelect?.value || "any";

    let matches = true;

    // Category filter
    if (category !== "all") {
      matches = matches && product.category === category;
    }

    // Search filter
    if (searchTerm) {
      matches = matches && product.name.toLowerCase().includes(searchTerm);
    }

    // Availability filter
    if (availability === "in") {
      matches = matches && product.inStock;
    } else if (availability === "out") {
      matches = matches && !product.inStock;
    }

    return matches;
  }

  // Format price
  function formatPrice(value) {
    return `R$ ${value.toFixed(2)}`;
  }

  // Generate product card HTML
  function createProductCard(product) {
    const dealBadge = product.deal
      ? '<span class="badge">Deal</span>'
      : "";
    const stockText = product.inStock
      ? `${product.availabilityKg.toFixed(1)} kg`
      : "Out of stock";

    return `
      <article class="product card" data-id="${product.id}">
        <img 
          src="${product.img}" 
          alt="${product.name}" 
          loading="lazy" 
          width="480" 
          height="320"
        >
        <div class="title">${product.name} ${dealBadge}</div>
        <div class="price">
          <strong>${formatPrice(product.priceKg)}</strong> 
          <span class="small">/ kg</span>
        </div>
        <div class="small">Availability: ${stockText}</div>
        <div class="controls">
          <label class="sr-only" for="qty-${product.id}">Quantity in kg</label>
          <input 
            id="qty-${product.id}" 
            type="number" 
            inputmode="decimal" 
            step="0.1" 
            min="0.1" 
            value="1" 
            style="width:5.5rem"
          >
          <label class="sr-only" for="thick-${product.id}">Thickness</label>
          <select id="thick-${product.id}" aria-label="Thickness">
            ${THICKNESS_OPTIONS.map(
              (t) =>
                `<option value="${t}" ${t === "medium" ? "selected" : ""}>${t}</option>`
            ).join("")}
          </select>
          <button class="btn" data-add="${product.id}" ${!product.inStock ? "disabled" : ""}>
            ${product.inStock ? "Add" : "Unavailable"}
          </button>
        </div>
      </article>
    `;
  }

  // Render product grid
  function renderGrid() {
    const filteredProducts = PRODUCTS.filter(matchesFilters);

    if (filteredProducts.length === 0) {
      grid.innerHTML = `<p class="small">No products found matching your criteria.</p>`;
      return;
    }

    grid.innerHTML = filteredProducts.map(createProductCard).join("");

    // Add click event delegation for add buttons
    grid.onclick = (event) => {
      const button = event.target.closest("[data-add]");
      if (!button) return;

      const productId = button.getAttribute("data-add");
      const qtyInput = document.getElementById(`qty-${productId}`);
      const thickSelect = document.getElementById(`thick-${productId}`);

      const quantity = parseFloat(qtyInput?.value) || 1;
      const thickness = thickSelect?.value || "medium";
      const product = PRODUCTS.find((p) => p.id === productId);

      // Validation
      if (!product || !product.inStock) {
        alert("This item is currently unavailable.");
        return;
      }

      if (quantity <= 0) {
        alert("Please enter a positive quantity.");
        return;
      }

      if (quantity > product.availabilityKg) {
        alert(`Only ${product.availabilityKg.toFixed(1)} kg available.`);
        return;
      }

      // Add to cart
      addToCart(productId, quantity, thickness);

      // Visual feedback
      button.textContent = "Added!";
      button.disabled = true;
      setTimeout(() => {
        button.textContent = "Add";
        button.disabled = false;
      }, 1200);

      // Update cart badge
      if (typeof updateCartBadge === "function") {
        updateCartBadge();
      }
    };
  }

  // Initialize
  loadProducts().then(() => {
    renderGrid();

    // Attach filter event listeners
    [searchInput, categorySelect, availabilitySelect].forEach((element) => {
      if (!element) return;
      element.addEventListener("input", renderGrid);
      element.addEventListener("change", renderGrid);
    });
  });
});
