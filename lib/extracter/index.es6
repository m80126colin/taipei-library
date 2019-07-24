import _ from 'lodash';

import cycle    from './cycle';
import movtitle from './movtitle';
import movplace from './movplace';
import movdate  from './movdate';
import movtime  from './movtime';
import movlevel from './movlevel';

const pair = _.fromPairs([
  ['place', movplace],
  ['date',  movdate],
  ['time',  movtime],
  ['level', movlevel]
])

const extracter = (title, content) => {
  const show = cycle.extracter(content)
  if (show.length < 1)
    return []
  const result = _.chain(show)
    .map(s => {
      const text  = content.text.substring(_.head(s).index, _.last(s).index)
      const movie = movtitle.extracter(text, s)
      if (movie) {
        const res = _.chain(pair)
          .mapValues(fn => fn.extracter(title, content, show, s))
          .merge({ title: movie })
          .value()
        return res
      }
      return undefined
    })
    .compact()
    .value()
  return result
}

export default extracter