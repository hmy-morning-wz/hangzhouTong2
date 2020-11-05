import store from './store'
const app = getApp()
const createPage = function (options) {
  return Page(store.register(options))
};
createPage({
  data: {
    name: ''
  },
  onLoad(options) {
    console.log(app.cityInfo.title)
    this.setData({
      name: app.cityInfo.title
    })
      
  },
  onShow() {
  },
  onReady() {
  },
  handleBack() {
    my.navigateTo({
      url: '/pages/index/index'
    })
  }
});
