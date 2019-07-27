import _ from 'lodash';

import tpml from './tpml';
import ntpc from './ntpc';

class Library {
  constructor() {
    this.$pool = {}
  }
  $select(type) {
    return this.$pool[type]
  }
  register(lib) {
    this.$pool[lib.type] = lib
  }
  list() {
    return _.map(this.$pool, x => x)
  }
  label(type) {
    return this.$select(type).label
  }
  link(type, id) {
    return this.$select(type).link(id)
  }
  unlink(type, str) {
    return this.$select(type).unlink(str)
  }
  branchAll() {
    return _.chain(this.$pool)
      .flatMap(lib => _.map(lib.branch, branch => {
        return { type: lib.type, branch }
      }))
      .groupBy('branch')
      .value()
  }
}

const library = new Library()

library.register(tpml)
library.register(ntpc)

export default library