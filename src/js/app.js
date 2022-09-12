import i18n from 'i18next';

import resources from './locales/index.js';
import watcher from './watcher.js';
import validate from './validate.js';

export default () => {
  const state = {
    form: {
      urlIsValid: false,
      currentUrl: '',
      urlsAdded: [],
      formState: 'initial', // sending, sent, error
      validationError: null,
    },
    networkError: null, // errorMessages.network.error
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const i18nInstance = i18n.createInstance();
  const watchedState = watcher(state, elements, i18nInstance);

  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources,
  }).then(() => {
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      validate({ url }, watchedState, i18nInstance);

      /*
      if (watchedState.form.urlIsValid) {
        watchedState.currentUrl = '';
        watchedState.form.urlIsValid = 'false';
      }
      //sending
      state.formState = 'sending';
      state.networkError = 'null';
      */
    });
  }).catch((e) => console.log(e));
};
