// Weather widget using Open‑Meteo (no API key). Uses fixed Rio coordinates.
document.addEventListener('DOMContentLoaded', async () => {
  const out = document.querySelector('.panel.weather');
  if (!out) return;
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-22.90&longitude=-43.20&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m';
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current || {};
    const html = `
      <div class="weather-now">
        <p><strong>Temp:</strong> ${c.temperature_2m ?? '—'}°C (feels like ${c.apparent_temperature ?? '—'}°C)</p>
        <p><strong>Humidity:</strong> ${c.relative_humidity_2m ?? '—'}%</p>
        <p><strong>Wind:</strong> ${c.wind_speed_10m ?? '—'} km/h</p>
      </div>`;
    out.insertAdjacentHTML('beforeend', html);
  } catch (err) {
    out.insertAdjacentHTML('beforeend', `<p class="muted">Weather unavailable.</p>`);
  }
});
