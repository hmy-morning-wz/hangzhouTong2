const DEFAULT_CODE = -1;
const DEFAULT_MESSAGE = 'UNKNOW ERROR';
    const app = getApp()
Page({
  data: {
    type: 'error',
    title: '',
    detail: '',
  },
  onLoad(query) {

      

    this.setData({
      title: '', // query.code ? query.code : DEFAULT_CODE,
      detail: query.message ? query.message : DEFAULT_MESSAGE,
    });
    if (getApp().config && getApp().config.city.cardName) {
      my.setNavigationBar({
        title: getApp().config.city.cardName,
      });
    }
  },

  backHome() {
    my.navigateBack({
      delta: 9999
    });
  },
});
