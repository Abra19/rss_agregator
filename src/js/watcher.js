import onChange from 'on-change';

export default (state, elements) => onChange(state, (path, value) => {
  if (path === 'form.currentUrl') {
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.feedback.textContent = 'RSS успешно загружен';

    elements.input.classList.remove('border-danger', 'is-invalid');
    elements.form.reset();
    elements.input.focus();
  }

  if (path === 'form.validationError') {
    elements.feedback.textContent = value;
    elements.feedback.classList.add('text-danger');
    elements.feedback.classList.remove('text-success');
    elements.input.classList.add('border-danger', 'is-invalid');
  }
});
