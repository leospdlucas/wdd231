document.addEventListener("DOMContentLoaded", () => {
    const gridButton = document.querySelector("grid");
    const listButton = document.querySelector("list");
    const display = document.querySelector("article");

    gridButton.addEventListener("click", () => {
        display.classList.add("grid");
        display.classList.remove("list");

        gridButton.classList.add("active");
        listButton.classList.remove("active");
    });

    listButton.addEventListener("click", () => {
        display.classList.add("list");
        display.classList.remove("grid");

        gridButton.classList.add("active");
        listButton.classList.remove("active");
    });
});

// API key for OpenWeatherMap
const apiKey = 'b842b17bb87f2a3f2faf4a532f9ed204';
const city = 'Timbuktu'; // replace with the actual chamber location

// Fetch weather data
async function fetchWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
}

function displayWeather(data) {
  const weatherInfo = document.getElementById('weather-info');
  const temp = Math.round(data.main.temp);
  const description = data.weather.map(item => item.description.charAt(0).toUpperCase() + item.description.slice(1)).join(', '); 

  weatherInfo.innerHTML = `
    <p>Temperature: ${temp}°F</p>
    <p>Weather: ${description}</p>
    <h3>3-Day Forecast</h3>
    <!-- Add your forecast display logic here -->
  `;
}

async function fetchMembers() {
    try {
      const response = await fetch('data/members.json');
      const members = await response.json();
      displaySpotlights(members);  
    } catch (error) {
      console.error('Error to load the members:', error);
    }
  }

function displaySpotlights() {
  const container = document.getElementById('spotlights-container');
  const filteredMembers = members.filter(member => member.level === 'gold' || member.level === 'silver');
  const randomSpotlights = getRandomSpotlights(filteredMembers);

  randomSpotlights.forEach(member => {
    const spotlight = document.createElement('div');
    spotlight.classList.add('spotlight');
    spotlight.innerHTML = `
      <img src="${member.logo}" alt="${member.name} logo">
      <div>
        <h4>${member.name}</h4>
        <p>Phone: ${member.phone}</p>
        <p>Address: ${member.address}</p>
        <a href="${member.website}" target="_blank">Website</a>
        <p>Membership Level: ${member.level}</p>
      </div>
    `;
    container.appendChild(spotlight);
  });
}

function getRandomSpotlights(members) {
  const randomSpotlights = [];
  const randomIndexes = [];

  while (randomSpotlights.length < 2) {
    const randomIndex = Math.floor(Math.random() * members.length);
    if (!randomIndexes.includes(randomIndex)) {
      randomSpotlights.push(members[randomIndex]);
      randomIndexes.push(randomIndex);
    }
  }

  return randomSpotlights;
}

// Footer update dynamic
document.getElementById("copyright-year").textContent = new Date().getFullYear();
document.getElementById("last-modified").textContent = `Last Modified: ${document.lastModified}`;

// Menu toggle (mobile)
document.getElementById("menu-toggle").addEventListener("click", () => {
document.getElementById("nav-menu").classList.toggle("open");
});

// Theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Last modified date
document.getElementById("last-modified").textContent = document.lastModified;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  fetchWeather();
  displaySpotlights();
});
