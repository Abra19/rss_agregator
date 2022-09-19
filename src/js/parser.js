const getFeed = (content) => {
  const feed = {};
  feed.title = content.querySelector('channel > title').textContent;
  feed.description = content.querySelector('channel > description').textContent;
  return feed;
};

const getPosts = (content) => {
  const items = content.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const result = {};
    result.title = item.querySelector('title').textContent;
    result.link = item.querySelector('link').textContent;
    result.description = item.querySelector('description').textContent;
    return result;
  });
  return posts;
};

export default (responseString) => {
  const parser = new DOMParser();
  const content = parser.parseFromString(responseString, 'text/xml');

  if (content.querySelector('parsererror')) {
    throw new Error('parseError');
  }

  const feed = getFeed(content);
  const posts = getPosts(content);

  return { feed, posts };
};
