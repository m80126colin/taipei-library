import _ from 'lodash';

const timeIdf = o => o.type === 'time'

const timeProc = o => {
  const [ hour, minute ] = _.chain(o.data).split(':').map(str => parseInt(str)).value()
  return {
    hour: hour < 8 ? hour + 12 : hour,
    minute
  }
}

const extracter = (title, remains, cycle) => {
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
  const time_def = _.chain(remains)
    .filter(timeIdf)
    .map(timeProc)
    .value()
  if (time_def.length === 0)
    return {}
  if (time_def.length === 1)
    return { start: _.head(time_def) }
  if (time_def.length === 2) {
    const fst = _.head(time_def)
    const snd = _.last(time_def)
    if (fst.hour * 60 + fst.minute < snd.hour * 60 + snd.minute)
      return { start: fst, end: snd }
    return { start: fst }
  }
  return { start: _.head(time_def) }
}

export default {
  extracter
}