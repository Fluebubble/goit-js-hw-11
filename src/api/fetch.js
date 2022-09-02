import axios from 'axios';

const API_KEY = '29576888-5bcf4584c20a5ab12bd038a49';

export const instanceFetch = axios.create({
  params: {
    key: API_KEY,
  },
  baseURL: 'https://pixabay.com/api/',
});
