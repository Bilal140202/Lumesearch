export function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage(key, defaultValue = null) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}

export function toggleMode() {
  document.body.classList.toggle('dark-mode');
}

export function applySystemTheme() {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeMediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });

  if (darkModeMediaQuery.matches) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}