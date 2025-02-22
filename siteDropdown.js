const siteCategories = [
  {
    category: 'Movies & TV Show Download Sites',
    sites: [
      'fztvseries.mobi', '1337x.to', 'yts.mx', 'mkvcinemas.lat'
    ]
  },
  {
    category: 'Cloud Storage & File Hosting',
    sites: [
      'mega.nz', 'mediafire.com', 'zippyshare.com', 'anonfiles.com'
    ]
  },
  {
    category: 'Educational & Research Papers',
    sites: [
      'libgen.is', 'sci-hub.se', 'pdfdrive.com'
    ]
  },
  {
    category: 'Subtitles & Lyrics',
    sites: [
      'subscene.com', 'opensubtitles.org', 'lyrics.com', 'genius.com'
    ]
  },
  {
    category: 'Anime & Manga',
    sites: [
      'gogoanime.pe', '9anime.to', 'mangadex.org', 'animepahe.com'
    ]
  },
  {
    category: 'Games & Software',
    sites: [
      'fitgirl-repacks.site', 'oceanofgames.com', 'nexusmods.com', 'cracked.to'
    ]
  },
  {
    category: 'K-Drama Streaming & Downloading Sites',
    sites: [
      'Dramacool.so', 'Kissasian.pe', 'Myasiantv.to', 'Dramaday.net', 'Viewasian.co',
      'Ondramanice.tv', 'Viki.com', 'Nyaa.si', 'Avistaz.to', 'Asiandramahd.com',
      'Fastdrama.me', 'Gooddrama.to', 'Kshow123.net', 'Newasiantv.tv', 'Soompi.com',
      'Koreanfilm.or.kr', 'Asiancrush.com'
    ]
  }
];

const populateSiteDropdown = (dropdownMenu) => {
  siteCategories.forEach(category => {
    const categoryHeader = document.createElement('h3');
    categoryHeader.textContent = category.category;
    dropdownMenu.appendChild(categoryHeader);

    category.sites.forEach(site => {
      const siteLink = document.createElement('a');
      siteLink.textContent = site;
      siteLink.href = `http://${site}`;
      siteLink.target = '_blank';
      siteLink.rel = 'noopener noreferrer';
      siteLink.style.display = 'block';
      siteLink.style.margin = '5px 0';
      siteLink.style.cursor = 'pointer';
      siteLink.style.whiteSpace = 'nowrap';
      siteLink.ondrag = (ev) => ev.dataTransfer.setData('text', siteLink.textContent);
      siteLink.draggable = true;

      siteLink.addEventListener('click', (event) => {
        const customSiteInput = document.getElementById('custom-site-input');
        customSiteInput.value = site;
        event.preventDefault();
      });

      dropdownMenu.appendChild(siteLink);
    });
  });
};

const getSelectedSites = (dropdownMenu) => {
  const customSiteInput = document.getElementById('custom-site-input');
  const customSite = customSiteInput.value.trim();
  const selectedSites = [];

  dropdownMenu.querySelectorAll('a').forEach(link => {
    if (link.style.backgroundColor === 'rgba(57, 255, 20, 0.2)') {
      selectedSites.push(link.textContent);
    }
  });

  if (customSite) selectedSites.push(customSite);

  return selectedSites;
};

export { populateSiteDropdown, getSelectedSites };