const app = getApp()
Page({
  data: {
    info: {},
  },
  onLoad(qurey) {
   
      
    let {message,code,back} = qurey || {}
    this.setData({
      info: {
        code: code||'500',
        message: message||'启动失败，请重试',
        btnMethod: 'onRetry',
        btnName: '重试',
        back:back || '../../pages/launch/launch'
      },
    });
  },

  onRetry() {
    let {back} = this.data.info
    my.redirectTo({
      url: back//'/pages/card/pages/launch/launch', // 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用
    });
  },
});
