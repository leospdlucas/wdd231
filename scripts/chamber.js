// Shared JS for the Chamber site
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("copyright-year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  const lastMod = document.getElementById("lastModified");
  if (lastMod) lastMod.textContent = document.lastModified;

  const toggle = document.getElementById("nav-toggle");
  const nav = document.querySelector("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
  }

  const directory = document.getElementById("directory");
  if (directory) {
    buildDirectory(directory);
    const gridBtn = document.getElementById("gridView");
    const listBtn = document.getElementById("listView");
    if (gridBtn && listBtn) {
      const setMode = (mode) => {
        directory.classList.toggle("grid", mode === "grid");
        directory.classList.toggle("list", mode === "list");
        gridBtn.classList.toggle("active", mode === "grid");
        listBtn.classList.toggle("active", mode === "list");
      };
      gridBtn.addEventListener("click", () => setMode("grid"));
      listBtn.addEventListener("click", () => setMode("list"));
      setMode("grid");
    }
  }
});

async function buildDirectory(container){
  try{
    const res = await fetch("data/members.json");
    const data = await res.json();
    const members = Array.isArray(data) ? data : (data.members || []);
    container.innerHTML = "";
    for (const m of members){
      const card = document.createElement("section");
      card.className = "member";
      const levelText = m.membershipLevel === 3 ? "Gold" : (m.membershipLevel === 2 ? "Silver" : "Member");
      card.innerHTML = `
        <img class="company-img" src="images/${m.image}" alt="${m.name} logo" loading="lazy">
        <div class="text">
          <h3>${m.name}</h3>
          <p>${m.address}</p>
          <p>${m.phone}</p>
          <p class="level">Level: ${levelText}</p>
        </div>
        <a class="visit" href="${m.website}" target="_blank" rel="noopener">Visit Website</a>
      `;
      container.appendChild(card);
    }
  } catch(err){
    console.error(err);
    container.innerHTML = `<p class="error">Sorry, we couldn't load the directory right now.</p>`;
  }
}
