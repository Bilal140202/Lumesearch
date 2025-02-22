document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const siteDropdownBtn = document.getElementById("site-dropdown-btn");
  const siteDropdownMenu = document.getElementById("site-dropdown-menu");
  const filetypeSelect = document.getElementById("filetype-select");
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const customSiteInput = document.getElementById("custom-site-input");

  let selectedSites = [];

  // Toggle dropdown visibility
  siteDropdownBtn.addEventListener("click", () => {
    siteDropdownMenu.classList.toggle("show");
  });

  // Handle site selection from dropdown
  siteDropdownMenu.addEventListener("change", (event) => {
    const site = event.target.value;
    if (event.target.checked) {
      selectedSites.push(site);
    } else {
      selectedSites = selectedSites.filter((s) => s !== site);
    }
  });

  // Handle custom site input
  customSiteInput.addEventListener("blur", () => {
    const site = customSiteInput.value.trim();
    if (site && !selectedSites.includes(site)) {
      selectedSites.push(site);
      customSiteInput.value = "";
    }
  });

  // Perform search
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    const filetypes = Array.from(filetypeSelect.selectedOptions).map(opt => opt.value);

    if (!query) {
      alert("Please enter a search term.");
      return;
    }

    let searchQuery = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    if (selectedSites.length > 0) {
      const siteQueries = selectedSites.map(site => `site:${site}`).join("+OR+");
      searchQuery += `+(${siteQueries})`;
    }

    if (filetypes.length > 0) {
      const filetypeQueries = filetypes.map(ft => `filetype:${ft}`).join("+OR+");
      searchQuery += `+(${filetypeQueries})`;
    }

    window.open(searchQuery, "_blank");
  });

  // Theme Toggle
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!siteDropdownBtn.contains(event.target) && !siteDropdownMenu.contains(event.target)) {
      siteDropdownMenu.classList.remove("show");
    }
  });
});
