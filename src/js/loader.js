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

const loadPosts = (proxyUrl, state, feedId, i18next) => {
  state.processState = 'initial';
  axios.get(proxyUrl)
    .then((response) => {
      const content = parser(response.data.contents);
      const { posts } = content;
      const newPosts = posts.filter((post) => !state.posts.find((item) => item.link === post.link));
      newPosts.forEach((post) => {
        post.feedId = feedId;
      });
      state.posts = [...state.posts, ...newPosts];
      state.processState = 'upgradePosts';
      setTimeout(() => loadPosts(proxyUrl, state, feedId, i18next), 5000);
    }).catch(() => {
      state.error = i18next.t('errors.unknownError');
      state.form.urlsAdded.splice(state.form.currentUrl.indexOf(), 1);
      state.processState = 'networkOrParsingError';
    });
};

const loader = (state, i18next) => {
  const proxyUrl = getProxyUrl(state.form.currentUrl);
  axios.get(proxyUrl)
    .then((response) => {
      const content = parser(response.data.contents);
      const newFeed = content.feed;
      newFeed.id = uniqueId();
      state.feeds = [...state.feeds, newFeed];
      const newPosts = content.posts;
      newPosts.forEach((post) => {
        post.id = uniqueId();
        post.feedId = newFeed.id;
      });
      state.posts = [...state.posts, ...newPosts];
      state.processState = 'load';
      setTimeout(() => loadPosts(proxyUrl, state, newFeed.id), 5000);
    }).catch((err) => {
      state.error = err.message === 'parseError'
        ? i18next.t('errors.parseError') : i18next.t('errors.networkError');
      state.processState = 'networkOrParsingError';
      state.form.urlsAdded.splice(state.form.currentUrl.indexOf(), 1);
    });
};

export default loader;
