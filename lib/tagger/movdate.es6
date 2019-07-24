import _ from 'lodash';

const formatter = (year, month, date) => {
  const m = _.chain({ year, month, date })
    .mapValues(val => val ? (typeof val === 'string' ? parseInt(val) : val) : 0)
    .mapValues((val, key) => {
      if (key !== 'year' || val >= 1000 || val === 0)
        return val
      return val + 1911
    })
    .value()
  return `${m.year}-${m.month}-${m.date}`
}

const config = [
  {
    pattern: '(?:(\\d{2,4})\s*年)?\s*(\\d{1,2})\s*月(?:\s*(\\d{1,2})\s*日)?',
    fn: entry => {
      const m = _.slice(entry, 1, 1 + 3)
      return {
        data: formatter(...m),
        type: 'date'
      }
    }
  },
  {
    pattern: '(?:(\\d{2,4})[/.])?(\\d{1,2})[/.](\\d{1,2})',
    fn: entry => {
      const m = _.slice(entry, 1, 1 + 3)
      return {
        data: formatter(...m),
        type: 'date'
      }
    }
  }
]

export default {
  tagger: config
}