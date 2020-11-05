//import busService from '/pages/card/service/busService'
import { autoErrorPage, autoMiniErrorPage } from '/pages/card/utils/ErrorHandler'
const app = getApp()
let busService = getApp().busService
Page({
  data: {},
  getUserInfo(scopes) {
    return new Promise((resolve, reject) => {
      my.getAuthCode({
        scopes,
        success: (info) => {
          console.log('用户信息', scopes, info)
          resolve(info)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  },
  onLoad(opt) {


      

    console.log('opt', opt)
    if (opt) app.redirectPage = opt.redirectPage
    this.getUserInfo(['auth_base']).then(({ authCode }) => {
      console.log('app配置', app.redirectPage)
      return busService.doLogin(authCode)
    }).then(autoErrorPage(({ data }) => {
      console.log('下一步', data)
      busService.setCToken(data.ctoken)
      app.isNewUser = data.newUser
      busService.getConfig('ioc.ebuscard.city.config').then(autoErrorPage(({ data }) => {
        console.log('>>> 城市配置信息: ', data)
        app.config = data
        if (app.isNewUser) {
          my.redirectTo({ url:'/pages/index/index'  /*'/pages/card/pages/guide/guide'*/ })
        } else {
          if (app.redirectPage) {
            const redirect = app.redirectPage
            app.redirectPage = null
            my.redirectTo({ url: redirect })
          } else {
            my.redirectTo({ url:'/pages/index/index' /*'/pages/card/pages/main/main'*/ })
          }
        }
      }))
    })).catch(error => {
      autoMiniErrorPage()
    })
  },
})
