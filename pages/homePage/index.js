
const app = getApp()


Page({
  data: {

  },

  onLoad() {
    my.showLoading()
      
  
  },

  onShow() {
    my.reLaunch({
      url: '/pages/index/index'
    })
  }

})
