import { performSearch } from './search.js';

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle-btn');
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

// Site Selection Dropdown
const siteDropdownBtn = document.getElementById('site-dropdown-btn');
const siteDropdownMenu = document.getElementById('site-dropdown-menu');
const selectedSites = new Set();

siteDropdownMenu.addEventListener('click', (event) => {
  if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
    if (event.target.checked) {
      selectedSites.add(event.target.value);
    } else {
      selectedSites.delete(event.target.value);
    }
  }
});

// Search Button
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const filetypeSelect = document.getElementById('filetype-select');

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  const filetypes = Array.from(filetypeSelect.selectedOptions).map(option => option.value);
  performSearch(query, Array.from(selectedSites), filetypes);
});
