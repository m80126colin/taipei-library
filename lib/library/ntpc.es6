import _       from 'lodash';
import axios   from 'axios';
import cheerio from 'cheerio';
import Parser  from 'rss-parser';

const rss = new Parser()

const type = 'ntpc'

const link   = id  => `https://tpml.gov.taipei/News_Content.aspx?n=F969DE2A717178AE&s=${id}`
const unlink = str => {
  const id = str.match(/\/([^/]+)$/u)[1]
  return id
}

const parserList = async () => {
  const root = 'http://www.library.ntpc.gov.tw/MainPortal/htmlcnt/rss/ActvInfo'
  const { data : rootData } = await axios.get(root)
  const feed = await rss.parseString(rootData)
  const rows = _.chain(feed.items)
    .map(item => {
      const id = unlink(item.link)
      return {
        link: item.link,
        collect: {
          id: `${type}-${id}`,
          timestamp: (new Date(item.isoDate)).valueOf(),
          link: { type, id },
          title:  item.title,
          author: item.author
        }
      }
    })
    .filter(obj => /電影/u.test(obj.collect.title))
    .value()
  return rows
}
const parserRow = async row => {
  const { data : site } = await axios.get(row.link)
  const $ = cheerio.load(site)
  const content = $('.article-content p').text()
  const article = _.merge(row.collect, { content })
  return article
}

const branch = [
  '八里分館', '三芝分館', '三重五常分館', '三重田中分館', '三重崇德分館',
  '三重分館', '三重東區分館', '三重南區分館', '三重培德分館', '三峽分館',
  '三峽北大分館', '土城柑林埤圖書閱覽室', '土城祖田圖書閱覽室', '土城清水圖書閱覽室', '土城分館',
  '土城親子分館', '中和大同圖書閱覽室', '中和分館', '中和員山分館', '五股成州圖書閱覽室',
  '五股分館', '五股水碓分館', '五股更新圖書閱覽室', '五股成功分館', '平溪分館',
  '永和民權分館', '永和忠孝圖書閱覽室', '永和分館', '永和親子圖書閱覽室', '永和保生分館',
  '石門分館', '石碇分館', '汐止大同分館', '汐止北峰圖書閱覽室', '汐止江北分館',
  '汐止分館', '汐止長安分館', '汐止茄苳分館', '汐止橫科圖書閱覽室', '坪林分館',
  '林口分館', '林口東勢閱覽室', '總館', '板橋江子翠分館', '板橋分館',
  '板橋四維分館', '板橋民生圖書閱覽室', '板橋忠孝分館', '板橋浮洲圖書閱覽室', '板橋國光圖書閱覽室',
  '板橋溪北分館', '板橋萬板親子圖書閱覽室', '板橋智慧圖書館', '金山分館', '泰山貴子分館',
  '泰山分館', '泰山親子圖書閱覽室', '烏來分館', '貢寮分館', '淡水水碓分館',
  '淡水竹圍分館', '淡水分館', '深坑分館', '新店分館', '新店寶興圖書閱覽室',
  '新店北新圖書閱覽室', '新店中央圖書閱覽室', '新店碧潭圖書閱覽室', '新店百忍圖書閱覽室', '新店福民閱覽室',
  '新店中正閱覽室', '新店仁愛圖書閱覽室', '新店柴埕圖書閱覽室', '新店大鵬圖書閱覽室', '新店龜山圖書閱覽室',
  '新店三民圖書閱覽室', '新北市青少年圖書館', '新店文史館', '新莊中港分館', '新莊福營分館',
  '新莊分館', '新莊西盛分館', '新莊聯合分館', '新莊裕民分館', '新莊頭前智慧圖書館',
  '瑞芳分館', '瑞芳東和圖書閱覽室', '萬里分館', '樹林分館', '樹林柑園圖書閱覽室',
  '樹林三多圖書閱覽室', '樹林大安圖書閱覽室', '樹林樂山圖書閱覽室', '樹林彭厝圖書閱覽室', '樹林區自動借還書機',
  '樹林東昇分館', '雙溪分館', '蘆洲永平分館', '蘆洲永安圖書閱覽室', '蘆洲長安分館',
  '蘆洲集賢分館', '蘆洲兒童親子分館', '蘆洲仁愛智慧圖書館', '鶯歌分館', '鶯歌二甲圖書閱覽室'
]

export default {
  label: '新北市立圖書館',
  type,
  link,
  unlink,
  parser: {
    list: parserList,
    row:  parserRow
  },
  branch
}