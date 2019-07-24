import _       from 'lodash';
import axios   from 'axios';
import Promise from 'bluebird';

import tpml from './tpml';
import ntpc from './ntpc';

const textPreprocess = text => {
  const s = '０１２３４５６７８９'
  return _.chain(s)
    .split('')
    .reduce((chain, ch, idx) => chain.replace(new RegExp(ch, 'ug'), idx), _.chain(text))
    .replace(/／/ug, '/')
    .replace(/\&[lr]squo;/ug, '\'')
    .replace(/\&[lr]dquo;/ug, '"')
    .replace(/\&bull;/ug, '')
    .replace(
      /(?:(\d{2,4})\s*年)?\s*(\d{1,2})\s*月(?:\s*(\d{1,2})\s*日)?/umg,
      (match, year, month, day) => {
        let str = ''
        if (year)  str += `${year}年`
        if (month) str += `${month}月`
        if (day)   str += `${day}日`
        return str
      })
    .value()
}

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
  const result = _.chain(articles)
    .sortBy(article => -article.timestamp)
    .map(article => _.merge(article, {
      title:   textPreprocess(article.title),
      content: textPreprocess(article.content)
    }))
    .value()
  return result
}

export default filter