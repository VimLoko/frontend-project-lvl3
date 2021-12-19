import i18next from 'i18next';

export default (xml) => {
  const domParser = new DOMParser();
  const xmlParser = domParser.parseFromString(xml, 'application/xml');
  const errorXML = xmlParser.querySelector('parsererror');
  if (errorXML) {
    throw new Error(i18next.t('errors.parsingError'));
  }
  const feed = {
    id: xmlParser.querySelector('link').textContent.trim(),
    link: xmlParser.querySelector('link').textContent.trim(),
    title: xmlParser.querySelector('title').textContent.trim(),
    description: xmlParser.querySelector('description').textContent.trim(),
  };
  const itemsXML = [...xmlParser.querySelectorAll('item')];

  const posts = itemsXML.map((item) => ({
    id: item.querySelector('link').textContent.trim(),
    feed_id: feed.id,
    title: item.querySelector('title').textContent.trim(),
    link: item.querySelector('link').textContent.trim(),
    description: item.querySelector('description').textContent.trim(),
    pubDate: item.querySelector('pubDate').textContent.trim(),
  }));
  return { feed, posts };
};
