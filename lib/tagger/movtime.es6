const config = [
  {
    pattern: '(\\d{1,2})[:：](\\d{1,2})',
    fn: entry => {
      return {
        data: `${entry[1]}:${entry[2]}`,
        type: 'time'
      }
    }
  },
  {
    pattern: '(\\d{1,2})[時點](?:(\\d{1,2})分)?',
    fn: entry => {
      const minute = entry[1] ? entry[1] : '00'
      return {
        data: `${entry[1]}:${minute}`,
        type: 'time'
      }
    }
  }
]

export default {
  tagger: config
}