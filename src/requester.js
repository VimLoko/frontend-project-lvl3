import i18next from 'i18next';

import axios from 'axios';

export default {
  client: axios.create({
    baseURL: 'https://hexlet-allorigins.herokuapp.com/',
    timeout: 3000,
    timeoutErrorMessage: i18next.t('errors.timeoutErrorMessage'),
  }),

  get(url) {
    return this.client.get(`get?disableCache=true&url=${encodeURIComponent(url)}`).catch(() => {
      throw new Error(i18next.t('errors.timeoutErrorMessage'));
    });
  },
};
