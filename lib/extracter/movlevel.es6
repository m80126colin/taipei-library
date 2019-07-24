import _ from 'lodash';

const levelIdf = o => o.type === 'level'

const extracter = (title, content, total, cycle) => {
  const level = _.filter(cycle, levelIdf)
  if (level.length > 0) {
    return _.head(level).data
  }
  console.log('No level.', content)
  return ''
}

export default {
  extracter
}