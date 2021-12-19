import validator from './validate';
import initView from './view';
import translator from './translator';
import requester from './requester';
import parser from './parser';
import checker from './checker';

const state = {
  form: {
    status: 'filling',
    error: null,
    feeds: [],
    posts: [],
    fields: {
      url: {
        valid: true,
        error: null,
      },
    },
  },
};

const elements = {
  form: document.getElementById('form-rss'),
  input: document.getElementById('url-input'),
  btn: document.getElementById('btn-submit'),
  errorText: document.getElementById('error-text'),
};

const formValidateError = (watched, error) => {
  watched.form.status = 'failed';
  watched.form.error = error.message;
};

const formNetworkError = (watched, error) => {
  watched.form.status = 'failed';
  watched.form.error = error.message;
};

const app = () => {
  const watched = initView(state, elements);
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const targetForm = e.target;
    const formData = new FormData(targetForm);
    const url = formData.get('url').trim();
    validator(url)
      .then((validatedData) => {
        // formStateLoading(watched);
        // formStateFilling(watched);
        requester.get(`${validatedData.url}`)
          .then((response) => response.data.contents)
          .then((data) => {
            const { feed, posts } = parser(data);
            watched.form.feeds.unshift({ ...feed, url: validatedData.url });
            watched.form.posts.unshift(...posts);
            checker(watched);
          })
          .catch((error) => formNetworkError(watched, error));
      }).catch((error) => {
        formValidateError(watched, error);
      });
  });
};

export default () => translator.then(app);
