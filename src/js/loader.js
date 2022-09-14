import axios from 'axios';
import { uniqueId } from 'lodash';

import parser from './parser.js';

const getProxyUrl = (stateUrl) => {
  const proxyUrl = new URL('https://allorigins.hexlet.app');
  proxyUrl.pathname = '/get';
  proxyUrl.searchParams.set('disableCache', true);
  proxyUrl.searchParams.set('url', stateUrl);
  return proxyUrl.toString();
};

const getFeed = (content) => {
  const feed = {};
  feed.id = uniqueId();
  feed.title = content.querySelector('channel > title').textContent;
  feed.description = content.querySelector('channel > description').textContent;
  return feed;
};

const getPosts = (content) => {
  const items = content.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const result = {};
    result.id = uniqueId();
    result.title = item.querySelector('title').textContent;
    result.link = item.querySelector('link').textContent;
    result.description = item.querySelector('description').textContent;
    return result;
  });
  return posts;
};

export default (state, i18next) => {
  const proxyUrl = getProxyUrl(state.form.currentUrl);
  axios.get(proxyUrl)
    .then((response) => {
      const content = parser(response.data.contents, i18next, state);
      const newFeed = getFeed(content);
      state.feeds = [...state.feeds, newFeed];
      state.posts = [...state.posts, ...getPosts(content)];
      state.posts.forEach((post) => {
        post.feedId = newFeed.id;
      });
      state.processState = 'load';
    }).catch((err) => {
      state.error = err.message === 'parseError'
        ? i18next.t('errors.parseError') : i18next.t('errors.networkError');
      state.processState = 'networkOrParsingError';
      state.form.urlsAdded.splice(state.form.currentUrl.indexOf(), 1);
    });
};
