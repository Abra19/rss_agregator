import axios from 'axios';

import parser from './parser.js';
import getProxyUrl from './proxyGetter.js';

const updatePosts = (state, i18next, delay) => {
  state.processState = 'initial';
  const promises = state.form.urlsAdded.map((url) => axios.get(getProxyUrl(url))
    .then((response) => {
      const content = parser(response.data.contents);
      const { feed, posts } = content;
      const feedId = state.feeds.find((item) => feed.title === item.title);
      const newPosts = posts
        .filter((post) => !state.posts.find((item) => item.link === post.link));
      newPosts.forEach((post) => {
        post.feedId = feedId;
      });
      state.posts = [...state.posts, ...newPosts];
      state.processState = 'upgradePosts';
    }).catch(() => {
      state.error = i18next.t('errors.unknownError');
      state.processState = 'networkOrParsingError';
    }));

  Promise.allSettled(promises)
    .then(() => setTimeout(() => updatePosts(state, i18next, delay), delay));
};

export default updatePosts;
