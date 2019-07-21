const movlen = {
  pattern: '(\\d+)分(?!機)鐘?',
  fn: entry => {
    return {
      data: parseInt(entry[1]),
      type: 'length'
    }
  }
}

export default {
  tagger: [ movlen ]
}