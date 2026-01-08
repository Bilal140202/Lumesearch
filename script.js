import { saveToLocalStorage, loadFromLocalStorage, toggleMode } from './utils.js';
import { initBackground } from './background.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialization ---
  initBackground();

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

  // --- Common Misspellings Dictionary ---
  const commonMisspellings = {
    "teh": "the", "recieve": "receive", "adress": "address", "wierd": "weird",
    "definately": "definitely", "seperate": "separate", "goverment": "government",
    "enviornment": "environment", "publically": "publicly", "succesful": "successful",
    "untill": "until", "accomodate": "accommodate", "acheive": "achieve",
    "arguement": "argument", "beleive": "believe", "calender": "calendar",
    "comittee": "committee", "concious": "conscious", "grammer": "grammar",
    "hight": "height", "immediatly": "immediately", "independant": "independent",
    "jewelery": "jewelry", "knowlege": "knowledge", "libary": "library",
    "mispell": "misspell", "neccessary": "necessary", "occured": "occurred",
    "ommision": "omission", "priviledge": "privilege", "questionaire": "questionnaire",
    "responsability": "responsibility", "restaraunt": "restaurant", "rythm": "rhythm",
    "sincerly": "sincerely", "suprise": "surprise", "tommorow": "tomorrow",
    "tounge": "tongue", "Wensday": "Wednesday"
  };

  // --- Search Suggestions ---
  const generalSuggestions = [
    "latest tech news", "best programming tutorials", "upcoming movies", "top restaurants near me", "DIY project ideas",
    "learn python", "javascript frameworks", "machine learning basics", "data science courses", "how to cook pasta"
  ];
  const animeSuggestions = [
    "Attack on Titan season 4", "Demon Slayer movie", "Jujutsu Kaisen characters", "best anime of all time", "new anime releases",
    "One Piece latest episode", "Naruto Shippuden watch order", "My Hero Academia manga", "Spy x Family review", "Chainsaw Man trailer"
  ];
  const kdramaSuggestions = [
    "Crash Landing on You", "Squid Game season 2", "best kdramas 2023", "top korean actors", "Goblin ost",
    "Descendants of the Sun", "Boys Over Flowers", "The Glory review", "Alchemy of Souls", "new kdrama recommendations"
  ];
  const bookSuggestions = [
    "The Lord of the Rings", "Dune series", "Stephen King new book", "best fantasy novels", "classic literature",
    "Atomic Habits summary", "Sapiens by Yuval Noah Harari", "Where the Crawdads Sing", "Project Hail Mary", "best mystery books"
  ];

  function removeSuggestions(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      container.remove();
    }
  }

  function createSuggestionsList(suggestions, inputElement, searchButtonElement, containerId) {
    removeSuggestions(containerId);

    const inputValue = inputElement.value.toLowerCase();
    if (!inputValue) return;

    const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(inputValue));
    if (filteredSuggestions.length === 0) return;

    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = containerId;
    suggestionsContainer.classList.add('suggestions-list');

    filteredSuggestions.forEach(suggestionText => {
      const item = document.createElement('div');
      item.classList.add('suggestion-item');
      item.textContent = suggestionText;
      item.addEventListener('click', () => {
        inputElement.value = suggestionText;
        removeSuggestions(containerId);
        searchButtonElement.click();
      });
      suggestionsContainer.appendChild(item);
    });

    // Append relative to input parent for correct positioning
    inputElement.parentNode.style.position = 'relative';
    inputElement.parentNode.appendChild(suggestionsContainer);
  }

  // --- "Did You Mean" Functionality ---
  function checkQueryForMisspellings(query, inputElement, didYouMeanContainerId, searchButtonElement) {
    const didYouMeanContainer = document.getElementById(didYouMeanContainerId);
    if (!didYouMeanContainer) return;
    didYouMeanContainer.innerHTML = '';

    const words = query.toLowerCase().split(/\s+/);
    let correctedWords = [];
    let hasMisspellings = false;

    words.forEach(word => {
      const cleanedWord = word.replace(/[.,!?;:"']/g, '');
      if (commonMisspellings[cleanedWord]) {
        let corrected = commonMisspellings[cleanedWord];
        if (word.length > 0 && corrected.length > 0 && word[0] === word[0].toUpperCase() && word.slice(1) === cleanedWord.slice(1) ) {
             corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
        } else if (word === word.toUpperCase() && word.length > 1) {
            corrected = corrected.toUpperCase();
        }
        correctedWords.push(word.replace(cleanedWord, corrected));
        hasMisspellings = true;
      } else {
        correctedWords.push(word);
      }
    });

    if (hasMisspellings) {
      const correctedQuery = correctedWords.join(' ');
      const suggestionText = document.createElement('span');
      suggestionText.className = 'suggestion-text';
      suggestionText.textContent = 'Did you mean: ';

      const suggestionLink = document.createElement('span');
      suggestionLink.className = 'suggestion-link';
      suggestionLink.textContent = correctedQuery + '?';
      suggestionLink.addEventListener('click', () => {
        inputElement.value = correctedQuery;
        didYouMeanContainer.innerHTML = '';
        searchButtonElement.click();
      });

      didYouMeanContainer.appendChild(suggestionText);
      didYouMeanContainer.appendChild(suggestionLink);

      // Animate Did You Mean
      anime({
        targets: didYouMeanContainer,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 800,
        easing: 'easeOutElastic(1, .8)'
      });
    }
  }

  // Load search history and bookmark folders
  const searchHistory = loadFromLocalStorage('searchHistory', []);
  const bookmarkFolders = loadFromLocalStorage('bookmarkFolders', []);

  function updateHistoryUI() {
    searchHistoryList.innerHTML = '';
    searchHistory.forEach(query => {
        const li = document.createElement('li');
        li.textContent = query;
        searchHistoryList.appendChild(li);
    });
  }
  updateHistoryUI();

  bookmarkFolders.forEach(folder => {
    const li = document.createElement('li');
    li.textContent = folder;
    bookmarkFoldersList.appendChild(li);
  });

  // --- Navigation & Scene Transitions with Anime.js ---
  function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const scenes = document.querySelectorAll('.scene');

    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('data-target');

        // Update Nav State
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Find current and target scenes
        const currentScene = document.querySelector('.scene.active');
        const targetScene = document.getElementById(targetId);

        if (currentScene && currentScene !== targetScene) {
          // Robust Transition Strategy:
          // 1. Fade out current
          // 2. Hide current
          // 3. Show target (invisible)
          // 4. Fade in target

          anime({
            targets: currentScene,
            opacity: 0,
            scale: 0.95, // Subtle scale down
            duration: 300,
            easing: 'easeInOutQuad',
            complete: () => {
              currentScene.classList.remove('active');
              // Ensure visibility is toggled by class, but we can force styles if needed

              targetScene.classList.add('active');
              // Ensure starting state for animation
              targetScene.style.opacity = 0;
              targetScene.style.transform = 'scale(1.05)'; // Start slightly zoomed in

              anime({
                targets: targetScene,
                opacity: 1,
                scale: 1,
                duration: 500,
                easing: 'easeOutExpo'
              });
            }
          });
        }
      });
    });
  }

  // --- Search Logic Helper ---
  function performSearch(input, siteSel, customSiteInput, filetypeSel, historyList, prefix = '') {
    let originalQueryText = input.value.trim();
    let query = originalQueryText;
    const selectedSites = Array.from(siteSel.selectedOptions).map(option => option.value);
    const customSiteValue = customSiteInput ? customSiteInput.value.trim() : '';
    const selectedFiletypes = Array.from(filetypeSel.selectedOptions).map(option => option.value);

    const allSites = [...selectedSites, ...(customSiteValue ? [customSiteValue] : [])];

    if (allSites.length > 0) {
      query += ' site:' + allSites.join(' OR site:');
    }

    if (selectedFiletypes.length > 0) {
      query += ' filetype:' + selectedFiletypes.join(' OR filetype:');
    }

    if (query) {
      searchHistory.push(query);
      if(searchHistory.length > 10) searchHistory.shift();
      saveToLocalStorage('searchHistory', searchHistory);
      updateHistoryUI();
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  }

  // --- Event Listeners ---

  // General Search
  searchInput.addEventListener('input', () => createSuggestionsList(generalSuggestions, searchInput, searchButton, 'general-suggestions'));
  searchInput.addEventListener('blur', () => setTimeout(() => removeSuggestions('general-suggestions'), 150));

  searchButton.addEventListener('click', () => {
    let q = searchInput.value.trim();
    if(q) checkQueryForMisspellings(q, searchInput, 'general-did-you-mean', searchButton);
    performSearch(searchInput, siteSelect, customSite, filetypeSelect, searchHistoryList);
  });

  // Anime Search
  animeSearchInput.addEventListener('input', () => createSuggestionsList(animeSuggestions, animeSearchInput, animeSearchButton, 'anime-suggestions'));
  animeSearchInput.addEventListener('blur', () => setTimeout(() => removeSuggestions('anime-suggestions'), 150));

  animeSearchButton.addEventListener('click', () => {
    let q = animeSearchInput.value.trim();
    if(q) checkQueryForMisspellings(q, animeSearchInput, 'anime-did-you-mean', animeSearchButton);
    performSearch(animeSearchInput, animeSiteSelect, null, animeFiletypeSelect, searchHistoryList);
  });

  // KDrama Search
  kdramaSearchInput.addEventListener('input', () => createSuggestionsList(kdramaSuggestions, kdramaSearchInput, kdramaSearchButton, 'kdrama-suggestions'));
  kdramaSearchInput.addEventListener('blur', () => setTimeout(() => removeSuggestions('kdrama-suggestions'), 150));

  kdramaSearchButton.addEventListener('click', () => {
    let q = kdramaSearchInput.value.trim();
    if(q) checkQueryForMisspellings(q, kdramaSearchInput, 'kdrama-did-you-mean', kdramaSearchButton);
    performSearch(kdramaSearchInput, kdramaSiteSelect, null, kdramaFiletypeSelect, searchHistoryList);
  });

  // Book Search
  bookSearchInput.addEventListener('input', () => createSuggestionsList(bookSuggestions, bookSearchInput, bookSearchButton, 'book-suggestions'));
  bookSearchInput.addEventListener('blur', () => setTimeout(() => removeSuggestions('book-suggestions'), 150));

  bookSearchButton.addEventListener('click', () => {
    let q = bookSearchInput.value.trim();
    if(q) checkQueryForMisspellings(q, bookSearchInput, 'book-did-you-mean', bookSearchButton);
    performSearch(bookSearchInput, bookSiteSelect, null, bookFiletypeSelect, searchHistoryList);
  });

  // Theme Toggle
  function updateToggleModeButtonEmoji(button) {
    if (!button) return;
    if (document.body.classList.contains('light-mode')) {
      button.textContent = '☀️';
    } else {
      button.textContent = '🌙';
    }
  }

  toggleModeButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    updateToggleModeButtonEmoji(toggleModeButton);
  });

  // Initial Theme Check
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  document.body.classList.remove('light-mode');
  updateToggleModeButtonEmoji(toggleModeButton);

  // Select Multiple Logic
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

  // Initialize Navigation Logic
  setupNavigation();

  // Initial Entry Animation
  anime({
    targets: '#scene-general',
    opacity: [0, 1],
    scale: [0.9, 1],
    duration: 1000,
    easing: 'easeOutExpo',
    delay: 200
  });

});
