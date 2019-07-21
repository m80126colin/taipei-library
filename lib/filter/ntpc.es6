import _       from 'lodash';
import axios   from 'axios';
import cheerio from 'cheerio';
import Parser  from 'rss-parser';

const link = 'http://www.library.ntpc.gov.tw/MainPortal/htmlcnt/rss/ActvInfo'
const parser = new Parser()

const list = async data => {
  const feed = await parser.parseString(data)
  const rows = _.chain(feed.items)
    .map(item => {
      const id = item.link.match(/\/([^/]+)$/u)[1]
      return {
        link: item.link,
        collect: {
          id: `ntpc-${id}`,
          timestamp: (new Date(item.isoDate)).valueOf(),
          link: { type: 'ntpc', id },
          title:  item.title,
          author: item.author
        }
      }
    })
    .filter(obj => /電影/u.test(obj.collect.title))
    .value()
  return rows
}

const filter = async row => {
  const { data : site } = await axios.get(row.link)
  const $ = cheerio.load(site)
  const content = $('.article-content p').text()
  const article = _.merge(row.collect, { content })
  return article
}

export default {
  tag: 'ntpc',
  link,
  list,
  filter
}