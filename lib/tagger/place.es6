import _ from 'lodash';

import library from '../library';

const branch  = library.branchAll()
const pattern = _.keys(branch)

const tagger = [
  {
    pattern:`(${_.join(pattern,'\|')})`,
    fn: entry => {
      return {
        data: entry[1],
        type: 'place'
      }
    }
  }
]

export default {
  tagger
}