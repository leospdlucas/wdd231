
(function () {
  const summaryEl = document.getElementById("summary");
  const form = document.getElementById("order-form");
  const counterEl = document.getElementById("order-counter");

  if (!summaryEl || !form) 
    return;

  function line(it) { 
    const p = PRODUCTS.find(p => p.id === it.id); 
    const name = p ? p.name : it.id; 
    const price = p ? p.priceKg : 0; 
    const sub = Math.round(price * it.qtyKg * 100) / 100;
    
    return { name, price, sub, thickness: it.thickness, qty: it.qtyKg }; 
  }

  function renderSummary() { 
    const cart = getCart(); 

    if (cart.length === 0) { 
      summaryEl.innerHTML = `<p class="small">Your cart is empty. Add items from the <a href="catalog.html">catalog</a>.</p>`; 
      return; 
    } 
    
    const rows = cart.map(line); 
    const total = rows.reduce((s, r) => s + r.sub, 0); 

    summaryEl.innerHTML = `<ul>${rows.map(r => `<li>${r.name} — ${r.qty.toFixed(2)}kg (${r.thickness}) • <strong>R$ ${r.sub.toFixed(2)}</strong></li>`).join("")}</ul><p><strong>Total:</strong> R$ ${total.toFixed(2)}</p>`; 
  }

  function requireAddressIfDelivery() { 
    const mode = $("#mode"); 
    const wrap = $("#address-wrap"); 
    
    if (!mode || !wrap) 
      return; 
    
    const input = wrap.querySelector("input"); 
    const delivery = mode.value === "delivery"; 
    wrap.style.opacity = delivery ? "1" : ".6"; 
    input.required = delivery; 
  }

  function buildOrderText() { 
    const cart = getCart(); 

    const itemsTxt = cart.map(it => { 
      const p = PRODUCTS.find(p => p.id === it.id); 
      const name = p ? p.name : it.id; 
      return `${name} — ${it.qtyKg.toFixed(2)}kg (${it.thickness})`; 
    })
    .join("\\n"); 
    
    const total = cartTotal(); 
    const fd = new FormData(form); 
    const mode = fd.get("mode"); 
    const name = fd.get("name"); 
    const phone = fd.get("phone"); 
    const address = fd.get("address") || ""; 
    const time = fd.get("time") || ""; 
    const date = fd.get("date") || ""; 
    const notes = (fd.get("notes") || ""); 
    const header = `New ${mode} order`; 
    const contact = `Name: ${name}\\nPhone: ${phone}`; 
    const when = `When: ${date} ${time}`; 
    const addr = mode === "delivery" ? `\\nAddress: ${address}` : ""; 
    const items = `Items:\\n${itemsTxt}`; 
    const totals = `Total: R$ ${total.toFixed(2)}`; 
    const n = notes ? `\\nNotes: ${notes}` : ""; 
    return encodeURIComponent(`${header}\\n${contact}\\n${when}${addr}\\n${items}\\n${totals}${n}`); 
  }

  form.addEventListener("change", requireAddressIfDelivery);
  form.addEventListener("submit", (ev) => { 
    ev.preventDefault(); 

    if (!form.reportValidity()) 
    return; 
  
    const wa = "5521999999999"; 
    const url = `https://wa.me/${wa}?text=${buildOrderText()}`; 
    const k = "sgb_order_count"; 
    const c = Number(localStorage.getItem(k) || "0") + 1; 
    localStorage.setItem(k, String(c)); 
  
    if (counterEl) counterEl.textContent = `Sent: ${c}`; 
  
    window.open(url, "_blank", "noopener"); 
  });

  if (typeof loadProducts === "function") {
    loadProducts().then(() => {
      renderSummary();
      requireAddressIfDelivery();
    });
  } else {
    renderSummary();
    requireAddressIfDelivery();
  }

});
