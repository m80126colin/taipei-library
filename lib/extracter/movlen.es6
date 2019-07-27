import _ from 'lodash';

const extracter = (title, remains, cycle) => {
  const len = _.filter(cycle, o => o.type === 'length')
  if (len.length)
    return _.head(len).data
  return 0
}

export default {
  extracter
}