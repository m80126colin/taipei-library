import _ from 'lodash';

import cycle from './cycle';

const extracter = (title, content) => {
  console.log(title, content)
  const q = cycle.extracter(content)
  console.log('cycle', q)
}

export default extracter