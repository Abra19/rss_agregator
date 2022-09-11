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

  const watchedState = watcher(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validate({ url }, watchedState);

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
};
