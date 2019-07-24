import _ from 'lodash';

const timeIdf = o => o.type === 'time'

const timeProc = o => {
  const [ hour, minute ] = _.chain(o.data).split(':').map(str => parseInt(str)).value()
  return {
    hour: hour < 8 ? hour + 12 : hour,
    minute
  }
}

const extracter = (title, content, total, cycle) => {
  const time = _.chain(cycle)
    .filter(timeIdf)
    .map(timeProc)
    .value()
  switch (time.length) {
    case 1:
      return { start: time[0] }
    case 2:
      return { start: time[0], end: time[1] }
    default:
      break;
  }
  const time_def = _.chain(content.info)
    .filter(timeIdf)
    .filter(o => o.index < _.head(cycle).index)
    .filter(o => _.findIndex(total, o) < 0)
    .map(timeProc)
    .value()
  if (time_def.length === 0)
    return {}
  return { start: _.last(time_def) }
}

export default {
  extracter
}