// form.js — Product review form with dynamic product dropdown and validation
(() => {
  const form = document.getElementById("reviewForm");
  const productSelect = document.getElementById("product");
  const lastmodEl = document.getElementById("lastmod");

  // Set last modified date
  if (lastmodEl) {
    lastmodEl.textContent = new Date(document.lastModified).toLocaleString();
  }

  if (!form) return;

  // Product list (matching review.js for consistency)
  const products = [
    { id: "picanha", name: "Picanha" },
    { id: "fraldinha", name: "Beef Skirt Steak" },
    { id: "alcatra", name: "Top Sirloin" },
    { id: "maminha", name: "Beef Rump" },
    { id: "tbone", name: "T-Bone Steak" },
    { id: "costelabovina", name: "Short Ribs" },
    { id: "coxadefrango", name: "Chicken Drumsticks" },
    { id: "asadodefrango", name: "Whole Chicken" },
    { id: "peitodefrango", name: "Chicken Breast" },
    { id: "asinhadefrango", name: "Chicken Wings" },
    { id: "pernildeporco", name: "Pork Tenderloin" },
    { id: "costelasuina", name: "Pork Ribs" },
    { id: "bistecasuina", name: "Pork Chops" },
    { id: "linguicaartesanal", name: "Artisan Sausage" },
    { id: "lombo-defumado", name: "Smoked Bacon Slab" },
    { id: "linguicadealho", name: "Garlic Sausage" },
    { id: "carrereordeiro", name: "Lamb Chops" },
  ];

  // Populate product dropdown
  if (productSelect) {
    products.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.name;
      productSelect.appendChild(option);
    });
  }

  // Try to prefill from localStorage (for returning users)
  try {
    const saved = JSON.parse(localStorage.getItem("sg_review_user") || "{}");
    if (saved.username) {
      const usernameInput = form.elements.namedItem("username");
      if (usernameInput && !usernameInput.value) {
        usernameInput.value = saved.username;
      }
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  // Custom validation messages
  const validationMessages = {
    product: "Please select a product to review.",
    rating: "Please select a rating from 1 to 5 stars.",
    installDate: "Please select the date of installation/purchase.",
  };

  // Show custom validation message
  function showError(input, message) {
    input.setCustomValidity(message);
    input.reportValidity();
  }

  // Clear custom validation message
  function clearError(input) {
    input.setCustomValidity("");
  }

  // Validate form
  function validateForm() {
    let isValid = true;

    // Validate product selection
    if (productSelect && !productSelect.value) {
      showError(productSelect, validationMessages.product);
      isValid = false;
    } else if (productSelect) {
      clearError(productSelect);
    }

    // Validate rating
    const ratingInputs = form.querySelectorAll('input[name="rating"]');
    const ratingSelected = Array.from(ratingInputs).some(
      (input) => input.checked
    );
    if (!ratingSelected) {
      // Show error on first rating input
      if (ratingInputs.length > 0) {
        showError(ratingInputs[0], validationMessages.rating);
        isValid = false;
      }
    } else {
      ratingInputs.forEach((input) => clearError(input));
    }

    // Validate install date
    const installDateInput = form.elements.namedItem("installDate");
    if (installDateInput && !installDateInput.value) {
      showError(installDateInput, validationMessages.installDate);
      isValid = false;
    } else if (installDateInput) {
      clearError(installDateInput);
    }

    return isValid;
  }

  // Handle form submission
  form.addEventListener("submit", (e) => {
    // Clear previous custom validity
    form.querySelectorAll("input, select").forEach((el) => clearError(el));

    if (!validateForm()) {
      e.preventDefault();
      return;
    }

    // Save username for future visits
    const usernameInput = form.elements.namedItem("username");
    if (usernameInput && usernameInput.value) {
      try {
        localStorage.setItem(
          "sg_review_user",
          JSON.stringify({ username: usernameInput.value })
        );
      } catch (err) {
        // Ignore localStorage errors
      }
    }

    // Form will submit normally via GET to review.html
  });

  // Clear validation errors on input change
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", () => clearError(el));
    el.addEventListener("change", () => clearError(el));
  });
})();
