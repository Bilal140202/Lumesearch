const getTheme = () => {
  const storedTheme = localStorage.getItem('theme');
  return storedTheme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
};

const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
};

export { getTheme, setTheme };