import { differenceBy } from 'lodash';
import requester from './requester';
import parser from './parser';

const checker = (watched) => {
  // http://lorem-rss.herokuapp.com/feed?unit=second&interval=30
  const id = setTimeout(() => {
    const requests = watched.form.feeds.map((feed) => requester.get(`${feed.url}`));
    Promise.all(requests)
      .then((responses) => Promise.all(responses.map((response) => response.data.contents)))
      .then((xmls) => xmls.forEach((xml) => {
        const { posts } = parser(xml);
        const difference = differenceBy(posts, watched.form.posts, 'id');
        if (difference.length > 0) {
          watched.form.posts.unshift(...difference);
        }
        console.log(watched.form.posts);
      }))
      .catch(() => {
        clearTimeout(id);
      });
    checker(watched);
  }, 5000, watched);
};

export default checker;
