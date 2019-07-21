import fs from 'fs';
import util from 'util';

import filter from './filter';

const write = util.promisify(fs.writeFile)

const articleList = async () => {
  const articles = await filter()
  await write(`${__dirname}/data/articles.json`, JSON.stringify(articles), 'utf-8')
}
articleList()