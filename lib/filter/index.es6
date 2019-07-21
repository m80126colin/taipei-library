import _       from 'lodash';
import axios   from 'axios';
import Promise from 'bluebird';

import tpml from './tpml';
import ntpc from './ntpc';

const filter = async () => {
  const library = [ tpml, ntpc ]
  const promise = _.reduce(library, async (prev, item) => {
    const list = await prev
    const { data : main } = await axios.get(item.link)
    const rows = await item.list(main)
    console.log(`# of ${item.tag} articles:`, rows.length)
    const promise_lib = _.reduce(rows, async (prev_lib, row, idx) => {
      const list_lib = await prev_lib
      console.log('Start processing',  `${item.tag}:`, `${idx + 1}/${rows.length}`)
      const article  = await item.filter(row)
      console.log('Finish processing', `${item.tag}:`, `${idx + 1}/${rows.length}`)
      return [...list_lib, article]
    }, Promise.resolve([]))
    const articles = await promise_lib
    return [...list, ...articles]
  }, Promise.resolve([]))
  const articles = await promise
  const result = _.sortBy(articles, article => -article.timestamp)
  return result
}

export default filter