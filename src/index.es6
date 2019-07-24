import _ from 'lodash';
import posts from '../lib/data/show.json';

const linkGen = ({ type, id }) => {
  switch (type) {
    case 'ntpc':
      return `http://www.library.ntpc.gov.tw:80/MainPortal/htmlcnt/${id}`
    case 'tpml':
      return `https://tpml.gov.taipei/News_Content.aspx?n=F969DE2A717178AE&s=${id}`
  }
}

const libGen = p => {
  switch (p) {
    case 'ntpc':
      return '新北市立圖書館'
    case 'tpml':
      return '臺北市立圖書館'
  }
}

const timeGen = ts => {
  if (ts.start) {
    const { hour, minute } = ts.start
    return _.chain([ hour, minute ])
      .map(n => _.padStart(n, 2, '0'))
      .join(':')
      .value()
  }
  return ''
}

const dateTimeGen = (d, ts) => {
  const date = `${d.year}-${d.month}-${d.day}`
  const time = timeGen(ts)
  return time ? `${date} ${time}` : date
}

const levelGen = level => {
  switch (level) {
    case '普遍級':
      return { text: level, color: 'green' }
    case '保護級':
      return { text: level, color: 'blue' }
    case '限制級':
      return { text: level, color: 'red' }
    default:
      return { text: level, color: 'yellow' }
  }
}

const show = _.chain(posts)
  .flatMap(post => {
    const link  = linkGen(post.link)
    return _.map(post.show, s => {
      const datetime  = dateTimeGen(s.date, s.time)
      const timestamp = (new Date(datetime)).valueOf()
      return {
        link,
        datetime,
        timestamp,
        id:      post.id,
        title:   s.title,
        place:   s.place,
        library: libGen(post.link.type),
        level:   levelGen(s.level),
        length:  s.length || 0
      }
    })
  })
  .sortBy('timestamp')
  .value()

_.map(show, s => {
  const jun = [
    s.datetime,
    s.place,
    `<a href="${s.link}" target="_blank">${s.library}</a>`,
    `<label class="ui ${s.level.color} label">${s.level.text}</label><label class="ui label">自動</label> ${s.title}`,
    ''
  ]
  const row = `<tr><td>${_.join(jun, '</td><td>')}</td></tr>`
  $('#showTable tr:last').after(row)
})