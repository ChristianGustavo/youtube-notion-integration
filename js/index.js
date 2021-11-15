const searchBtn = document.getElementById('search');
const input = document.getElementById('searchInput');
const playlistsElement = document.querySelector('.playlists');
const searchIcon = document.querySelector('#search_icon');
const channelTitleElement = document.querySelector('#channelTitle');

let token = null;
let pageInformation = null;

let options = {
  rootMargin: '0px',
  threshold: 1.0
};

let observer = new IntersectionObserver(([ entry ]) => {
  if (entry.isIntersecting && hasNextPage()) {
    retrievePlaylists();
  }
}, options);

observer.observe(document.getElementById('the-end'));


function verifyLayout() {
  if (window.location.search) {
    changeLayout();
    fillSearchInput();
    retrievePlaylists();
  }
}

function fillSearchInput() {
  const [ , channelId ] = window.location.search.split('=');
  input.value = channelId;
}

searchIcon.addEventListener('click', () => handleClick());
searchBtn.addEventListener('click', () => handleClick());

function handleClick() {
  if (input.value) {
    changeUrlHistory();
    retrievePlaylists();
    changeLayout();
  }
};

function changeUrlHistory() {
  const url = new URL(window.location);
  url.searchParams.set('channelId', input.value);
  history.pushState({}, '', url);
}

function retrieveAllItemsFromHtml() {
  return document.querySelectorAll('li[class="item"]');
}

function loadEventListenersPlaylistItem() {
  const playlistItems = retrieveAllItemsFromHtml();

  playlistItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      console.log(e);
    });
  });
}

function storeTokenAndPage({ nextPageToken, pageInfo }) {
  token = nextPageToken;
  pageInformation = pageInfo;
}

function hasNextPage() {
  return pageInformation && token && retrieveAllItemsFromHtml().length < pageInformation.totalResults;
}

function retrievePlaylists() {
  // let url = `http://localhost/playlists/channel/${input.value}`;
  let url = `https://youtube-notion.herokuapp.com/playlists/channel/${input.value}`;

  if (hasNextPage()) {
    url += `?nextPageToken=${token}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(res => {
      storeTokenAndPage(res);
      return res;
    })
    .then(res => renderListItems(res))
    .then(() => loadEventListenersPlaylistItem())
    ;
}

function changeLayout() {
  document.querySelector('.github-description').classList.add('result-list');
  document.querySelector('.search').classList.add('result-list');
  document.querySelector('footer').classList.add('result-list');
  document.querySelector('.search-result').classList.add('result-list');
}

const cardTemplate = ({ id, playlistTitle, channelTitle, publishedAt, thumbnailSrc }) => (
  `
    <li class="item">
      <a href="#" class="card" data-id="${id}">
        <img class="card__img" src="${thumbnailSrc}" alt="Playlist thumbnail">

        <h1 class="card__title">${playlistTitle}</h1>

        <div class="card__details">
          <p>
            Youtube • 
            <span>${channelTitle}</span> <br />
          </p>
          <span>${publishedAt}</span>
        </div>
      </a>
    </li>
  `
);

function createListItems(playlists) {
  return playlists.map(playlist => cardTemplate(playlist)).join('');
}

function renderListItems({ items }) {
  const playlistsTemplate = createListItems(items);
  playlistsElement.innerHTML += playlistsTemplate;
  channelTitleElement.textContent = items[0].channelTitle;
}

verifyLayout();