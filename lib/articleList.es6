import _       from 'lodash';
import fs      from 'fs';
import util    from 'util';
import Promise from 'bluebird';

import library from './library';

const write = util.promisify(fs.writeFile)

const postprocess = text => {
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

const fetchArticle = async (item, rows) => {
  console.log(`# of ${item.type} articles:`, rows.length)
  const promise = _.reduce(rows, async (prev, row, idx) => {
    const list = await prev
    console.log('Start processing',  `${item.type}:`, `${idx + 1}/${rows.length}`)
    const article = await item.parser.row(row)
    console.log('Finish processing', `${item.type}:`, `${idx + 1}/${rows.length}`)
    return [...list, article]
  }, Promise.resolve([]))
  return await promise
}

const fetchParser = async () => {
  const promise = _.reduce(library.list(), async (prev, item) => {
    const list = await prev
    console.log(`Start fetch ${item.type} (${item.label}).`)
    const rows     = await item.parser.list()
    const articles = await fetchArticle(item, rows)
    console.log(`Finish fetch ${item.type} (${item.label}).`)
    return [...list, ...articles]
  }, Promise.resolve([]))
  return await promise
}

const articleList = async () => {
  const articles = await fetchParser()
  const result   = _.chain(articles)
    .sortBy(article => -article.timestamp)
    .map(article => _.merge(article, {
      title:   postprocess(article.title),
      content: postprocess(article.content)
    }))
    .value()
  await write(`${__dirname}/data/articles.json`, JSON.stringify(result), 'utf-8')
}
articleList()