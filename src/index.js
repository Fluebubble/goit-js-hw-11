import './css/styles.css';
import renderedList from './templates/renderedList.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

const lightbox = new SimpleLightbox('.gallery a');

const SEARCH_API_LINK = 'https://pixabay.com/api/';

const searchOptions = {
  key: '29576888-5bcf4584c20a5ab12bd038a49',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 20,
};
const refs = {
  form: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  galleryDiv: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  refs.loadMoreBtn.classList.add('visually-hidden');
  createRequest().then(r => {
    console.log(r);
    renderPhotoList(r);
    refs.loadMoreBtn.classList.remove('visually-hidden');
    lightbox.refresh();
  });
  console.log('Submitted');
});

refs.searchInput.addEventListener('input', () => {
  console.log('Inputtin...');
});

refs.loadMoreBtn.addEventListener('click', () => {
  searchOptions.page += 1;
  console.log(searchOptions.page);
  createRequest().then(result => {
    renderMorePhotoList(result);
    lightbox.refresh();
  });
});

function createRequest() {
  return fetch(
    `${SEARCH_API_LINK}?key=${searchOptions.key}&q=${refs.searchInput.value}&image_type${searchOptions.image_type}&safesearch${searchOptions.safesearch}&page=${searchOptions.page}`
  ).then(result => result.json());
}

function renderPhotoList(response) {
  refs.galleryDiv.innerHTML = renderedList(response);
}
function renderMorePhotoList(response) {
  refs.galleryDiv.insertAdjacentHTML('beforeend', renderedList(response));
}
