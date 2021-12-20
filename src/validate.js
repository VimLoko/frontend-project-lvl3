import * as yup from 'yup';
import { setLocale } from 'yup';

export default (url, t, rssLinks) => {
  setLocale({
    string: {
      required: t('errors.urlIsRequired'),
      url: t('errors.urlNotValid'),
    },
    mixed: {
      notOneOf: t('errors.rssAlreadyExists'),
    },
  });
  const schema = yup.object().shape({
    url: yup.string().required().url().notOneOf(rssLinks),
  });

  return schema.validate({ url });
};
