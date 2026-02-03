// review.js — Display submitted review data from URL parameters
(() => {
  // Product list matching products.json IDs
  const products = [
    { id: "picanha", name: "Picanha" },
    { id: "fraldinha", name: "Beef Skirt Steak" },
    { id: "alcatra", name: "Top Sirloin" },
    { id: "maminha", name: "Beef Rump" },
    { id: "tbone", name: "T-Bone Steak" },
    { id: "costelabovina", name: "Short Ribs" },
    { id: "coxadefrango", name: "Chicken Drumsticks" },
    { id: "asadodefrango", name: "Whole Chicken" },
    { id: "peitodefrango", name: "Chicken Breast" },
    { id: "asinhadefrango", name: "Chicken Wings" },
    { id: "pernildeporco", name: "Pork Tenderloin" },
    { id: "costelasuina", name: "Pork Ribs" },
    { id: "bistecasuina", name: "Pork Chops" },
    { id: "linguicaartesanal", name: "Artisan Sausage" },
    { id: "lombo-defumado", name: "Smoked Bacon Slab" },
    { id: "linguicadealho", name: "Garlic Sausage" },
    { id: "carrereordeiro", name: "Lamb Chops" },
  ];

  const params = new URLSearchParams(location.search);
  const byId = Object.fromEntries(products.map((p) => [p.id, p.name]));

  // Pull values sent via GET
  const productId = params.get("product");
  const productName = byId[productId] || "(Unknown product)";
  const rating = params.get("rating");
  const installDate = params.get("installDate");
  const features = params.getAll("features");
  const comments = params.get("comments") || "";
  const username = params.get("username") || "";

  // Render summary
  const summaryEl = document.getElementById("summary");

  if (!summaryEl) return;

  function addRow(label, value) {
    const labelEl = document.createElement("b");
    labelEl.textContent = label;

    const valueEl = document.createElement("p");

    if (Array.isArray(value)) {
      if (value.length === 0) {
        valueEl.textContent = "—";
      } else {
        value.forEach((v) => {
          const span = document.createElement("span");
          span.className = "pill";
          span.textContent = v;
          valueEl.appendChild(span);
        });
      }
    } else {
      valueEl.textContent = value || "—";
    }

    summaryEl.appendChild(labelEl);
    summaryEl.appendChild(valueEl);
  }

  // Generate star display
  function renderStars(num) {
    const filled = parseInt(num, 10) || 0;
    const stars = "★".repeat(filled) + "☆".repeat(5 - filled);
    return `${stars} (${filled}/5)`;
  }

  addRow("Product", productName);
  addRow("Overall Rating", rating ? renderStars(rating) : "—");
  addRow("Date of Purchase", installDate);
  addRow("Useful Features", features);
  addRow("Written Review", comments);
  addRow("Reviewer Name", username || "Anonymous");

  // localStorage review counter
  const KEY = "reviewCount";
  let count = Number(localStorage.getItem(KEY) || 0);
  count += 1;
  localStorage.setItem(KEY, String(count));

  const countEl = document.getElementById("reviewCount");
  if (countEl) {
    countEl.textContent = count;
  }

  // Footer "last modified"
  const lastmodEl = document.getElementById("lastmod");
  if (lastmodEl) {
    lastmodEl.textContent = new Date(document.lastModified).toLocaleString();
  }
})();
