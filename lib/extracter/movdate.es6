import _ from 'lodash';

const dateIdf = o => o.type === 'date'

const extracter = (title, remains, cycle) => {
  const date = _.chain(cycle)
    .filter(dateIdf)
    .filter(o => {
      const lookup = _.chain(o.data)
        .split('-')
        .countBy(str => parseInt(str) > 0)
        .value()
      return lookup[true] > 1
    })
    .value()
  if (date.length >= 1) {
    const [ year, month, day ] = _.chain(_.head(date).data).split('-').map(str => parseInt(str)).value()
    return {
      year: 2019,
      month,
      day
    }
  }
  return {}
}

export default {
  extracter
}