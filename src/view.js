import onChange from 'on-change';

const renderForm = (form, elements) => {
  switch (form.status) {
    case 'failed':
      elements.btn.removeAttribute('disabled');
      elements.input.removeAttribute('readonly');
      elements.errorText.classList.remove('text-success');
      elements.errorText.classList.add('text-danger');
      elements.input.select();
      break;

    case 'process':
      elements.btn.setAttribute('disabled', true);
      elements.input.setAttribute('readonly', true);
      break;

    case 'success':
      elements.btn.removeAttribute('disabled');
      elements.input.removeAttribute('readonly');
      elements.errorText.classList.remove('text-danger');
      elements.errorText.classList.add('text-success');
      elements.input.value = '';
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
  if (!formError) {
    elements.errorText.textContent = '';
  } else {
    elements.errorText.textContent = formError;
  }
};

const renderFeeds = (form, elements) => {
  let feedHtml = `
  <div class="card border-0">
    <div class="card-body"><h2 class="card-title h4">Фиды</h2></div>
    <ul class="list-group border-0 rounded-0">[]</ul>
  </div>
  `;
  let li = '';
  form.feeds.forEach((feed) => {
    li += `
    <li class="list-group-item border-0 border-end-0">
        <h3 class="h6 m-0">${feed.title}</h3>
        <p class="m-0 small text-black-50">${feed.description}</p>
    </li>
    `;
  });
  feedHtml = feedHtml.replace('[]', li);
  elements.feeds.innerHTML = feedHtml;
};

const renderPosts = (form, elements, t) => {
  let postHtml = `
  <div class="card border-0">
    <div class="card-body"><h2 class="card-title h4">Посты</h2></div>
    <ul class="list-group border-0 rounded-0">[]</ul>
  </div>
  `;
  let li = '';
  form.posts.forEach((post) => {
    li += `
    <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
      <a href="${post.link}" class="${form.viewedPosts.includes(post.id) ? 'fw-normal' : 'fw-bold'}" data-id="${post.id}" target="_blank" 
        rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="btn btn-outline-primary btn-sm" data-id="${post.id}"
              data-bs-toggle="modal" data-bs-target="#modal">${t('ui.btnView')}
      </button>
    </li>
    `;
  });
  postHtml = postHtml.replace('[]', li);
  elements.posts.innerHTML = postHtml;
};

const initView = (state, elements, t) => {
  const mapping = {
    'form.status': () => renderForm(state.form, elements),
    'form.error': () => renderRequestErrors(state.form, elements),
    'form.fields.url': () => renderFormErrors(state.form, elements),
    'form.posts': () => renderPosts(state.form, elements, t),
    'form.viewedPosts': () => renderPosts(state.form, elements, t),
    'form.feeds': () => renderFeeds(state.form, elements),
  };
  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });

  return watchedState;
};

export default initView;
