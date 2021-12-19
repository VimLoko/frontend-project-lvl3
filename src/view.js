import onChange from 'on-change';

const renderForm = (form, elements) => {
  switch (form.status) {
    case 'filling':
      elements.btn.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.value = '';
      break;

    case 'failed':
      elements.btn.removeAttribute('disabled');
      elements.input.removeAttribute('disabled');
      elements.input.select();
      break;

    case 'loading':
      elements.btn.setAttribute('disabled', true);
      elements.input.setAttribute('disabled', true);
      break;

    default:
      throw Error(`Unknown form status: ${form.status}`);
  }
};

const renderFormErrors = (form, elements) => {
  const urlField = form.fields.url;
  if (urlField.valid) {
    elements.errorText.textContent = '';
  } else {
    elements.errorText.textContent = urlField.error;
  }
};

const renderRequestErrors = (form, elements) => {
  const formError = form.error;
  console.log(formError);
  if (!formError) {
    elements.errorText.textContent = '';
  } else {
    elements.errorText.textContent = formError;
  }
};

const initView = (state, elements) => {
  const mapping = {
    'form.status': () => renderForm(state.form, elements),
    'form.error': () => renderRequestErrors(state.form, elements),
    'form.fields.url': () => renderFormErrors(state.form, elements),
  };
  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });

  return watchedState;
};

export default initView;
