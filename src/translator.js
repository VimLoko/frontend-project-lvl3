import i18next from 'i18next';
import ru from './locales/ru';

export default i18next.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru,
  },
});
