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
    processState: 'initial', // loading, load, validationError, networkOrParsingError
    error: '', // network or parsing errors
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const i18nInstance = i18next.createInstance();

  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    const watchedState = watcher(state, elements, i18nInstance);
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      watchedState.processState = 'initial';
      validate({ url }, watchedState, i18nInstance);
    });
  });
};
