import * as yup from 'yup';

export default (fields, state, i18n) => {
  const schema = yup.object().shape({
    url: yup.string()
      .url(i18n.t('errors.invalidUrl'))
      .required(i18n.t('errors.emptyField'))
      .notOneOf(state.form.urlsAdded, i18n.t('errors.existingUrl')),
  });
  schema.validate(fields)
    .then((data) => {
      state.form.urlIsValid = true;
      state.form.currentUrl = data;
      state.form.urlsAdded = [...state.form.urlsAdded, data.url];
    }).catch((err) => {
      state.form.urlIsValid = false;
      state.form.validationError = err.message;
    });
};
