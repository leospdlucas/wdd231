// Same product list so we can show the chosen product name on the receipt.
const products = [
  { id: "pic-kg", name: "Picanha", averagerating: 4.9 },
  { id: "fral-kg", name: "Fraldinha", averagerating: 4.6 },
  { id: "ass-kg", name: "Assado de Tira", averagerating: 4.7 },
  { id: "ling-kg", name: "Linguiça Artesanal", averagerating: 4.5 },
  { id: "cost-kg", name: "Costelinha Suína", averagerating: 4.8 },
  { id: "fil-kg", name: "Filé de Peito", averagerating: 4.6 }
];

const params = new URLSearchParams(location.search);
const byId = Object.fromEntries(products.map(p => [p.id, p.name]));

// Pull values sent via GET
const productId = params.get("product");
const productName = byId[productId] || "(Unknown product)";
const rating = params.get("rating");
const installDate = params.get("installDate");
const features = params.getAll("features");
const comments = params.get("comments") || "";
const username = params.get("username") || "";

// Render summary
const s = document.querySelector("#summary");
const add = (label, value) => {
    const b = document.createElement("b");
    b.textContent = label;
    const p = document.createElement("p");
    if (Array.isArray(value)) {
        if (value.length === 0) { p.textContent = "—"; }
        else {
            value.forEach(v => {
                const span = document.createElement("span");
                span.className = "pill";
                span.textContent = v;
                p.appendChild(span);
            });
        }
    } else {
        p.textContent = value || "—";
    }
    s.appendChild(b); s.appendChild(p);
};

add("Product", `${productName} (${productId})`);
add("Overall Rating", rating ? `${rating} / 5` : "");
add("Date of Installation", installDate);
add("Useful Features", features);
add("Written Review", comments);
add("Your Name", username);

// localStorage review counter
const KEY = "reviewCount";
let count = Number(localStorage.getItem(KEY) || 0);
count += 1;
localStorage.setItem(KEY, String(count));
document.querySelector("#reviewCount").textContent = count;

// Footer "last modified"
document.querySelector("#lastmod").textContent = new Date(document.lastModified).toLocaleString();
