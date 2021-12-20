import { differenceBy } from 'lodash';
import requester from './requester';
import parser from './parser';

const checker = (watched, t) => {
  const requests = watched.form.feeds.map((feed) => requester.get(`${feed.url}`));
  Promise.all(requests)
    .then((responses) => Promise.all(responses.map((response) => response.data.contents)))
    .then((xmls) => xmls.forEach((xml) => {
      const { posts } = parser(xml, t);
      const difference = differenceBy(posts, watched.form.posts, 'link');
      if (difference.length > 0) {
        watched.form.posts.unshift(...difference);
      }
    }))
    .catch(() => {
      throw new Error('network');
    })
    .finally(() => {
      setTimeout(() => { checker(watched); }, 15000);
    });
};

export default checker;
