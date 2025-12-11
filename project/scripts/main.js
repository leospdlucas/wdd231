
function $(s, r = document) {
  return r.querySelector(s)
}

function $all(s, r = document) {
  return [...r.querySelectorAll(s)]
}

function updateCartBadge() {
  const el = $("#cart-count");

  if (!el) return;
  el.textContent = (JSON.parse(localStorage.getItem("sgb_cart") || "[]")).length;
}

function setActiveNav() {
  const page = (location.pathname.split("/").pop() || "index.html");
  $all(".nav a").forEach(a => {
    a.setAttribute("aria-current", a.getAttribute("href") === page ? "page" : "false")
  })
}

function setFooterMeta() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  const u = $("#last-updated");
  if (u) {
    const d = new Date();
    u.textContent = `Last updated: ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
  }
}

function setOpenStatus() {
  const el = $("#open-status");
  if (!el) return; const n = new Date();

  const day = n.getDay(); const m = n.getHours() * 60 + n.getMinutes();
  const open = 8 * 60, close = 19 * 60;
  let msg = "Closed today.";

  if (day >= 1 && day <= 6) {
    if (m >= open && m <= close) {
      msg = "We are OPEN now (Mon–Sat 08:00–19:00)."

    } else if (m < open) {
      msg = `Closed now. Opens in ~${Math.max(1, Math.floor((open - m) / 60))}h`;

    } else {
      msg = "Closed for today. See you tomorrow!"
    }
  }

  el.textContent = msg;
}
function initContactLinks() {
  const phoneLink = $("#phone-link");

  if (phoneLink) {
    phoneLink.href = "https://wa.me/5521999999999";
    phoneLink.textContent = "(21) 99999-9999"
  }

  const map = $("#map-link");
  if (map) {
    const q = encodeURIComponent("Saint Gabriel Butcher Shop, Nova Iguaçu RJ");
    map.href = `https://www.google.com/maps/search/?api=1&query=${q}`;
  }
}

function buildWaMessageFromCart() {
  const items = JSON.parse(localStorage.getItem("sgb_cart") || "[]");
  if (items.length === 0) return encodeURIComponent("Hello! I would like to ask about prices and availability.");

  const lines = items.map(it => { const p = (typeof PRODUCTS !== "undefined") ? PRODUCTS.find(p => p.id === it.id) : null; const name = p ? p.name : it.id; return `${name} — ${it.qtyKg.toFixed(2)}kg (${it.thickness})`; }).join("\n");
  const total = (typeof cartTotal === "function") ? cartTotal() : 0;

  return encodeURIComponent(`Hello! I'd like to order:\n${lines}\nTotal: R$ ${total.toFixed(2)}`);
}
function initWhatsAppButtons() {
  const wa = "5521999999999";
  const make = () => `https://wa.me/${wa}/?text=${buildWaMessageFromCart()}`;
  const top = $("#wa-link");

  if (top) top.href = make();

  const cta = $("#wa-cta");
  if (cta) cta.href = make();
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof loadProducts === "function") {
    loadProducts();
  }

  setActiveNav();
  setFooterMeta();
  setOpenStatus();
  initContactLinks();
  updateCartBadge();
  initWhatsAppButtons();
});
