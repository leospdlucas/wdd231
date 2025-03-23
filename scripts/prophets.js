// Steps 1 - 3
const url = 'https://brotherblazzard.github.io/canvas-content/latter-day-prophets.json';
const cards = document.querySelector('#cards');

// Steps 4 - 10
const getProphetData = async () => {
  const response = await fetch(url);
  const data = await response.json();
  // console.table(data.prophets); // Uncomment for testing
  displayProphets(data.prophets);
};

// Steps 11 and 12
const displayProphets = (prophets) => {
  cards.innerHTML = ''; // Clear previous cards

  prophets.forEach((prophet, index) => {
    // Create elements
    let card = document.createElement('section');
    let fullName = document.createElement('h2');
    let portrait = document.createElement('img');

    // Build content
    fullName.textContent = `${prophet.name} ${prophet.lastname}`;
    portrait.setAttribute('src', prophet.imageurl);
    portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname} – ${index + 1}th Latter-day President`);
    portrait.setAttribute('loading', 'lazy');
    portrait.setAttribute('width', '340');
    portrait.setAttribute('height', '440');

    // Append elements
    card.appendChild(fullName);
    card.appendChild(portrait);
    cards.appendChild(card);
  });
};

// Function to filter and display prophets based on a condition
const filterProphets = async (condition) => {
    const response = await fetch(url);
    const data = await response.json();
    const filteredProphets = data.prophets.filter(condition);
    displayProphets(filteredProphets);
  };
  
  // Event Listeners for Filter Buttons
  document.querySelector('#filter-utah').addEventListener('click', () => {
    filterProphets(prophet => prophet.birthplace.includes('Utah'));
  });
  
  document.querySelector('#filter-non-us').addEventListener('click', () => {
    filterProphets(prophet => !prophet.birthplace.includes('United States'));
  });
  
  document.querySelector('#filter-old-age').addEventListener('click', () => {
    filterProphets(prophet => (prophet.death - prophet.birth) >= 95);
  });
  
  document.querySelector('#filter-large-family').addEventListener('click', () => {
    filterProphets(prophet => prophet.numofchildren >= 10);
  });
  
  document.querySelector('#filter-long-presidency').addEventListener('click', () => {
    filterProphets(prophet => prophet.length > 15);
  });  

getProphetData();
