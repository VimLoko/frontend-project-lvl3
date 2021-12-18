import * as yup from 'yup';

export default (url) => {
  const schema = yup.object().shape({
    url: yup.string().required().url(),
  });

  return schema.validate({ url });
};
