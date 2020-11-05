import store from './store'
const createPage = function (options) {
  return Page(store.register(options))
};
const app = getApp()

createPage({
  data: {
    isRule: false,
    loadReday:false
  },
  async onLoad(query) {
    const userId = await getApp().loadUserId();
    // this.dispatch("getSumHeathMoney", userId)
    // await this.dispatch("getThisWeekSign", userId)
    if (query.campId) {
      const data = {
        userId: userId,
        campId: query.campId,
      }
      await this.dispatch("addSign", data)
    }
    this.dispatch("getSumHeathMoney", userId)
    await this.dispatch("getThisWeekSign", userId)
    this.setData({loadReday:true})
  },
  //纯碎为了区分埋点
  hanldeUse() {
    my.ap.navigateToAlipayPage({
      path: 'https://render.alipay.com/p/w/insgift-open/index.html?transVoucherPlanId=INSP00356735&entrance=jkj_kichi_publictrans',
      fail: (err) => {
        my.alert({
          content: JSON.stringify(err)
        });
      }
    });
  },
  hanldeReceive() {
    this.dispatch("closePopup")
    my.ap.navigateToAlipayPage({
      path: 'https://render.alipay.com/p/w/insgift-open/index.html?transVoucherPlanId=INSP00356735&entrance=jkj_kichi_publictrans',
      fail: (err) => {
        my.alert({
          content: JSON.stringify(err)
        });
      }
    });
  },
  handleOpen() {
    this.setData({
      isRule: true
    })
  },
  handleClsoe() {
    this.setData({
      isRule: false
    })
  },
  async onShow() {
    let {loadReday} = this.data
    if(loadReday){
    const userId = await getApp().loadUserId();
    this.dispatch("getSumHeathMoney", userId)
    await this.dispatch("getThisWeekSign", userId)
    }
  },
  onReady() {
  },

});
