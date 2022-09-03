import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '29576888-5bcf4584c20a5ab12bd038a49';

export const searchOptions = {
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
};

export const instanceFetch = axios.create({
  params: {
    key: API_KEY,
  },
  baseURL: 'https://pixabay.com/api/',
});

export const getImages = async params => {
  try {
    const response = await instanceFetch('', { params });
    return response.data;
  } catch (error) {
    Notiflix.Notify.failure(error);
  }
};
