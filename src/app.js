import validator from './validate';
import initView from './view';
import translater from './translater';

const state = {
  form: {
    status: 'filling',
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

const formStateFilling = (watched) => {
  watched.form.status = 'filling';
  watched.form.fields.url = {
    valid: true,
    error: null,
  };
};

const formStateError = (watched, error) => {
  watched.form.status = 'failed';
  watched.form.fields.url = {
    valid: false,
    error: error.message,
  };
};

const formStateLoading = (watched) => {
  watched.form.status = 'loading';
  watched.form.fields.url = {
    valid: true,
    error: null,
  };
};

const app = () => {
  const watched = initView(state, elements);
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const targetForm = e.target;
    if (targetForm) {
      const formData = new FormData(targetForm);
      const url = formData.get('url').trim();
      validator(url)
        .then((validatedData) => {
          formStateLoading(watched);
          formStateFilling(watched);
          console.log(validatedData);
        })
        .catch((error) => {
          formStateError(watched, error);
        });
    }
  });
};

export default () => translater.then(app);
