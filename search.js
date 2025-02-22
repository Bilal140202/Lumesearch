const performSearch = (query, sites, filetypes) => {
  if (!query) return;

  let searchQuery = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  if (sites.length > 0) {
    const siteQueries = sites.map(site => `site:${site}`).join('+OR+');
    searchQuery += `+(${siteQueries})`;
  }

  if (filetypes.length > 0) {
    const filetypeQueries = filetypes.map(filetype => `filetype:${filetype}`).join('+OR+');
    searchQuery += `+(${filetypeQueries})`;
  }

  window.open(searchQuery, '_blank');
};

export { performSearch };
