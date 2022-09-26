import axios from 'axios';
import { uniqueId } from 'lodash';

import parser from './parser.js';
import getProxyUrl from './proxyGetter.js';

export default (url, state) => {
  state.processState = 'loading';
  const proxyUrl = getProxyUrl(url);
  const promise = axios.get(proxyUrl)
    .then((response) => {
      const content = parser(response.data.contents);
      state.form.urlsAdded = [...state.form.urlsAdded, url];
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
    });
  return promise;
};
