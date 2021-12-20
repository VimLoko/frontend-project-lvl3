import * as yup from 'yup';
import { setLocale } from 'yup';
import i18next from 'i18next';

export default (url, rssLinks) => {
  setLocale({
    string: {
      required: i18next.t('errors.urlIsRequired'),
      url: i18next.t('errors.urlNotValid'),
    },
    mixed: {
      notOneOf: i18next.t('errors.urlAlreadyExists'),
    },
  });
  const schema = yup.object().shape({
    url: yup.string().required().url().notOneOf(rssLinks),
  });

  return schema.validate({ url });
};
