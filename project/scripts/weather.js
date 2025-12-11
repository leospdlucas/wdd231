
// weather.js — uses Open-Meteo (no key) and user's geolocation with fallback
(async () => {
  const box = document.getElementById('weatherBox');
  if (!box) return;

  function render(data, where) {
    const { temperature_2m, weather_code } = data.current;
    const label = codeToText(weather_code);
    box.innerHTML = `<strong>${where}</strong><br>
      ${temperature_2m}°C • ${label}`;
  }

  function codeToText(code){
    const map = {
      0:'Clear', 1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
      45:'Fog',48:'Depositing rime fog',
      51:'Light drizzle',53:'Drizzle',55:'Dense drizzle',
      61:'Light rain',63:'Rain',65:'Heavy rain',
      71:'Light snow',73:'Snow',75:'Heavy snow',
      80:'Rain showers',81:'Rain showers',82:'Violent rain showers',
    };
    return map[code] || '—';
  }

  async function fetchWeather(lat, lon, label){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    render(data, label);
  }

  // Geolocation first
  try {
    await new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject('No geolocation');
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude, 'Your area');
          resolve();
        },
        () => reject('Denied'), { timeout: 4000 }
      );
    });
  } catch (e) {
    // Fallback to Nova Iguaçu
    fetchWeather(-22.76, -43.45, 'Nova Iguaçu');
  }
})();
