// modal.js — Accessible modal dialog with focus trap
(() => {
  const modal = document.getElementById("cart-modal");
  const modalContent = document.getElementById("cart-modal-content");
  const closeBtn = modal?.querySelector(".modal-close");
  const backdrop = modal?.querySelector(".modal-backdrop");
  const cartBadge = document.getElementById("cart-count");

  if (!modal) return;

  let previouslyFocused = null;

  // Get all focusable elements inside modal
  function getFocusableElements() {
    return modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  }

  // Trap focus inside modal
  function trapFocus(e) {
    const focusable = getFocusableElements();
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  // Render cart contents inside modal
  function renderCartContent() {
    if (!modalContent) return;

    const cart = JSON.parse(localStorage.getItem("sgb_cart") || "[]");

    if (cart.length === 0) {
      modalContent.innerHTML = `<p>Your cart is empty.</p><p><a href="catalog.html">Browse the catalog</a></p>`;
      return;
    }

    const rows = cart.map((item) => {
      const product =
        typeof PRODUCTS !== "undefined"
          ? PRODUCTS.find((p) => p.id === item.id)
          : null;
      const name = product ? product.name : item.id;
      const price = product ? product.priceKg : 0;
      const subtotal = Math.round(price * item.qtyKg * 100) / 100;

      return `
        <div class="cart-item" style="display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid #eee">
          <div>
            <strong>${name}</strong><br>
            <span class="small">${item.qtyKg.toFixed(2)} kg × R$ ${price.toFixed(2)} (${item.thickness})</span>
          </div>
          <div style="text-align:right">
            <strong>R$ ${subtotal.toFixed(2)}</strong><br>
            <button class="remove-item" data-id="${item.id}" data-thickness="${item.thickness}" style="border:none;background:none;color:#991B1B;cursor:pointer;font-size:.85rem">Remove</button>
          </div>
        </div>
      `;
    });

    const total = cart.reduce((sum, item) => {
      const product =
        typeof PRODUCTS !== "undefined"
          ? PRODUCTS.find((p) => p.id === item.id)
          : null;
      const price = product ? product.priceKg : 0;
      return sum + price * item.qtyKg;
    }, 0);

    modalContent.innerHTML = `
      ${rows.join("")}
      <div style="margin-top:1rem;padding-top:.75rem;border-top:2px solid #ddd">
        <strong>Total: R$ ${total.toFixed(2)}</strong>
      </div>
      <div style="margin-top:1rem;display:flex;gap:.5rem;flex-wrap:wrap">
        <a href="order.html" class="btn">Checkout</a>
        <button id="clear-cart" class="btn secondary">Clear Cart</button>
      </div>
    `;

    // Add event listeners for remove buttons
    modalContent.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const thickness = btn.dataset.thickness;
        removeFromCart(id, thickness);
        renderCartContent();
        updateCartBadge();
      });
    });

    // Clear cart button
    const clearBtn = document.getElementById("clear-cart");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        localStorage.setItem("sgb_cart", "[]");
        renderCartContent();
        updateCartBadge();
      });
    }
  }

  // Remove item from cart
  function removeFromCart(id, thickness) {
    const cart = JSON.parse(localStorage.getItem("sgb_cart") || "[]");
    const index = cart.findIndex(
      (item) => item.id === id && item.thickness === thickness
    );
    if (index > -1) {
      cart.splice(index, 1);
      localStorage.setItem("sgb_cart", JSON.stringify(cart));
    }
  }

  // Open modal
  function openModal() {
    previouslyFocused = document.activeElement;
    renderCartContent();
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Focus first focusable element
    const focusable = getFocusableElements();
    if (focusable.length) {
      focusable[0].focus();
    }

    // Add event listeners
    document.addEventListener("keydown", handleKeydown);
    modal.addEventListener("keydown", trapFocus);
  }

  // Close modal
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Remove event listeners
    document.removeEventListener("keydown", handleKeydown);
    modal.removeEventListener("keydown", trapFocus);

    // Return focus to previously focused element
    if (previouslyFocused) {
      previouslyFocused.focus();
    }
  }

  // Handle keyboard events
  function handleKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  }

  // Event listeners
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }

  // Open modal when clicking on cart badge or "Cart" text
  if (cartBadge) {
    const cartCta = cartBadge.closest(".cart-cta");
    if (cartCta) {
      // Make the cart area clickable
      const cartTrigger = document.createElement("button");
      cartTrigger.className = "cart-trigger";
      cartTrigger.setAttribute("aria-label", "Open cart");
      cartTrigger.style.cssText =
        "display:flex;align-items:center;gap:.5rem;background:none;border:1px solid #eee;border-radius:999px;padding:.4rem .8rem;cursor:pointer";
      cartTrigger.innerHTML = `<span class="small">Cart</span><span id="cart-count-btn" class="badge" aria-live="polite">${cartBadge.textContent}</span>`;

      // Replace existing cart span and badge
      const existingSpan = cartCta.querySelector("span.small");
      if (existingSpan) existingSpan.remove();
      cartBadge.remove();
      cartCta.insertBefore(cartTrigger, cartCta.firstChild);

      cartTrigger.addEventListener("click", openModal);

      // Update the badge reference for other scripts
      window.updateCartBadgeModal = () => {
        const btn = document.getElementById("cart-count-btn");
        if (btn) {
          btn.textContent = JSON.parse(
            localStorage.getItem("sgb_cart") || "[]"
          ).length;
        }
      };
    }
  }

  // Expose openModal globally if needed
  window.openCartModal = openModal;
  window.closeCartModal = closeModal;
})();
