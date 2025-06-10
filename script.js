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
  const ashToggle = document.getElementById('toggle-ash');
  const ashesContainer = document.querySelector('.ashes-container');

  // --- Common Misspellings Dictionary ---
  const commonMisspellings = {
    "teh": "the",
    "recieve": "receive",
    "adress": "address",
    "wierd": "weird",
    "definately": "definitely",
    "seperate": "separate",
    "goverment": "government",
    "enviornment": "environment",
    "publically": "publicly",
    "succesful": "successful",
    "untill": "until",
    "accomodate": "accommodate",
    "acheive": "achieve",
    "arguement": "argument",
    "beleive": "believe",
    "calender": "calendar",
    "comittee": "committee",
    "concious": "conscious",
    "grammer": "grammar",
    "hight": "height",
    "immediatly": "immediately",
    "independant": "independent",
    "jewelery": "jewelry",
    "knowlege": "knowledge",
    "libary": "library",
    "mispell": "misspell",
    "neccessary": "necessary",
    "occured": "occurred",
    "ommision": "omission",
    "priviledge": "privilege",
    "questionaire": "questionnaire",
    "responsability": "responsibility",
    "restaraunt": "restaurant",
    "rythm": "rhythm",
    "sincerly": "sincerely",
    "suprise": "surprise",
    "tommorow": "tomorrow",
    "tounge": "tongue",
    "Wensday": "Wednesday",
    "anouncement": "announcement",
    "artic": "arctic",
    "athiest": "atheist",
    "beatiful": "beautiful",
    "becuase": "because",
    "cemetary": "cemetery",
    "certian": "certain",
    "cheif": "chief",
    "colum": "column",
    "comming": "coming",
    "copywrite": "copyright",
    "decieve": "deceive",
    "diffrent": "different",
    "especialy": "especially",
    "experiance": "experience",
    "foriegn": "foreign",
    "freind": "friend",
    "garantee": "guarantee",
    "gard": "guard",
    "happend": "happened",
    "haras": "harass",
    "humourous": "humorous",
    "ignorence": "ignorance",
    "interupt": "interrupt",
    "irresistable": "irresistible",
    "leigh": "lie",
    "lenght": "length",
    "maintenence": "maintenance",
    "mariage": "marriage",
    "miniscule": "minuscule",
    "naturaly": "naturally",
    "noticable": "noticeable",
    "passtime": "pastime",
    "percieve": "perceive",
    "personel": "personal", // Or personnel depending on context, common mix-up
    "possesssion": "possession",
    "potatos": "potatoes",
    "profesor": "professor",
    "promiss": "promise",
    "pronounciation": "pronunciation",
    "recomend": "recommend",
    "refered": "referred",
    "religous": "religious",
    "threshhold": "threshold",
    "truely": "truly",
    "unconcious": "unconscious",
    "vaccuum": "vacuum",
    "visable": "visible",
    "vaccum": "vacuum",
    "wether": "whether",
    // Add more common misspellings as needed
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
    removeSuggestions(containerId); // Remove old suggestions

    const inputValue = inputElement.value.toLowerCase();
    if (!inputValue) return; // Don't show suggestions if input is empty

    const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(inputValue));
    if (filteredSuggestions.length === 0) return; // No relevant suggestions

    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = containerId;
    suggestionsContainer.classList.add('suggestions-list'); // For styling

    filteredSuggestions.forEach(suggestionText => {
      const item = document.createElement('div');
      item.classList.add('suggestion-item'); // For styling
      item.textContent = suggestionText;
      item.addEventListener('click', () => {
        inputElement.value = suggestionText;
        removeSuggestions(containerId);
        searchButtonElement.click(); // Trigger search
      });
      suggestionsContainer.appendChild(item);
    });

    inputElement.parentNode.insertBefore(suggestionsContainer, inputElement.nextSibling);
  }

  // --- "Did You Mean" Functionality ---
  function checkQueryForMisspellings(query, inputElement, didYouMeanContainerId, searchButtonElement) {
    const didYouMeanContainer = document.getElementById(didYouMeanContainerId);
    if (!didYouMeanContainer) return;
    didYouMeanContainer.innerHTML = ''; // Clear previous suggestions

    const words = query.toLowerCase().split(/\s+/); // Split by spaces, handle multiple spaces
    let correctedWords = [];
    let hasMisspellings = false;

    words.forEach(word => {
      // Remove common punctuation for checking, but keep original word form for reconstruction if not misspelled
      const cleanedWord = word.replace(/[.,!?;:"']/g, '');
      if (commonMisspellings[cleanedWord]) {
        // Attempt to preserve original casing of the first letter if corrected word is single char different
        let corrected = commonMisspellings[cleanedWord];
        if (word.length > 0 && corrected.length > 0 && word[0] === word[0].toUpperCase() && word.slice(1) === cleanedWord.slice(1) ) {
            // if original word was "Teh" and cleaned is "teh" and corrected is "the"
            // make it "The"
             corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
        } else if (word === word.toUpperCase() && word.length > 1) { // If original was all caps (and not just "A")
            corrected = corrected.toUpperCase();
        }
        // More complex casing preservation might be needed for other scenarios

        correctedWords.push(word.replace(cleanedWord, corrected)); // Replace the misspelled part within the original word (to keep punctuation)
        hasMisspellings = true;
      } else {
        correctedWords.push(word); // Keep original word
      }
    });

    if (hasMisspellings) {
      const correctedQuery = correctedWords.join(' ');
      const suggestionText = document.createElement('span');
      suggestionText.className = 'suggestion-text';
      suggestionText.textContent = 'Did you mean: ';

      const suggestionLink = document.createElement('span'); // Using span, styled as link
      suggestionLink.className = 'suggestion-link';
      suggestionLink.textContent = correctedQuery + '?';
      suggestionLink.addEventListener('click', () => {
        inputElement.value = correctedQuery;
        didYouMeanContainer.innerHTML = ''; // Clear suggestion
        searchButtonElement.click(); // Trigger new search
      });

      didYouMeanContainer.appendChild(suggestionText);
      didYouMeanContainer.appendChild(suggestionLink);
    }
  }

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

  // Event Listeners for General Search
  searchInput.addEventListener('input', () => {
    createSuggestionsList(generalSuggestions, searchInput, searchButton, 'general-suggestions');
  });
  searchInput.addEventListener('focus', () => {
    createSuggestionsList(generalSuggestions, searchInput, searchButton, 'general-suggestions');
  });
  searchInput.addEventListener('blur', () => {
    setTimeout(() => removeSuggestions('general-suggestions'), 150); // Delay to allow click on suggestion
  });

  searchButton.addEventListener('click', () => {
    let originalQueryText = searchInput.value.trim(); // Capture the raw input for "Did you mean"
    if (originalQueryText) {
       checkQueryForMisspellings(originalQueryText, searchInput, 'general-did-you-mean', searchButton);
    }

    let query = originalQueryText; // This query will be modified with site/filetype
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

  // Event Listeners for Anime Search
  animeSearchInput.addEventListener('input', () => {
    createSuggestionsList(animeSuggestions, animeSearchInput, animeSearchButton, 'anime-suggestions');
  });
  animeSearchInput.addEventListener('focus', () => {
    createSuggestionsList(animeSuggestions, animeSearchInput, animeSearchButton, 'anime-suggestions');
  });
  animeSearchInput.addEventListener('blur', () => {
    setTimeout(() => removeSuggestions('anime-suggestions'), 150);
  });

  animeSearchButton.addEventListener('click', () => {
    let originalQueryText = animeSearchInput.value.trim();
    if (originalQueryText) {
      checkQueryForMisspellings(originalQueryText, animeSearchInput, 'anime-did-you-mean', animeSearchButton);
    }
    let query = originalQueryText;
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

  // Event Listeners for K-drama Search
  kdramaSearchInput.addEventListener('input', () => {
    createSuggestionsList(kdramaSuggestions, kdramaSearchInput, kdramaSearchButton, 'kdrama-suggestions');
  });
  kdramaSearchInput.addEventListener('focus', () => {
    createSuggestionsList(kdramaSuggestions, kdramaSearchInput, kdramaSearchButton, 'kdrama-suggestions');
  });
  kdramaSearchInput.addEventListener('blur', () => {
    setTimeout(() => removeSuggestions('kdrama-suggestions'), 150);
  });

  kdramaSearchButton.addEventListener('click', () => {
    let originalQueryText = kdramaSearchInput.value.trim();
    if (originalQueryText) {
      checkQueryForMisspellings(originalQueryText, kdramaSearchInput, 'kdrama-did-you-mean', kdramaSearchButton);
    }
    let query = originalQueryText;
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

  // Event Listeners for Book Search
  bookSearchInput.addEventListener('input', () => {
    createSuggestionsList(bookSuggestions, bookSearchInput, bookSearchButton, 'book-suggestions');
  });
  bookSearchInput.addEventListener('focus', () => {
    createSuggestionsList(bookSuggestions, bookSearchInput, bookSearchButton, 'book-suggestions');
  });
  bookSearchInput.addEventListener('blur', () => {
    setTimeout(() => removeSuggestions('book-suggestions'), 150);
  });

  bookSearchButton.addEventListener('click', () => {
    let originalQueryText = bookSearchInput.value.trim();
    if (originalQueryText) {
      checkQueryForMisspellings(originalQueryText, bookSearchInput, 'book-did-you-mean', bookSearchButton);
    }
    let query = originalQueryText;
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

  // --- Ash Animation Toggle Logic ---
  if (ashToggle && ashesContainer) {
    // Load preference from local storage, default to true (enabled)
    const ashAnimationStoredPref = localStorage.getItem('ashAnimationEnabled');
    let ashAnimationEnabled = ashAnimationStoredPref !== null ? JSON.parse(ashAnimationStoredPref) : true;

    ashToggle.checked = ashAnimationEnabled;

    if (!ashAnimationEnabled) {
      ashesContainer.classList.add('ash-animation-disabled');
    }

    ashToggle.addEventListener('change', () => {
      ashAnimationEnabled = ashToggle.checked;
      localStorage.setItem('ashAnimationEnabled', JSON.stringify(ashAnimationEnabled));
      if (ashAnimationEnabled) {
        ashesContainer.classList.remove('ash-animation-disabled');
      } else {
        ashesContainer.classList.add('ash-animation-disabled');
      }
    });
  }

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