const performSearch = (query, sites = [], filetypes = []) => {
  let searchParams = [encodeURIComponent(query)];

  if (sites.length) {
    searchParams.push(sites.map(site => `site:${encodeURIComponent(site)}`).join(' OR '));
  }

  if (filetypes.length) {
    searchParams.push(filetypes.map(filetype => `filetype:${encodeURIComponent(filetype)}`).join(' OR '));
  }

  const searchQuery = `https://www.google.com/search?q=${searchParams.join(' ')}`;
  window.open(searchQuery, '_blank');
};

export { performSearch };
