import _ from 'lodash';

import library from '../lib/library';
import posts   from '../lib/data/show.json';

const p = str => _.padStart(str, 2, '0')

const timeGen = ts => {
  if (ts.start) {
    const { hour, minute } = ts.start
    return _.chain([ hour, minute ])
      .map(n => p(n))
      .join(':')
      .value()
  }
  return ''
}

const dateTimeGen = (d, ts) => {
  const date = `${d.year}-${p(d.month)}-${p(d.day)}`
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
    const link  = library.link(post.link.type, post.link.id)
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
        library: library.label(post.link.type),
        level:   levelGen(s.level),
        length:  s.length
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
    s.length ? s.length : ''
  ]
  const row = `<tr><td>${_.join(jun, '</td><td>')}</td></tr>`
  $('#showTable tr:last').after(row)
})