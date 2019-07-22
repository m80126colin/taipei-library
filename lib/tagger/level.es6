import _ from 'lodash';

const rules = [
  ['普遍級', '普'],
  ['保護級', '保', '護'],
  ['輔12級', '輔12'],
  ['輔15級', '輔15'],
  ['輔導級', '輔'],
  ['限制級', '限']
]

const generator = rule => {
  const fst  = rule[0]
  const pats = _.join(rule, '|')
  return {
    pattern: `[（(]${pats}[)）]|${fst}`,
    fn: entry => {
      return {
        data: fst,
        type: 'level'
      }
    }
  }
}

export default {
  tagger: _.map(rules, generator)
}