import { find } from 'lodash';
import validator from './validate';
import initView from './view';
import translator from './translator';
import requester from './requester';
import parser from './parser';
import checker from './checker';

const getState = () => ({
  form: {
    status: 'filling',
    error: null,
    feeds: [],
    posts: [],
    viewedPosts: [],
    fields: {
      url: {
        valid: true,
        error: null,
      },
    },
  },
});

const elements = () => ({
  form: document.getElementById('form-rss'),
  input: document.getElementById('url-input'),
  btn: document.getElementById('btn-submit'),
  errorText: document.getElementById('error-text'),
  posts: document.querySelector('.posts'),
  feeds: document.querySelector('.feeds'),
});

const formValidateError = (watched, error) => {
  watched.form.status = 'failed';
  watched.form.error = error.message;
};

const formNetworkError = (watched, error) => {
  watched.form.status = 'failed';
  watched.form.error = error.message;
};

const formSuccessAdd = (watched, t) => {
  watched.form.status = 'success';
  watched.form.error = t('messages.rssSuccess');
};

const app = (t) => {
  const el = elements();
  const state = getState();
  const watched = initView(state, el, t);
  el.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const targetForm = e.target;
    const formData = new FormData(targetForm);
    const url = formData.get('url').trim();
    const rssLinks = watched.form.feeds.map((feed) => feed.url);
    validator(url, t, rssLinks)
      .then((validatedData) => {
        watched.form.status = 'process';
        requester.get(`${validatedData.url}`, t)
          .then((response) => response.data.contents)
          .then((data) => {
            const { feed, posts } = parser(data, t);
            watched.form.feeds.unshift({ ...feed, url: validatedData.url });
            watched.form.posts.unshift(...posts);
            formSuccessAdd(watched, t);
            setTimeout(() => checker(watched, t), 5000);
          })
          .catch((error) => formNetworkError(watched, error));
      }).catch((error) => {
        formValidateError(watched, error);
      });
  });
  el.posts.addEventListener('click', (e) => {
    e.preventDefault();
    const { target } = e;
    if (target && target.nodeName === 'BUTTON') {
      const { id } = target.dataset;
      const post = find(watched.form.posts, { id });
      const modal = document.querySelector('.modal');
      const body = modal.querySelector('.modal-body');
      const title = modal.querySelector('.modal-header > h5');
      const link = modal.querySelector('.btn-primary');

      body.textContent = post.description;
      title.textContent = post.title;
      link.href = post.link;
      if (!watched.form.viewedPosts.includes(id)) {
        watched.form.viewedPosts.push(id);
      }
    }
  });
};

export default () => translator.then((t) => {
  app(t);
});
