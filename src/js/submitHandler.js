import { ValidationError } from 'yup';

import validate from './validate.js';
import loader from './loader.js';

export default (e, state, i18next) => {
  e.preventDefault();
  state.processState = 'initial';
  const formData = new FormData(e.target);
  const url = formData.get('url');
  validate(url, state, i18next)
    .then(() => loader(url, state))
    .catch((err) => {
      if (err instanceof ValidationError) {
        state.form.validationError = err.errors;
        state.processState = 'validationError';
      } else {
        state.error = err.message === 'parseError'
          ? 'errors.parseError' : 'errors.networkError';
        state.processState = 'networkOrParsingError';
      }
    });
};
