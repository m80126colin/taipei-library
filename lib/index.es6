import _ from 'lodash';
import fs from 'fs';
import util from 'util';

import tagger    from './tagger';
import extracter from './extracter';

import library from './library';

import rows from './data/articles.json';

const write = util.promisify(fs.writeFile)

const articleExtract = async () => {
  const result = _.map(rows, row => {
    const show = extracter(tagger(row.title), tagger(row.content))
    return _.chain(row)
      .pick(['id', 'link'])
      .merge({ show })
      .value()
  })
  const noshow = _.chain(result)
    .filter(s => s.show.length === 0)
    .map(s => library.link(s.link.type, s.link.id))
    .value()
  await write(`${__dirname}/data/show.json`, JSON.stringify(result), 'utf8')
}
articleExtract()