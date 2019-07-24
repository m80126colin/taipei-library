import _ from 'lodash';

const placeIdf = o => o.type === 'place'

const extracter = (title, content, total, cycle) => {
  const place = _.filter(cycle, placeIdf)
  switch (place.length) {
    case 1:
      return _.head(place).data
    case 0:
      break;
    default:
      console.log('More than 1 places:', place, title, content, cycle)
  }
  const place_def = _.chain(content.info)
    .filter(placeIdf)
    .filter(o => _.findIndex(total, o) < 0)
    .concat( _.filter(title.info, placeIdf) )
    .sortBy('data')
    .sortedUniqBy('data')
    .value()
  switch (place_def.length) {
    case 1:
    case 2:
      return _.head(place_def).data
    default:
      console.log('Not 1 or 2 default places', place_def, title, content, cycle)
      break;
  }
  return ''
}

export default {
  extracter
}