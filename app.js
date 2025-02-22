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

  // Apply Theme
  applyTheme();

  // Initialize UI Components
  initThemeToggle();
  initDropdown();
  initFiletypeOptions();
  initSearchFunctionality();

  function applyTheme() {
    const currentTheme = getTheme();
    document.body.classList.add(currentTheme);
  }

  function initThemeToggle() {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      document.body.classList.replace(currentTheme, newTheme);
      setTheme(newTheme);
    });
  }

  function initDropdown() {
    populateSiteDropdown(siteDropdownMenu);

    siteDropdownBtn.addEventListener('click', () => {
      siteDropdownMenu.classList.toggle('visible');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!siteDropdownBtn.contains(event.target) && !siteDropdownMenu.contains(event.target)) {
        siteDropdownMenu.classList.remove('visible');
      }
    });

    // Keyboard accessibility
    siteDropdownBtn.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        siteDropdownMenu.classList.remove('visible');
      }
    });
  }

  function initFiletypeOptions() {
    const fragment = document.createDocumentFragment();
    const noneOption = document.createElement('option');
    noneOption.value = '';
    noneOption.textContent = 'None';
    fragment.appendChild(noneOption);

    getFiletypeOptions().forEach(({ value, label }) => {
      const optionEl = document.createElement('option');
      optionEl.value = value;
      optionEl.textContent = label;
      fragment.appendChild(optionEl);
    });

    filetypeSelect.appendChild(fragment);
  }

  function initSearchFunctionality() {
    // Restore last search query if available
    const lastQuery = localStorage.getItem('lastSearch');
    if (lastQuery) searchInput.value = lastQuery;

    searchBtn.addEventListener('click', () => executeSearch());

    searchInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') executeSearch();
    });

    searchInput.addEventListener('input', updateLivePreview);
  }

  function executeSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    localStorage.setItem('lastSearch', query);

    const sites = getSelectedSites(siteDropdownMenu);
    const filetypes = [...filetypeSelect.selectedOptions].map(opt => opt.value).filter(val => val !== '');

    performSearch(query, sites, filetypes);
  }

  function updateLivePreview() {
    const query = searchInput.value.trim();
    liveSearchPreview.innerHTML = '';

    if (query) {
      const sites = getSelectedSites(siteDropdownMenu);
      const filetypes = [...filetypeSelect.selectedOptions].map(opt => opt.value).filter(val => val !== '');
      const previewLink = createPreviewLink(query, sites, filetypes);

      liveSearchPreview.appendChild(previewLink);
    }
  }

  function createPreviewLink(query, sites, filetypes) {
    const previewItem = document.createElement('a');
    previewItem.href = generateSearchQuery(query, sites, filetypes);
    previewItem.target = '_blank';
    previewItem.rel = 'noopener noreferrer';
    previewItem.textContent = `Search for "${query}" on selected sites and filetypes`;
    return previewItem;
  }

  function generateSearchQuery(query, sites, filetypes) {
    let searchQuery = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    if (sites.length) searchQuery += `+(${sites.map(site => `site:${site}`).join('+OR+')})`;
    if (filetypes.length) searchQuery += `+(${filetypes.map(ft => `filetype:${ft}`).join('+OR+')})`;

    return searchQuery;
  }
});
