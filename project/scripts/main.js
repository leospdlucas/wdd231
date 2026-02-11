// main.js — Core site functionality
(function () {
  // Helper functions
  function $(selector, root = document) { 
    return root.querySelector(selector); 
  }

  function $All(selector, root = document) { 
    return [...root.querySelectorAll(selector)]; 
  }

  // Update cart badge count
  function updateCartBadge() {
    const cartData = JSON.parse(localStorage.getItem("sgb_cart") || "[]");
    const count = cartData.length;

    // Update main badge
    const badge = $("#cart-count");
    if (badge) {
      badge.textContent = count;
    }

    // Update modal button badge if it exists
    const modalBadge = $("#cart-count-btn");
    if (modalBadge) {
      modalBadge.textContent = count;
    }
  }

  // Set active navigation link based on current page
  function setActiveNav() {
    const currentPage = location.pathname.split("/").pop() || "index.html";

    $all(".nav a").forEach((link) => {
      const href = link.getAttribute("href");
      const isActive = href === currentPage;
      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  // Set footer metadata (year and last updated)
  function setFooterMeta() {
    const yearEl = $("#year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    const lastUpdatedEl = $("#last-updated");
    if (lastUpdatedEl) {
      const now = new Date();
      lastUpdatedEl.textContent = `Last updated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    }
  }

  // Set store open/closed status
  function setOpenStatus() {
    const statusEl = $("#open-status");
    if (!statusEl) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const minutes = now.getHours() * 60 + now.getMinutes();

    const openTime = 8 * 60; // 08:00
    const closeTime = 19 * 60; // 19:00

    let message = "Closed today.";

    // Monday (1) through Saturday (6)
    if (day >= 1 && day <= 6) {
      if (minutes >= openTime && minutes < closeTime) {
        const minutesLeft = closeTime - minutes;
        const hoursLeft = Math.floor(minutesLeft / 60);
        const minsLeft = minutesLeft % 60;

        if (hoursLeft > 0) {
          message = `We are OPEN now! Closes in ${hoursLeft}h ${minsLeft}min`;
        } else {
          message = `We are OPEN now! Closes in ${minsLeft} minutes`;
        }
      } else if (minutes < openTime) {
        const minutesUntil = openTime - minutes;
        const hoursUntil = Math.floor(minutesUntil / 60);

        message = `Closed now. Opens in ${Math.max(1, hoursUntil)} hour(s)`;
      } else {
        message = "Closed for today. See you tomorrow!";
      }
    }

    statusEl.textContent = message;
  }

  // Initialize contact links
  function initContactLinks() {
    const phoneNumber = "5521999999999";

    const phoneLink = $("#phone-link");
    if (phoneLink) {
      phoneLink.href = `https://wa.me/${phoneNumber}`;
      phoneLink.textContent = "(21) 99999-9999";
    }

    const mapLink = $("#map-link");
    if (mapLink) {
      const query = encodeURIComponent(
        "Saint Gabriel Butcher Shop, Nova Iguaçu RJ"
      );
      mapLink.href = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
  }

  // Build WhatsApp message from cart contents
  function buildWaMessageFromCart() {
    const items = JSON.parse(localStorage.getItem("sgb_cart") || "[]");

    if (items.length === 0) {
      return encodeURIComponent(
        "Hello! I would like to ask about prices and availability."
      );
    }

    const lines = items
      .map((item) => {
        const product =
          typeof PRODUCTS !== "undefined"
            ? PRODUCTS.find((p) => p.id === item.id)
            : null;
        const name = product ? product.name : item.id;
        return `${name} — ${item.qtyKg.toFixed(2)}kg (${item.thickness})`;
      })
      .join("\n");

    const total = typeof cartTotal === "function" ? cartTotal() : 0;

    return encodeURIComponent(
      `Hello! I'd like to order:\n${lines}\nTotal: R$ ${total.toFixed(2)}`
    );
  }

  // Initialize WhatsApp buttons
  function initWhatsAppButtons() {
    const phoneNumber = "5521999999999";

    function getWhatsAppUrl() {
      return `https://wa.me/${phoneNumber}/?text=${buildWaMessageFromCart()}`;
    }

    const topLink = $("#wa-link");
    if (topLink) {
      topLink.href = getWhatsAppUrl();
    }

    const ctaLink = $("#wa-cta");
    if (ctaLink) {
      ctaLink.href = getWhatsAppUrl();
    }
  }

  // Initialize everything when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    // Load products if the function exists
    if (typeof loadProducts === "function") {
      loadProducts().then(() => {
        initWhatsAppButtons();
      });
    } else {
      initWhatsAppButtons();
    }

    setActiveNav();
    setFooterMeta();
    setOpenStatus();
    initContactLinks();
    updateCartBadge();
  });

  // Expose updateCartBadge globally for other scripts
  window.updateCartBadge = updateCartBadge;
})();
