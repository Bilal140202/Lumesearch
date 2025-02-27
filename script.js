import { saveToLocalStorage, loadFromLocalStorage, toggleMode } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const siteSelect = document.getElementById('site-select');
  const customSite = document.getElementById('custom-site');
  const filetypeSelect = document.getElementById('filetype-select');
  const searchButton = document.getElementById('search-button');
  const searchHistoryList = document.getElementById('search-history-list');
  const bookmarkFoldersList = document.getElementById('bookmark-folders-list');
  const toggleModeButton = document.getElementById('toggle-mode');
  const animeSearchInput = document.getElementById('anime-search-input');
  const animeSiteSelect = document.getElementById('anime-site-select');
  const animeFiletypeSelect = document.getElementById('anime-filetype-select');
  const animeSearchButton = document.getElementById('anime-search-button');
  const kdramaSearchInput = document.getElementById('kdrama-search-input');
  const kdramaSiteSelect = document.getElementById('kdrama-site-select');
  const kdramaFiletypeSelect = document.getElementById('kdrama-filetype-select');
  const kdramaSearchButton = document.getElementById('kdrama-search-button');
  const bookSearchInput = document.getElementById('book-search-input');
  const bookSiteSelect = document.getElementById('book-site-select');
  const bookFiletypeSelect = document.getElementById('book-filetype-select');
  const bookSearchButton = document.getElementById('book-search-button');

  // Load search history and bookmark folders from local storage
  const searchHistory = loadFromLocalStorage('searchHistory', []);
  const bookmarkFolders = loadFromLocalStorage('bookmarkFolders', []);

  searchHistory.forEach(query => {
    const li = document.createElement('li');
    li.textContent = query;
    searchHistoryList.appendChild(li);
  });

  bookmarkFolders.forEach(folder => {
    const li = document.createElement('li');
    li.textContent = folder;
    bookmarkFoldersList.appendChild(li);
  });

  searchInput.addEventListener('input', () => {
    // Implement live search preview
  });

  searchButton.addEventListener('click', () => {
    let query = searchInput.value.trim();
    const selectedSites = Array.from(siteSelect.selectedOptions).map(option => option.value);
    const customSiteValue = customSite.value.trim();
    const selectedFiletypes = Array.from(filetypeSelect.selectedOptions).map(option => option.value);

    const allSites = [...selectedSites, ...(customSiteValue ? [customSiteValue] : [])];

    if (allSites.length > 0) {
      query += ' site:' + allSites.join(' OR site:');
    }

    if (selectedFiletypes.length > 0) {
      query += ' filetype:' + selectedFiletypes.join(' OR filetype:');
    }

    if (query) {
      searchHistory.push(query);
      saveToLocalStorage('searchHistory', searchHistory);

      const li = document.createElement('li');
      li.textContent = query;
      searchHistoryList.appendChild(li);
    }

    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  });

  animeSearchButton.addEventListener('click', () => {
    let query = animeSearchInput.value.trim();
    const selectedAnimeSites = Array.from(animeSiteSelect.selectedOptions).map(option => option.value);
    const selectedAnimeFiletypes = Array.from(animeFiletypeSelect.selectedOptions).map(option => option.value);

    if (selectedAnimeSites.length > 0) {
      query += ' site:' + selectedAnimeSites.join(' OR site:');
    }

    if (selectedAnimeFiletypes.length > 0) {
      query += ' filetype:' + selectedAnimeFiletypes.join(' OR filetype:');
    }

    if (query) {
      searchHistory.push(query);
      saveToLocalStorage('searchHistory', searchHistory);

      const li = document.createElement('li');
      li.textContent = query;
      searchHistoryList.appendChild(li);
    }

    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  });

  kdramaSearchButton.addEventListener('click', () => {
    let query = kdramaSearchInput.value.trim();
    const selectedKdramaSites = Array.from(kdramaSiteSelect.selectedOptions).map(option => option.value);
    const selectedKdramaFiletypes = Array.from(kdramaFiletypeSelect.selectedOptions).map(option => option.value);

    if (selectedKdramaSites.length > 0) {
      query += ' site:' + selectedKdramaSites.join(' OR site:');
    }

    if (selectedKdramaFiletypes.length > 0) {
      query += ' filetype:' + selectedKdramaFiletypes.join(' OR filetype:');
    }

    if (query) {
      searchHistory.push(query);
      saveToLocalStorage('searchHistory', searchHistory);

      const li = document.createElement('li');
      li.textContent = query;
      searchHistoryList.appendChild(li);
    }

    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  });

  bookSearchButton.addEventListener('click', () => {
    let query = bookSearchInput.value.trim();
    const selectedBookSites = Array.from(bookSiteSelect.selectedOptions).map(option => option.value);
    const selectedBookFiletypes = Array.from(bookFiletypeSelect.selectedOptions).map(option => option.value);

    if (selectedBookSites.length > 0) {
      query += ' site:' + selectedBookSites.join(' OR site:');
    }

    if (selectedBookFiletypes.length > 0) {
      query += ' filetype:' + selectedBookFiletypes.join(' OR filetype:');
    }

    if (query) {
      searchHistory.push(query);
      saveToLocalStorage('searchHistory', searchHistory);

      const li = document.createElement('li');
      li.textContent = query;
      searchHistoryList.appendChild(li);
    }

    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  });

  toggleModeButton.addEventListener('click', () => {
    toggleMode();
  });

  // Auto-detect and apply system theme
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  });

  if (darkModeMediaQuery.matches) {
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
  }

  document.querySelectorAll('select[multiple]').forEach(select => {
    select.addEventListener('change', (event) => {
      const options = Array.from(event.target.options);
      const selectAll = options.find(option => option.value === 'all');
      
      if (selectAll && selectAll.selected) {
        options.forEach(option => {
          if (option.value !== 'all') {
            option.selected = true;
          }
        });
      } else if (!selectAll) {
        const allSelected = options.every(option => option.selected);
        if (selectAll) {
          selectAll.selected = allSelected;
        }
      }
    });
  });
});