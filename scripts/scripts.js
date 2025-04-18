
// IMPORT DATA (if modularized)
// Example (if data is in another module):
// import { promos } from './data.js'; // Not used here, but if needed

// LOCAL STORAGE: Track Last Visit
const lastVisit = localStorage.getItem('lastVisit');
const visitMessage = document.getElementById('visit-message');

if (visitMessage) {
  if (lastVisit) {
    const daysAgo = Math.floor((Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
    visitMessage.textContent = `Welcome back! It's been ${daysAgo} day(s) since your last visit.`;
  } else {
    visitMessage.textContent = `Welcome to Açougue São Gabriel!`;
  }
  localStorage.setItem('lastVisit', Date.now().toString());
}

// FETCH PROMO DATA
const promoSection = document.getElementById('promo-cards');

async function loadPromos() {
  try {
    const response = await fetch('data/promos.json'); // fetch JSON
    if (!response.ok) throw new Error('Failed to load promo data');

    const data = await response.json();

    // items dynamically
    data.promos.slice(0, 15).forEach(promo => {
      const card = document.createElement('div');
      card.classList.add('promo-card');

      // template
      card.innerHTML = `
        <img src="${promo.image}" alt="${promo.name}" loading="lazy">
        <div class="content">
          <h3>${promo.name}</h3>
          <p>${promo.description}</p>
          <p><strong>Price:</strong> ${promo.price}</p>
          <button class="details-btn" data-id="${promo.id}">Details</button>
        </div>
      `;

      promoSection.appendChild(card);
    });

    // listener (DOM interaction) to buttons
    document.querySelectorAll('.details-btn').forEach(btn =>
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const selectedPromo = data.promos.find(p => p.id == id);
        openModal(selectedPromo);
      })
    );
  } catch (error) {
    console.error('Error loading promotions:', error);
    promoSection.innerHTML = `<p>Sorry, we couldn't load the promos at this time.</p>`;
  }
}

loadPromos();

// MODAL LOGIC
const modal = document.getElementById('promo-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

// Modal display
function openModal(promo) {
  modalContent.innerHTML = `
    <h2>${promo.name}</h2>
    <img src="${promo.image}" alt="${promo.name}">
    <p>${promo.description}</p>
    <p><strong>Weight:</strong> ${promo.weight}</p>
    <p><strong>Price:</strong> ${promo.price}</p>
  `;
  modal.classList.add('show');
}

// Close modal
modalClose.addEventListener('click', () => {
  modal.classList.remove('show');
});

// Close clicking outside
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('show');
});

// RESPONSIVE NAVIGATION
const toggleBtn = document.getElementById('menu-toggle');
const navList = document.querySelector('nav ul');

toggleBtn.addEventListener('click', () => {
  navList.classList.toggle('show');
});
