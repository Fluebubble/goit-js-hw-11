import './css/styles.css';
import renderedList from './templates/renderedList.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { instanceFetch, searchOptions, getImages } from './api/fetch';

const refs = {
  form: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  galleryDiv: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const lightbox = new SimpleLightbox('.gallery a');

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

  if (refs.searchInput.value.trim() === searchOptions.q) {
    Notiflix.Notify.warning(
      'Результаты запроса уже показаны. Введите новый запрос'
    );
    return;
  }

  searchOptions.page = 1;
  searchOptions.q = refs.searchInput.value;
  const fetchResult = await getImages(searchOptions);
  refs.loadMoreBtn.classList.add('visually-hidden');

  if (fetchResult.total === 0) {
    Notiflix.Notify.warning('По вашему запросу ничего не найдено');
    return;
  }

  Notiflix.Notify.success(
    `Найдено ${fetchResult.total} изображений по вашему запросу`
  );

  renderPhotoList(fetchResult);
  if (fetchResult.hits.length === 20) {
    refs.loadMoreBtn.classList.remove('visually-hidden');
  }
  lightbox.refresh();

  searchOptions.q = refs.searchInput.value.trim();
}

async function loadMorePhotos() {
  refs.loadMoreBtn.classList.add('visually-hidden');
  searchOptions.page += 1;
  searchOptions.q = refs.searchInput.value;
  const fetchResult = await getImages(searchOptions);
  refs.loadMoreBtn.classList.remove('visually-hidden');
  if (fetchResult.hits.length < 20) {
    Notiflix.Notify.failure('Опачки, а это все изображения, больше нема:(');
    refs.loadMoreBtn.classList.add('visually-hidden');
  }
  renderMorePhotoList(fetchResult);
  lightbox.refresh();
}

function renderPhotoList(response) {
  refs.galleryDiv.innerHTML = renderedList(response);
}

function renderMorePhotoList(response) {
  refs.galleryDiv.insertAdjacentHTML('beforeend', renderedList(response));
}
