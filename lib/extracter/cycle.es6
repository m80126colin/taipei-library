import _ from 'lodash';

const extracter = tag => {
  const lookup = _.chain(tag.info)
    .map(t => t.type)
    .sort()
    .sortedUniq()
    .map((type, idx) => [type, idx])
    .fromPairs()
    .value()
  const text = _.chain(tag.info)
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
  const { pattern } = _.chain(_.range(2, 6))
    .flatMap(len => _.chain(_.range(0, text.length - len))
      .map(start => text.substr(start, len))
      .filter(segment => timeOrDate.test(segment))
      .value())
    .sort()
    .sortedUniq()
    .map(pattern => {
      const regex  = new RegExp(pattern, 'ug')
      const result = text.match(regex)
      if (result)
        return {
          pattern,
          total: pattern.length * result.length
        }
      return undefined
    })
    .compact()
    .maxBy(o => o.total)
    .value()
  const result = []
  const regex = new RegExp(pattern, 'ug')
  text.replace(regex, (match, index) => {
    const group = _.slice(tag.info, index, index + pattern.length)
    result.push(group)
    return match
  })
  return result
}

export default {
  extracter
}