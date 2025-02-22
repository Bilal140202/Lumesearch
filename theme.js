const root = document.documentElement;

// Theme configurations
const themes = {
  light: {
    '--bg-color': '#ffffff',
    '--text-color': '#121212',
    '--primary-color': '#007bff',
    '--secondary-color': '#6c757d',
    '--accent-color': '#ff4081',
    '--shadow-color': 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    '--bg-color': '#121212',
    '--text-color': '#ffffff',
    '--primary-color': '#1e88e5',
    '--secondary-color': '#90a4ae',
    '--accent-color': '#ff4081',
    '--shadow-color': 'rgba(255, 255, 255, 0.1)',
  },
  premium: {
    '--bg-color': '#0d1117',
    '--text-color': '#c9d1d9',
    '--primary-color': '#58a6ff',
    '--secondary-color': '#8b949e',
    '--accent-color': '#f778ba',
    '--shadow-color': 'rgba(255, 255, 255, 0.2)',
  }
};

// Get current theme
const getTheme = () => {
  return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
};

// Set and apply theme
const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
};

// Apply theme styles
const applyTheme = (theme) => {
  if (!themes[theme]) return;
  
  Object.keys(themes[theme]).forEach(property => {
    root.style.setProperty(property, themes[theme][property]);
  });

  document.body.classList.remove('light', 'dark', 'premium');
  document.body.classList.add(theme);
};

// Auto-detect system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const newTheme = e.matches ? 'dark' : 'light';
  if (!localStorage.getItem('theme')) {
    applyTheme(newTheme);
  }
});

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());
});

export { getTheme, setTheme, applyTheme };
