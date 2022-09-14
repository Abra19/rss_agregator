import * as yup from 'yup';

import loader from './loader.js';

export default (fields, state, i18next) => {
  yup.setLocale({
    mixed: {
      required: i18next.t('errors.emptyField'),
      notOneOf: i18next.t('errors.existingUrl'),
    },
    string: {
      url: () => i18next.t('errors.invalidUrl'),
    },
  });
  const schema = yup.object().shape({
    url: yup.string().url().required().notOneOf(state.form.urlsAdded),
  });
  schema.validate(fields)
    .then((data) => {
      state.form.currentUrl = data.url;
      state.form.urlsAdded = [...state.form.urlsAdded, data.url];
      state.processState = 'loading';
      loader(state, i18next);
    }).catch((err) => {
      state.form.validationError = err.message;
      state.processState = 'validationError';
    });
};
