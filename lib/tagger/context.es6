import _ from 'lodash';

const config = [
  {
    pattern: '播映影片\|播映場次\|活動內容\|場次資訊\|播出片名\|場次：\|片名：\|電影名稱\|影片名稱',
    fn: () => {
      return {
        data: '場次',
        type: 'context'
      }
    }
  },
  {
    pattern: '活動地點\|主辦單位\|承辦館別',
    fn: () => {
      return {
        data: '地點',
        type: 'context'
      }
    }
  },
  {
    pattern: '活動時間\|播映時間\|播映日期',
    fn: () => {
      return {
        data: '時間',
        type: 'context'
      }
    }
  },
  {
    pattern: '地址',
    fn: () => {
      return {
        data: '地址',
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