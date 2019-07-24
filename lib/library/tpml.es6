import _       from 'lodash';
import axios   from 'axios';
import cheerio from 'cheerio';

const convertToDate = str => {
  const pat = /(\d{2,3})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})/u
  const [ x, year, month, date, hour, minute ] = str.match(pat)
  return new Date(parseInt(year) + 1911, month - 1, date, hour, minute)
}

const type = 'tpml'

const link   = id => `https://tpml.gov.taipei/News_Content.aspx?n=F969DE2A717178AE&s=${id}`
const unlink = str => {
  const id = str.match(/&s=(.+)$/)[1]
  return id
}

const parserList = async () => {
  const root = 'https://tpml.gov.taipei/OpenData.aspx?SN=367B81F509D6C2CA'
  const { data : rootData } = await axios.get(root)
  const middle = _.chain(rootData)
    .replace(/\uFEFF|\uFFFE|\r\n */ug, '')
    .replace(/&nbsp;/ug, '\\n')
    .value()
  const rows = JSON.parse(middle)
  return rows
}
const parserRow  = async row => {
  const { data : site } = await axios.get(row.Source)
  const $    = cheerio.load(site)
  const date = $($('.bottom-detail span')[2]).text()
  const id   = unlink(row.Source)
  const article = {
    id: `${type}-${id}`,
    timestamp: convertToDate(date).valueOf(),
    link: { type, id },
    title:   row.title,
    author:  row['發布單位'],
    content: row['內容']
  }
  return article
}

const branch = [
  '松山分館', '民生分館', '三民分館', '中崙分館', '啟明分館',
  '永春分館', '三興分館', '六合分館', '總館', '道藩分館',
  '大安分館', '延吉民眾閱覽室', '成功民眾閱覽室', '龍安民眾閱覽室', '中山分館',
  '長安分館', '大直分館', '恆安民眾閱覽室', '王貫英先生紀念圖書館', '城中分館',
  '南機場借還書工作站', '延平分館', '大同分館', '建成分館', '蘭州民眾閱覽室',
  '龍山分館', '東園分館', '西園分館', '萬華分館', '柳鄉民眾閱覽室',
  '景美分館', '木柵分館', '永建分館', '萬興分館', '文山分館',
  '力行分館', '景新分館', '安康民眾閱覽室', '萬芳民眾閱覽室', '公訓圖書站',
  '南港分館', '舊莊分館', '親子美育數位圖書館', '龍華民眾閱覽室', '北原會館借還書工作站',
  '內湖分館', '東湖分館', '西湖分館', '西中分館', '葫蘆堵分館',
  '天母分館', '士林分館臨時替代館', '李科永紀念圖書館', '北投分館', '石牌分館',
  '清江分館', '吉利分館', '永明民眾閱覽室', '秀山民眾閱覽室', '陽明借還書工作站'
]

export default {
  label: '臺北市立圖書館',
  type,
  link,
  unlink,
  parser: {
    list: parserList,
    row:  parserRow
  },
  branch
}