// order.js — Order form with WhatsApp integration
(function () {
  const summaryEl = document.getElementById("summary");
  const form = document.getElementById("order-form");
  const counterEl = document.getElementById("order-counter");
  const modeSelect = document.getElementById("mode");
  const addressWrap = document.getElementById("address-wrap");

  if (!summaryEl || !form) return;

  // Helper to get cart
  function getCart() {
    return JSON.parse(localStorage.getItem("sgb_cart") || "[]");
  }

  // Helper to calculate cart total
  function getCartTotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => {
      const product =
        typeof PRODUCTS !== "undefined"
          ? PRODUCTS.find((p) => p.id === item.id)
          : null;
      const price = product ? product.priceKg : 0;
      return sum + price * item.qtyKg;
    }, 0);
  }

  // Render a single cart line
  function getLineInfo(item) {
    const product =
      typeof PRODUCTS !== "undefined"
        ? PRODUCTS.find((p) => p.id === item.id)
        : null;
    const name = product ? product.name : item.id;
    const price = product ? product.priceKg : 0;
    const subtotal = Math.round(price * item.qtyKg * 100) / 100;

    return {
      name,
      price,
      subtotal,
      thickness: item.thickness,
      qty: item.qtyKg,
    };
  }

  // Render cart summary
  function renderSummary() {
    const cart = getCart();

    if (cart.length === 0) {
      summaryEl.innerHTML = `<p class="small">Your cart is empty. Add items from the <a href="catalog.html">catalog</a>.</p>`;
      return;
    }

    const rows = cart.map(getLineInfo);
    const total = rows.reduce((sum, row) => sum + row.subtotal, 0);

    summaryEl.innerHTML = `
      <ul style="list-style:none;padding:0;margin:0">
        ${rows
          .map(
            (row) => `
          <li style="padding:.5rem 0;border-bottom:1px solid #eee">
            <strong>${row.name}</strong><br>
            <span class="small">${row.qty.toFixed(2)} kg (${row.thickness}) • <strong>R$ ${row.subtotal.toFixed(2)}</strong></span>
          </li>
        `
          )
          .join("")}
      </ul>
      <p style="margin-top:1rem"><strong>Total: R$ ${total.toFixed(2)}</strong></p>
    `;
  }

  // Show/hide address field based on delivery mode
  function updateAddressRequirement() {
    if (!modeSelect || !addressWrap) return;

    const addressInput = addressWrap.querySelector("input");
    const isDelivery = modeSelect.value === "delivery";

    addressWrap.style.opacity = isDelivery ? "1" : ".6";
    if (addressInput) {
      addressInput.required = isDelivery;
    }
  }

  // Build WhatsApp message text
  function buildOrderText() {
    const cart = getCart();

    const itemsText = cart
      .map((item) => {
        const product =
          typeof PRODUCTS !== "undefined"
            ? PRODUCTS.find((p) => p.id === item.id)
            : null;
        const name = product ? product.name : item.id;
        return `${name} — ${item.qtyKg.toFixed(2)}kg (${item.thickness})`;
      })
      .join("\n");

    const total = getCartTotal();
    const formData = new FormData(form);

    const mode = formData.get("mode") || "pickup";
    const name = formData.get("name") || "";
    const phone = formData.get("phone") || "";
    const address = formData.get("address") || "";
    const time = formData.get("time") || "";
    const date = formData.get("date") || "";
    const notes = formData.get("notes") || "";

    const lines = [
      `📋 New ${mode.toUpperCase()} order`,
      ``,
      `👤 Name: ${name}`,
      `📞 Phone: ${phone}`,
      `📅 When: ${date} ${time}`,
    ];

    if (mode === "delivery" && address) {
      lines.push(`📍 Address: ${address}`);
    }

    lines.push(``);
    lines.push(`🛒 Items:`);
    lines.push(itemsText);
    lines.push(``);
    lines.push(`💰 Total: R$ ${total.toFixed(2)}`);

    if (notes.trim()) {
      lines.push(``);
      lines.push(`📝 Notes: ${notes}`);
    }

    return encodeURIComponent(lines.join("\n"));
  }

  // Handle mode change
  if (modeSelect) {
    modeSelect.addEventListener("change", updateAddressRequirement);
  }

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const phoneNumber = "5521999999999";
    const url = `https://wa.me/${phoneNumber}?text=${buildOrderText()}`;

    // Increment order counter
    const counterKey = "sgb_order_count";
    const currentCount = Number(localStorage.getItem(counterKey) || "0") + 1;
    localStorage.setItem(counterKey, String(currentCount));

    if (counterEl) {
      counterEl.textContent = `Orders sent: ${currentCount}`;
    }

    // Open WhatsApp in new tab
    window.open(url, "_blank", "noopener");
  });

  // Initialize
  function init() {
    renderSummary();
    updateAddressRequirement();

    // Show previous order count if any
    const previousCount = localStorage.getItem("sgb_order_count");
    if (previousCount && counterEl) {
      counterEl.textContent = `Orders sent: ${previousCount}`;
    }
  }

  // Wait for products to load if available
  if (typeof loadProducts === "function") {
    loadProducts().then(init);
  } else {
    init();
  }
})();
