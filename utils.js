export function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage(key, defaultValue = null) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}

export function toggleMode() {
  document.body.classList.toggle('light-mode');
}