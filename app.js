import { getTheme, setTheme } from './theme.js';
import { populateSiteDropdown, getSelectedSites } from './siteDropdown.js';
import { getFiletypeOptions } from './filetypeFilter.js';
import { performSearch } from './search.js';

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const searchInput = document.getElementById('search-input');
  const siteDropdownBtn = document.getElementById('site-dropdown-btn');
  const siteDropdownMenu = document.getElementById('site-dropdown-menu');
  const filetypeSelect = document.getElementById('filetype-select');
  const searchBtn = document.getElementById('search-btn');
  const liveSearchPreview = document.getElementById('live-search-preview');

  // Theme Toggle
  const currentTheme = getTheme();
  document.body.classList.add(currentTheme);
  themeToggleBtn.addEventListener('click', () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.replace(currentTheme, newTheme);
  });

  // Site Dropdown
  populateSiteDropdown(siteDropdownMenu);
  siteDropdownBtn.addEventListener('click', () => {
    siteDropdownMenu.style.display = siteDropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  // Filetype Filter
  getFiletypeOptions().forEach(option => {
    const optionEl = document.createElement('option');
    optionEl.value = option.value;
    optionEl.textContent = option.label;
    filetypeSelect.appendChild(optionEl);
  });

  // Add option to select none for filetypes
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.textContent = 'None';
  filetypeSelect.insertBefore(noneOption, filetypeSelect.firstChild);

  // Search Button
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    const sites = getSelectedSites(siteDropdownMenu);
    const filetypes = Array.from(filetypeSelect.selectedOptions).map(opt => opt.value).filter(value => value !== '');
    performSearch(query, sites, filetypes);
  });

  // Live Search Preview
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    liveSearchPreview.innerHTML = '';
    if (query) {
      const sites = getSelectedSites(siteDropdownMenu);
      const filetypes = Array.from(filetypeSelect.selectedOptions).map(opt => opt.value).filter(value => value !== '');
      const searchQuery = generateSearchQuery(query, sites, filetypes);
      const previewItem = document.createElement('a');
      previewItem.href = searchQuery;
      previewItem.target = '_blank';
      previewItem.rel = 'noopener noreferrer';
      previewItem.textContent = `Search for "${query}" on selected sites and filetypes`;
      liveSearchPreview.appendChild(previewItem);
    }
  });

  const generateSearchQuery = (query, sites, filetypes) => {
    let searchQuery = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    if (sites.length > 0) {
      const siteQueries = sites.map(site => `site:${site}`).join('+OR+');
      searchQuery += `+(${siteQueries})`;
    }

    if (filetypes.length > 0) {
      const filetypeQueries = filetypes.map(filetype => `filetype:${filetype}`).join('+OR+');
      searchQuery += `+(${filetypeQueries})`;
    }

    return searchQuery;
  };
});