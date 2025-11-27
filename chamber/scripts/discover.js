// scripts/discover.js
import { itemsOfInterest } from "../data/discover.mjs";

function buildCards() {
  const container = document.getElementById('cardsContainer');
  container.innerHTML = "";

  itemsOfInterest.forEach((item) => {
    const card = document.createElement('section');
    card.classList.add('card');

    card.innerHTML = `
      <h2>${item.name}</h2>
      <figure>
        <img src="${item.image}" alt="${item.name}">
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button>Learn More</button>
    `;

    container.appendChild(card);
  });
}

function showVisitMessage() {
  const messageDiv = document.getElementById('visit-message');
  const lastVisit = localStorage.getItem('lastVisit');
  const now = Date.now();

  if (!lastVisit) {
    messageDiv.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const days = Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24));
    if (days < 1) {
      messageDiv.textContent = "Back so soon! Awesome!";
    } else {
      messageDiv.textContent = `You last visited ${days} day${days > 1 ? 's' : ''} ago.`;
    }
  }

  localStorage.setItem('lastVisit', now);
}

document.addEventListener("DOMContentLoaded", () => {
  buildCards();
  showVisitMessage();
});
