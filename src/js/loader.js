import axios from 'axios';
import { uniqueId } from 'lodash';

import parser from './parser.js';
import getProxyUrl from './proxyGetter.js';

export default (state, i18next) => {
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
    }).catch((err) => {
      state.error = err.message === 'parseError'
        ? i18next.t('errors.parseError') : i18next.t('errors.networkError');
      state.processState = 'networkOrParsingError';
      state.form.urlsAdded.splice(state.form.currentUrl.indexOf(), 1);
    });
};
