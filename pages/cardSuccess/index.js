import store from './store'
import { jumpToBusCode } from '../../components/card-component/utils'
import LIFE from '../../services/life'
const app = getApp()
const createPage = function (options) {
  return Page(store.register(options))
};
createPage({
  data: {
    url: '' // h5链接
  },
  onLoad() {
      
     // 设置页面标题
     my.setNavigationBar({
      title: app.cityInfo.title
    })
  },
  onShow() {
  },
  onReady() {
  },
  async handleCheck(e) {
    console.log('查看卡片', e.detail.formId)
    const res = await LIFE.sendFormId({
      "cityCode": app.cityInfo.cityCode,
      "event": "ebus.open.card.event",
      "extInfo": {
        "userId": app.alipayId,
        "formId": e.detail.formId
      }
    })
    console.log('上送formId成功', res)
    app.Tracker.click('领卡成功-查看卡片')
     my.reLaunch({
      url: '/pages/index/index'
    })
  },
  async handleBus(e) {
    console.log('立即乘车', e.detail.formId)
    const res = await LIFE.sendFormId({
      "cityCode": app.cityInfo.cityCode,
      "event": "ebus.open.card.event",
      "extInfo": {
        "userId": app.alipayId,
        "formId": e.detail.formId
      }
    })
    console.log('上送formId成功', res)
    app.Tracker.click('领卡成功-立即乘车')
    jumpToBusCode(app.cardList[0].cardType)
    console.log('jumpToBusCode', app.cardList[0].cardType)
  }
});
