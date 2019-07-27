import _ from 'lodash';

const emitter = (text, cycle) => console.log({ text }, cycle)

const finger = {
  date:    'D',
  time:    'T',
  level:   'L',
  context: 'C',
  length:  'H',
  place:   'P'
}

const sub = (text, cycle, start, end) => text.substr(cycle[start].index - cycle[0].index, cycle[end].index - cycle[start].index)

const nullity = () => ''

_.mixin({
  clearNL(str) {
    return _.replace(str, /[\t\n]/umg, ' ')
  },
  clearDate(str) {
    return _.chain(str)
      .replace(/(\d+\s*年\s*)?\d+\s*月\s*\d+\s*日[：:]?/u, '00/00 ')
      .replace(/\d+\s*\/\s*\d+/u, ' ')
      .value()
  },
  clearTime(str) {
    return _.replace(str, /\d+\s*[:：]\s*\d+/u, ' ')
  },
  clearBraketPair(str) {
    return _.replace(str, /[(（【][^】）)]*[】）)][：:]?/umg, '    ')
  },
  clearBraket(str) {
    return _.replace(str, /[(（【】）)]+/ug, ' ')
  }
})

const config = [
  [
    'DL', (text, cycle) => {
      const title = _.chain(text)
        .clearDate()
        .clearNL()
        .clearBraketPair()
        .clearBraket()
        .trim()
        .value()
      return title
    }
  ],
  [
    'DLH', (text, cycle) => {
      const str   = sub(text, cycle, 0, 1)
      const title = _.chain(str)
        .clearDate()
        .clearNL()
        .replace(/\([^(（【】）)]*$/, ' ')
        .clearBraketPair()
        .clearBraket()
        .replace(/[＊*✽◎]+/ug, ' ')
        .trim()
        .value()
      return title
    }
  ],
  [
    'DTLH', (text, cycle) => {
      const str = sub(text, cycle, 1, 2)
      const t   = _.split(str, '/')
      if (t.length === 2) {
        const title = _.trim(t[1])
        return title
      }
      const title = _.split(str, '起')[1]
      return title
    }
  ],
  [
    'DHL', (text, cycle) => {
      const str   = sub(text, cycle, 0, 1)
      const title = _.chain(str)
        .clearNL()
        .clearBraketPair()
        .clearDate()
        .replace(/(，片長|\S+，)$/u, ' ')
        .trim()
        .value()
      return title
    }
  ],
  [
    'DTCLH', (text, cycle) => {
      const str = sub(text, cycle, 2, 3)
      const title = _.chain(str)
        .replace(/^[^：:]*[：:]/u, ' ')
        .clearBraket()
        .trim()
        .value()
      return title
    }
  ],
  [
    'DTTLH', (text, cycle) => {
      const str = sub(text, cycle, 2, 3)
      const title = _.chain(str)
        .clearNL()
        .clearTime()
        .split('/')
        .last()
        .clearBraket()
        .trim()
        .value()
      return title
    }
  ],
  [
    'DCTCLH', (text, cycle) => {
      const str = sub(text, cycle, 3, 4)
      const title = _.chain(str)
        .clearNL()
        .replace(/^[^：:]*[：:]/u, ' ')
        .clearBraket()
        .trim()
        .value()
      return title
    }
  ],
  [
    'DLHCDTP', (text, cycle) => {
      const str = sub(text, cycle, 0, 1)
      const title = _.chain(str)
        .clearNL()
        .replace(/^[^：:]*[：:]/u, ' ')
        .clearBraket()
        .trim()
        .value()
      return title
    }
  ],
  [
    'DCTLH', (text, cycle) => {
      const str = sub(text, cycle, 2, 3)
      const title = _.chain(str)
        .clearNL()
        .clearTime()
        .clearBraket()
        .replace(/~/ug, ' ')
        .trim()
        .value()
      return title
    }
  ],
  [
    'DLHDL', (text, cycle) => {
      const str = sub(text, cycle, 0, 1)
      const title = _.chain(str)
        .clearNL()
        .clearBraketPair()
        .clearDate()
        .clearBraket()
        .replace(/＊/ug, ' ')
        .trim()
        .value()
      return title
    }
  ],
  [
    'DDDLHDL', (text, cycle) => {
      const str = sub(text, cycle, 2, 3)
      const title = _.chain(str)
        .clearNL()
        .clearDate()
        .clearBraketPair()
        .replace(/\*/ug, ' ')
        .trim()
        .value()
      return title
    }
  ],
  [
    'TDLH', (text, cycle) => {
      const str = sub(text, cycle, 1, 2)
      const title = _.chain(str)
        .clearDate()
        .clearBraketPair()
        .split('/')
        .head()
        .trim()
        .value()
      return title
    }
  ]
  /*[ 'PDC',     nullity ],
  [ 'PDCP',    nullity ],
  [ 'DCTTCP',  nullity ],
  [ 'DCTTPC',  nullity ],
  [ 'PTPTPCT', nullity ],
  [ 'CPDTPDT', nullity ],
  [ 'CDDCTCP', nullity ]*/
]

const lookup = _.fromPairs(config)

const extracter = (text, cycle) => {
  const print = _.chain(cycle)
    .map(c => finger[c.type])
    .join('')
    .value()
  const fn = lookup[print]
  if (fn) {
    const title = fn(text, cycle)
    // console.log({ title })
    return title
  }
  // emitter(text, cycle)
  return ''
}

export default {
  extracter
}