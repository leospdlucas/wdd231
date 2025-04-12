document.addEventListener("DOMContentLoaded", () => {
  const gridButton = document.getElementById("grid");
  const listButton = document.getElementById("list");
  const display = document.querySelector("article");

  // View toggle
  gridButton.addEventListener("click", () => {
    display.classList.add("grid");
    display.classList.remove("list");

    gridButton.classList.add("active");
    listButton.classList.remove("active");
  });

  listButton.addEventListener("click", () => {
    display.classList.add("list");
    display.classList.remove("grid");

    listButton.classList.add("active");
    gridButton.classList.remove("active");
  });

  // Weather
  fetchWeather();

  // Spotlights
  fetchMembers();

  // 3-Days Forecast
  fetchForecast();

  // Timestamp
  const timestampField = document.getElementById("timestamp");
  if (timestampField) {
    timestampField.value = new Date().toISOString();
  }

  // Footer
  document.getElementById("copyright-year").textContent = new Date().getFullYear();
  document.getElementById("last-modified").textContent = `Last Modified: ${document.lastModified}`;

  // Mobile menu
  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("nav-menu").classList.toggle("open");
  });

  // Dark theme
  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  // Modal open
  document.querySelectorAll('.card a, .modal-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const modalId = link.getAttribute('href')?.substring(1);
      if (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.style.display = 'block';
      }
    });
  });

  // Modal close
  document.querySelectorAll('.close').forEach(span => {
    span.addEventListener('click', () => {
      const modalId = span.getAttribute('data-close');
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'none';
    });
  });

  // Click outside modal to close
  window.addEventListener("click", function (event) {
    document.querySelectorAll(".modal").forEach(modal => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
});

  // Confirmation page info
function populateThankYouPage() {
  const params = new URLSearchParams(window.location.search);
  document.getElementById('fname').textContent = params.get('fname') || '(Not provided)';
  document.getElementById('lname').textContent = params.get('lname') || '(Not provided)';
  document.getElementById('email').textContent = params.get('email') || '(Not provided)';
  document.getElementById('phone').textContent = params.get('phone') || '(Not provided)';
  document.getElementById('orgname').textContent = params.get('orgname') || '(Not provided)';
  document.getElementById('timestamp-display').textContent = params.get('timestamp') || '(Not provided)';
}

if (window.location.pathname.includes('thankyou.html')) {
  populateThankYouPage();
}

// Weather and Spotlights
const apiKey = 'b842b17bb87f2a3f2faf4a532f9ed204';
const city = 'Timbuktu';

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
  const description = data.weather.map(item =>
    item.description.charAt(0).toUpperCase() + item.description.slice(1)
  ).join(', ');

  weatherInfo.innerHTML = `
    <p>Temperature: ${temp}°F</p>
    <p>Weather: ${description}</p>
    <h3>3-Day Forecast</h3>
    <!-- Add your forecast logic here -->
  `;
}

async function fetchMembers() {
  try {
    const response = await fetch('data/members.json');
    const members = await response.json();
    displaySpotlights(members);
  } catch (error) {
    console.error('Error loading the members:', error);
  }
}

function displaySpotlights(members) {
  const container = document.getElementById('spotlights-container');
  container.innerHTML = ''; // clear any previous data
  const filteredMembers = members.filter(member =>
    member.level === 'gold' || member.level === 'silver'
  );
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
  const shuffled = [...members].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}

async function fetchForecast() {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error('Error fetching forecast:', error);
  }
}

// 3-Days Forecast
function displayForecast(data) {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';

  // Filter forecasts for noon for the next 3 days
  const noonForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 3);

  noonForecasts.forEach(forecast => {
    const date = new Date(forecast.dt_txt);
    const day = date.toLocaleDateString(undefined, { weekday: 'short' });
    const temp = Math.round(forecast.main.temp);
    const icon = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    const description = forecast.weather[0].description;

    const card = document.createElement('div');
    card.classList.add('forecast-day');
    card.innerHTML = `
      <h4>${day}</h4>
      <img src="${icon}" alt="${description}">
      <p>${temp}°F</p>
      <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
    `;
    forecastContainer.appendChild(card);
  });
}
