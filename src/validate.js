import * as yup from 'yup';
import { setLocale } from 'yup';
import i18next from 'i18next';

export default (url) => {
  setLocale({
    string: {
      required: i18next.t('errors.urlIsRequired'),
      url: i18next.t('errors.urlNotValid'),
    },
  });
  const schema = yup.object().shape({
    url: yup.string().required().url(),
  });

  return schema.validate({ url });
};
