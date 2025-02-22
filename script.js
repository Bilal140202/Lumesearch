document.addEventListener("DOMContentLoaded", () => {
  const siteDropdownBtn = document.getElementById("site-dropdown-btn");
  const siteDropdownMenu = document.getElementById("site-dropdown-menu");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const customSiteInput = document.getElementById("custom-site-input");

  // Example list of predefined sites
  const sites = [
    "github.com",
    "stackoverflow.com",
    "wikipedia.org",
    "medium.com",
    "reddit.com"
  ];

  // Function to populate the dropdown
  const populateDropdown = () => {
    siteDropdownMenu.innerHTML = ""; // Clear existing items
    sites.forEach((site) => {
      const siteOption = document.createElement("div");
      siteOption.textContent = site;
      siteOption.classList.add("dropdown-item");
      siteOption.addEventListener("click", () => selectSite(site));
      siteDropdownMenu.appendChild(siteOption);
    });
  };

  // Function to handle site selection
  const selectSite = (site) => {
    if (!searchInput.value.includes(`site:${site}`)) {
      searchInput.value += ` site:${site}`;
    }
    siteDropdownMenu.classList.remove("show"); // Hide dropdown after selection
  };

  // Toggle dropdown visibility
  siteDropdownBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent immediate closing
    siteDropdownMenu.classList.toggle("show");
    populateDropdown();
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (!siteDropdownBtn.contains(event.target) && !siteDropdownMenu.contains(event.target)) {
      siteDropdownMenu.classList.remove("show");
    }
  });

  // Handle custom site input
  customSiteInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && customSiteInput.value.trim() !== "") {
      selectSite(customSiteInput.value.trim());
      customSiteInput.value = ""; // Clear input after adding
    }
  });

  // Perform search when clicking the search button
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query !== "") {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    }
  });
});
