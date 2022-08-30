import './css/styles.css';
import renderedList from './templates/renderedList.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { instanceFetch } from './fetch';

const refs = {
  form: document.querySelector('.search-form'),
  searchInput: document.querySelector('.search-input'),
  galleryDiv: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', async e => {
  e.preventDefault();
  refs.loadMoreBtn.classList.add('visually-hidden');
  instanceFetch.defaults.resetPageNumber();
  const fetchResult = await instanceFetch.get(`?q=${refs.searchInput.value}`);

  if (fetchResult.data.total === 0) {
    Notiflix.Notify.warning('Nihuya ne znaydeno');
    return;
  }
  console.log(fetchResult.data);
  renderPhotoList(fetchResult.data);
  refs.loadMoreBtn.classList.remove('visually-hidden');
  lightbox.refresh();

  console.log('Submitted');
});

refs.searchInput.addEventListener('input', () => {
  console.log('Inputtin...');
});

refs.loadMoreBtn.addEventListener('click', async () => {
  refs.loadMoreBtn.classList.add('visually-hidden');
  instanceFetch.defaults.incrementPageNumber();
  const fetchResult = await instanceFetch.get(`?q=${refs.searchInput.value}`);
  refs.loadMoreBtn.classList.remove('visually-hidden');
  if (fetchResult.data.hits.length <= 20) {
    Notiflix.Notify.failure('Опачки, а это все изображения, больше нема:(');
    refs.loadMoreBtn.classList.add('visually-hidden');
  }
  renderMorePhotoList(fetchResult.data);
  lightbox.refresh();
});

function renderPhotoList(response) {
  refs.galleryDiv.innerHTML = renderedList(response);
}
function renderMorePhotoList(response) {
  refs.galleryDiv.insertAdjacentHTML('beforeend', renderedList(response));
}
