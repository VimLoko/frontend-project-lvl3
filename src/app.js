import { find } from 'lodash';
import i18next from 'i18next';
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
    viewedPosts: [],
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
  posts: document.querySelector('.posts'),
  feeds: document.querySelector('.feeds'),
};

const formValidateError = (watched, error) => {
  watched.form.status = 'failed';
  watched.form.error = error.message;
};

const formNetworkError = (watched, error) => {
  watched.form.status = 'failed';
  watched.form.error = error.message;
};

const formSuccessAdd = (watched) => {
  watched.form.status = 'success';
  watched.form.error = i18next.t('messages.rssSuccess');
};

const app = () => {
  const watched = initView(state, elements);
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const targetForm = e.target;
    const formData = new FormData(targetForm);
    const url = formData.get('url').trim();
    const rssLinks = watched.form.feeds.map((feed) => feed.url);
    validator(url, rssLinks)
      .then((validatedData) => {
        requester.get(`${validatedData.url}`)
          .then((response) => response.data.contents)
          .then((data) => {
            const { feed, posts } = parser(data);
            watched.form.feeds.unshift({ ...feed, url: validatedData.url });
            watched.form.posts.unshift(...posts);
            formSuccessAdd(watched);
            setTimeout(() => checker(watched), 5000);
          })
          .catch((error) => formNetworkError(watched, error));
      }).catch((error) => {
        formValidateError(watched, error);
      });
  });
  elements.posts.addEventListener('click', (e) => {
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

export default () => '';
