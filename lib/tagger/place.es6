import _ from 'lodash';

import lookup from '../data/library';

const pat = _.keys(lookup)

const tagger = [
  {
    pattern:`(${_.join(pat,'\|')})`,
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