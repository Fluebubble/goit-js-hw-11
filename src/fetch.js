const axios = require('axios').default;

export const instanceFetch = axios.create({
  params: {
    key: '29576888-5bcf4584c20a5ab12bd038a49',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
  },
  baseURL: 'https://pixabay.com/api/',
  per_page: 20,
  incrementPageNumber() {
    this.params.page += 1;
  },
  resetPageNumber() {
    this.params.page = 1;
  },
});
