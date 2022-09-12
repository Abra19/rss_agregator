import * as yup from 'yup';

export default (fields, state, i18next) => {
  yup.setLocale({
    mixed: {
      notOneOf: i18next.t('errors.existingUrl'),
    },
    string: {
      url: i18next.t('errors.invalidUrl'),
    },
  });
  const schema = yup.object().shape({
    url: yup.string()
      .url()
      .notOneOf(state.form.urlsAdded),
  });
  schema.validate(fields)
    .then((data) => {
      state.form.urlIsValid = true;
      state.form.currentUrl = data;
      state.form.urlsAdded = [...state.form.urlsAdded, data.url];
    }).catch((err) => {
      state.form.urlIsValid = false;
      console.log(err.message);
      state.form.validationError = err.message;
    });
};
