import i18next from 'i18next';

import resources from './locales/index.js';
import watcher from './watcher.js';
import validate from './validate.js';

export default () => {
  const state = {
    form: {
      currentUrl: '',
      urlsAdded: [],
      validationError: '',
    },
    feeds: [],
    posts: [],
    activeLink: '',
    processState: 'initial', // loading, load, upgradePosts, validationError, networkOrParsingError
    error: '', // network or parsing errors
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modalSpace: document.querySelector('#modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
    modalCloseButtons: document.querySelectorAll('[data-bs-dismiss="modal"]'),
  };

  const defaultLanguage = 'ru';
  const i18nInstance = i18next.createInstance();

  i18nInstance.init({
    lng: defaultLanguage,
    debug: true,
    resources,
  }).then(() => {
    const watchedState = watcher(state, elements, i18nInstance);
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.processState = 'initial';
      const formData = new FormData(e.target);
      const url = formData.get('url');
      validate({ url }, watchedState, i18nInstance);
    });
    elements.posts.addEventListener('click', (e) => {
      watchedState.processState = 'initial';
      const activeLink = e.target.href;
      if (activeLink) {
        const linkedPost = watchedState.posts.find((post) => post.link === activeLink);
        linkedPost.visited = true;
        watchedState.processState = 'upgradePosts';
      }
    });
    elements.modalSpace.addEventListener('show.bs.modal', (e) => {
      watchedState.processState = 'initial';
      const relatedButton = e.relatedTarget;
      const id = relatedButton.getAttribute('data-bs-id');
      const activePost = watchedState.posts.find((post) => post.id === id);
      activePost.visited = true;
      activePost.modal = true;
      watchedState.processState = 'upgradePosts';
    });
    elements.modalCloseButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const activePost = watchedState.posts.find((post) => post.modal);
        activePost.modal = false;
      });
    });
  });
};
