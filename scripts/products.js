const productContainer = document.querySelector("#products-section");

// Modal and internal elements
const modal = document.querySelector(".modal");
const modalImg = modal.querySelector("img");
const modalTitle = modal.querySelector("h2");
const modalDesc = modal.querySelector(".description");
const modalWeight = modal.querySelector(".weight");
const modalPrice = modal.querySelector(".price");
const closeModalBtn = modal.querySelector("#modal-close");

// load from Json
async function loadProducts() {
  try {
    const response = await fetch("data/products.json");
    if (!response.ok) throw new Error("Failed to fetch products.");
    const data = await response.json();
    displayProducts(data.products);
  } catch (error) {
    console.error("Error loading products:", error);
    productContainer.innerHTML = "<p>Error loading products.</p>";
  }
}

// Show the products
function displayProducts(products) {
  products.forEach(product => {
    // Creating the cards
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">$${product.price}</p>
      </div>
    `;

    // Open modal on click
    card.addEventListener("click", () => {
      openModal(product);
    });

    productContainer.appendChild(card);
  });
}

// Open modal and fill in with product data
function openModal(product) {
  modalImg.src = product.image;
  modalImg.alt = product.name;
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.description;
  modalWeight.textContent = product.weight;
  modalPrice.textContent = product.price;
  modal.classList.add("show");

  localStorage.setItem("lastProductViewed", product.name);
}

// Close modal
closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

// Close modal on click out
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("show");
  }
});

loadProducts();
