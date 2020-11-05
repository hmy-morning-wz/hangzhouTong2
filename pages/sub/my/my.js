import store from './store'
const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
    buttonText:"加载中"
  },
  async onLoad() {
   my.showLoading();
   let app = getApp()
   await app.loadUserId()
   await this.dispatch('$global:getCardInfo')
   await this.dispatch('$global:getECH5CardInfo')
   let cardType = app.cardType
   let  ele_cards =  cardType &&this.data.$global.ele_cards &&  this.data.$global.ele_cards[cardType] || {}
 
   let cardNo =ele_cards.cardNo 
   this.setData({userId:app.globalData.userId,cardNo:cardNo,buttonText:"知道了"})
   my.hideLoading();
  },
  onTap(){
    my.reLaunch({
      url: '/pages/index/index'
    });
  }
});
