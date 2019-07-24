import _ from 'lodash';

const extracter = tag => {
  const lookup = _.chain(tag.info)
    .map(t => t.type)
    .sort()
    .sortedUniq()
    .map((type, idx) => [type, idx])
    .fromPairs()
    .value()
  const idxShowContext = -1// _.findIndex(tag.info, t => t.type === 'context' && t.data === '場次')
  const text = _.chain(tag.info)
    .drop(idxShowContext + 1)
    .map(t => lookup[t.type])
    .join('')
    .value()
  const timeOrDatePat = _.chain(['time', 'date'])
    .map(str => lookup[str])
    .join('')
    .value()
  const timeOrDate = new RegExp(`[${timeOrDatePat}]`, 'u')
  if (text.length < 2 || !timeOrDate.test(text))
    return []
  const cycler = _.chain(_.range(2, 8))
    .flatMap(len => _.chain(_.range(0, text.length - len))
      .map(start => text.substr(start, len))
      .filter(segment => timeOrDate.test(segment))/*
      .filter(segment => {
        const regex = new RegExp(lookup['date'], 'ug')
        const match = segment.match(regex)
        return _.isNull(match) || match.length === 1
      })*/
      .value())
    .sort()
    .sortedUniq()
    .map(pattern => {
      const regex  = new RegExp(pattern, 'ug')
      const result = text.match(regex)
      if (result && result.length > 1)
        return {
          pattern,
          total: pattern.length * result.length
        }
      return undefined
    })
    .compact()
    .value()
  if (cycler.length === 0) {
    return []
  }
  const { pattern } = _.maxBy(cycler, o => o.total)
  const result = []
  const regex = new RegExp(pattern, 'ug')
  text.replace(regex, (match, index) => {
    const offset = idxShowContext + 1
    const group = _.slice(tag.info, index + offset, index + offset + pattern.length)
    result.push(group)
    return match
  })
  return result
}

export default {
  extracter
}