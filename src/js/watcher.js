import onChange from 'on-change';

const renderError = (input, button, feedback) => {
  input.readOnly = false;
  button.disabled = false;
  feedback.classList.add('text-danger');
  feedback.classList.remove('text-success');
};

const renderForm = (form, input, button, feedback, i18next) => {
  form.reset();
  input.focus();
  input.readOnly = false;
  input.classList.remove('border-danger', 'is-invalid');
  button.disabled = false;
  feedback.textContent = i18next.t('rssSuccessLoad');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
};

const renderFeeds = (feeds, state, i18next) => {
  feeds.innerHTML = '';
  const feedTitle = document.createElement('h2');
  feedTitle.textContent = i18next.t('feeds');
  feedTitle.classList.add('mb-4');
  feeds.append(feedTitle);
  const container = document.createElement('div');
  feeds.append(container);
  state.feeds.forEach((feed) => {
    const card = document.createElement('div');
    card.classList.add('card-body', 'mb-3');
    const title = document.createElement('h3');
    title.textContent = feed.title;
    title.classList.add('card-title', 'h6');
    card.append(title);
    const description = document.createElement('p');
    description.textContent = feed.description;
    description.classList.add('card-text', 'small', 'text-black-50');
    card.append(description);
    container.prepend(card);
  });
};

const renderPosts = (posts, state, i18next) => {
  posts.innerHTML = '';
  const postsTitle = document.createElement('h2');
  postsTitle.textContent = i18next.t('posts');
  postsTitle.classList.add('mb-4');
  posts.append(postsTitle);
  const container = document.createElement('div');
  posts.append(container);
  state.posts.forEach((post) => {
    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    container.prepend(ul);
    const li = document.createElement('li');
    li.classList.add(
      'list-group-item',
      'border-0',
      'rounded-0',
      'mb-2',
      'd-flex',
      'justify-content-between',
      'align-items-start',
    );
    const link = document.createElement('a');
    link.classList.add('fw-bold');
    link.textContent = post.title;
    link.setAttribute('href', post.link);
    link.setAttribute('target', '_blank');
    li.append(link);
    const btn = document.createElement('button');
    btn.textContent = i18next.t('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.setAttribute('data-bs-id', post.id);
    li.append(btn);
    ul.append(li);
  });
};

const renderActiveLink = (state, posts) => {
  state.posts.forEach((post) => {
    if (post.visited === true) {
      const activeElement = posts.querySelector(`a[href="${post.link}"]`);
      activeElement.classList.remove('fw-bold');
      activeElement.classList.add('fw-normal', 'text-secondary');
    }
  });
};

const renderModal = (state, elements) => {
  const activePost = state.posts.find((post) => post.modal);
  if (activePost) {
    elements.modalTitle.textContent = activePost.title;
    elements.modalBody.textContent = activePost.description;
    elements.modalLink.setAttribute('href', activePost.link);
  }
};

export default (state, elements, i18next) => onChange(state, (path, value) => {
  const {
    form, input, feedback, button, feeds, posts,
  } = elements;
  if (path === 'processState') {
    switch (value) {
      case 'initial':
        break;
      case 'loading':
        input.readOnly = true;
        button.disabled = true;
        feedback.textContent = '';
        break;
      case 'load':
        renderForm(form, input, button, feedback, i18next);
        renderFeeds(feeds, state, i18next);
        renderPosts(posts, state, i18next);
        break;
      case 'upgradePosts':
        renderPosts(posts, state, i18next);
        renderActiveLink(state, posts);
        renderModal(state, elements);
        break;
      case 'validationError':
        input.classList.add('border-danger', 'is-invalid');
        feedback.textContent = state.form.validationError;
        renderError(input, button, feedback);
        break;
      case 'networkOrParsingError':
        input.value = state.form.currentUrl;
        feedback.textContent = state.error;
        renderError(input, button, feedback);
        break;
      default:
        throw new Error(`no such process state ${value}`);
    }
  }
});
