import './css/styles.css';
import renderedList from './templates/renderedList.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { instanceFetch } from './api/fetch';

const refs = {
  form: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  galleryDiv: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const searchOptions = {
  imageType: 'photo',
  orientation: 'horizontal',
  safeSearch: true,
  page: 1,
  perPage: 20,
  incrementPageNumber() {
    this.page += 1;
  },
  resetPageNumber() {
    this.page = 1;
  },
};

const lightbox = new SimpleLightbox('.gallery a');

let currentSearchRequest = '';

refs.form.addEventListener('submit', e => {
  search(e);
});

refs.loadMoreBtn.addEventListener('click', () => {
  loadMorePhotos();
});

async function search(event) {
  event.preventDefault();

  if (refs.searchInput.value.trim() === '') {
    Notiflix.Notify.warning('Введите запрос');
    return;
  }

  if (refs.searchInput.value.trim() === currentSearchRequest) {
    Notiflix.Notify.warning(
      'Результаты запроса уже показаны. Введите новый запрос'
    );
    return;
  }

  searchOptions.resetPageNumber();
  const fetchResult = await instanceFetch.get(
    `?q=${refs.searchInput.value}&image_type${searchOptions.imageType}&orientation=${searchOptions.orientation}&safesearch=${searchOptions.safeSearch}&page=${searchOptions.page}`
  );

  refs.loadMoreBtn.classList.add('visually-hidden');

  if (fetchResult.data.total === 0) {
    Notiflix.Notify.warning('Nihuya ne znaydeno');
    return;
  }

  Notiflix.Notify.success(
    `Найдено ${fetchResult.data.total} изображений по вашему запросу`
  );

  renderPhotoList(fetchResult.data);
  if (fetchResult.data.hits.length === 20) {
    refs.loadMoreBtn.classList.remove('visually-hidden');
  }
  lightbox.refresh();

  currentSearchRequest = refs.searchInput.value.trim();
}

async function loadMorePhotos() {
  refs.loadMoreBtn.classList.add('visually-hidden');
  searchOptions.incrementPageNumber();
  const fetchResult = await instanceFetch.get(
    `?q=${refs.searchInput.value}&image_type${searchOptions.imageType}&orientation=${searchOptions.orientation}&safesearch=${searchOptions.safeSearch}&page=${searchOptions.page}`
  );
  refs.loadMoreBtn.classList.remove('visually-hidden');
  if (fetchResult.data.hits.length < 20) {
    Notiflix.Notify.failure('Опачки, а это все изображения, больше нема:(');
    refs.loadMoreBtn.classList.add('visually-hidden');
  }
  renderMorePhotoList(fetchResult.data);
  lightbox.refresh();
}

function renderPhotoList(response) {
  refs.galleryDiv.innerHTML = renderedList(response);
}

function renderMorePhotoList(response) {
  refs.galleryDiv.insertAdjacentHTML('beforeend', renderedList(response));
}
