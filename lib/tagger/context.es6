import _ from 'lodash';

const config = [
  {
    pattern: '播映影片\|活動內容\|場次資訊\|播映場次',
    fn: () => {
      return {
        data: '場次',
        type: 'context'
      }
    }
  },
  {
    pattern: '活動地點\|主辦單位',
    fn: () => {
      return {
        data: '地點',
        type: 'context'
      }
    }
  },
  {
    pattern: '活動時間\|播映時間',
    fn: () => {
      return {
        data: '時間',
        type: 'context'
      }
    }
  },
  {
    pattern: '上午\|下午\|晚上',
    fn: entry => {
      return {
        data: _.head(entry),
        type: 'context'
      }
    }
  }
]

export default {
  tagger: config
}