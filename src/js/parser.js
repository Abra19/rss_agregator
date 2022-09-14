export default (responseString) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(responseString, 'text/xml');

  if (content.querySelector('parsererror')) {
    throw new Error('parseError');
  }

  return content;
};
