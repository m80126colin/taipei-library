import _ from 'lodash';
import axios from 'axios';
import cheerio from 'cheerio';

const link = 'https://tpml.gov.taipei/OpenData.aspx?SN=367B81F509D6C2CA'

const convertToDate = str => {
  const pat = /(\d{2,3})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})/u
  const [ x, year, month, date, hour, minute ] = str.match(pat)
  return new Date(parseInt(year) + 1911, month - 1, date, hour, minute)
}

const list = data => {
  const middle = _.chain(data)
    .replace(/\uFEFF|\uFFFE|\r\n */ug, '')
    .replace(/&nbsp;/ug, '\\n')
    .value()
  const rows = JSON.parse(middle)
  return rows
}

const filter = async row => {
  const { data : site } = await axios.get(row.Source)
  const $    = cheerio.load(site)
  const date = $($('.bottom-detail span')[2]).text()
  const id   = row.Source.match(/&s=(.+)$/)[1]
  const article = {
    id: `tpml-${id}`,
    timestamp: convertToDate(date).valueOf(),
    link: { type: 'tpml', id },
    title:   row.title,
    author:  row['發布單位'],
    content: row['內容']
  }
  return article
}

export default {
  tag: 'tpml',
  link,
  list,
  filter
}