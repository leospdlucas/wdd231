// weather.js — Weather widget using Open-Meteo API (no key required)
(async () => {
  const weatherBox = document.getElementById("weatherBox");
  if (!weatherBox) return;

  // Weather code to text mapping
  function codeToDescription(code) {
    const descriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Drizzle",
      55: "Dense drizzle",
      61: "Light rain",
      63: "Rain",
      65: "Heavy rain",
      71: "Light snow",
      73: "Snow",
      75: "Heavy snow",
      80: "Rain showers",
      81: "Moderate showers",
      82: "Violent showers",
      95: "Thunderstorm",
    };
    return descriptions[code] || "—";
  }

  // Render weather data
  function renderWeather(data, locationName) {
    const { temperature_2m, weather_code } = data.current;
    const description = codeToDescription(weather_code);

    weatherBox.innerHTML = `
      <strong>${locationName}</strong><br>
      ${temperature_2m}°C • ${description}
    `;
  }

  // Fetch weather for coordinates
  async function fetchWeather(latitude, longitude, locationLabel) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      renderWeather(data, locationLabel);
    } catch (error) {
      console.error("Weather fetch error:", error);
      weatherBox.innerHTML = `<span class="small">Weather unavailable</span>`;
    }
  }

  // Try geolocation first, fallback to Nova Iguaçu
  try {
    await new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("No geolocation"));
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude, "Your location");
          resolve();
        },
        () => reject(new Error("Location denied")),
        { timeout: 4000 }
      );
    });
  } catch (error) {
    // Fallback to Nova Iguaçu coordinates
    fetchWeather(-22.76, -43.45, "Nova Iguaçu");
  }
})();
