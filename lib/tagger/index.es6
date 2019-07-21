import _ from 'lodash';

import level   from './level';
import context from './context';
import movtime from './movtime';
import movdate from './movdate';
import movlen  from './movlen';

const list = _.chain([
  context, level, movdate, movtime, movlen
])
.flatMap(rules => rules.tagger)
.value()

const tagger = text => _.chain(list)
  .flatMap(({ pattern, fn }) => {
    const infos = []
    const regex = new RegExp(pattern, 'ug')
    text.replace(regex, (...args) => {
      const len    = args.length
      const match  = args[0]
      const ps     = _.slice(args, 1, len - 2)
      const index = args[len - 2]
      const result = _.chain({ data: match })
        .merge(fn([ match, ...ps ]))
        .merge({ index })
        .value()
      infos.push(result)
      return match
    })
    return infos
  })
  .sortBy('index')
  .value()

export default tagger