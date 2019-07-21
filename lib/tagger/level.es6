import _ from 'lodash';

const rules = [
  '普遍級', '保護級',
  '輔導級', '限制級'
]

const generator = rule => {
  const fst = rule[0]
  const snd = rule[1]
  const lst = rule[2]
  return {
    pattern: `[（(]${fst}(?:${snd}${lst}?)?[)）]|${fst}${snd}${lst}?`,
    fn: entry => {
      return {
        data: rule,
        type: 'level'
      }
    }
  }
}

export default {
  tagger: _.map(rules, generator)
}