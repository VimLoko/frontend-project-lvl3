import { v4 as uuidv4 } from 'uuid';

export default (xml, t) => {
  const domParser = new DOMParser();
  const xmlParser = domParser.parseFromString(xml, 'application/xml');
  const errorXML = xmlParser.querySelector('parsererror');
  if (errorXML) {
    throw new Error(t('errors.parsingError'));
  }
  const feed = {
    link: xmlParser.querySelector('link').textContent.trim(),
    title: xmlParser.querySelector('title').textContent.trim(),
    description: xmlParser.querySelector('description').textContent.trim(),
  };
  const itemsXML = [...xmlParser.querySelectorAll('item')];

  const posts = itemsXML.map((item) => ({
    id: uuidv4(),
    title: item.querySelector('title').textContent.trim(),
    link: item.querySelector('link').textContent.trim(),
    description: item.querySelector('description').textContent.trim(),
    pubDate: item.querySelector('pubDate').textContent.trim(),
  }));
  return { feed, posts };
};
