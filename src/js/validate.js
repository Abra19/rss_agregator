import * as yup from 'yup';

export default (fields, state) => {
  const schema = yup.object().shape({
    url: yup.string()
      .url('Ссылка должна быть валидным url!')
      .required('Заполните это поле')
      .notOneOf(state.form.urlsAdded, 'RSS уже существует'),
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
