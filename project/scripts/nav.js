// nav.js — Accessible hamburger menu with correct selectors
document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("primary-nav");

  if (!burger || !nav) return;

  function setOpen(open) {
    if (open) {
      nav.classList.add("nav-open");
    } else {
      nav.classList.remove("nav-open");
    }
    burger.setAttribute("aria-expanded", String(open));
  }

  function isOpen() {
    return burger.getAttribute("aria-expanded") === "true";
  }

  burger.addEventListener("click", () => {
    setOpen(!isOpen());
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      setOpen(false);
      burger.focus();
    }
  });

  // Close when clicking outside nav on mobile
  document.addEventListener("click", (e) => {
    if (isOpen() && !nav.contains(e.target) && !burger.contains(e.target)) {
      setOpen(false);
    }
  });

  // Close when clicking a nav link (for single-page feel)
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 769) {
        setOpen(false);
      }
    });
  });
});
