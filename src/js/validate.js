import * as yup from 'yup';

export default (url, state, i18next) => {
  const schema = yup.string().url(i18next.t('errors.invalidUrl')).required().notOneOf(state.form.urlsAdded);
  const promise = schema.validate(url)
    .then(() => {
      state.processState = 'loading';
    });
  return promise;
};
