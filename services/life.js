import {
  request
} from '../utils/service'
//import CONFIG from '../utils/config'
import getDomain from '../utils/env'
// import minxins from '../utils/mixins'
export default {
  /*
  getAccount: async (params = {}) => {
    const originData = await request(`/smk_alilife/vircard/extGetVirCardList.ext`, {request: JSON.stringify({'alipayId': params.alipayId})}, {
      on: false,
      data: {}
    }, 'post', {
      urlType: 'smk',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'AppId': 'com.smk.test.test'
      }
    })
    // 数据处理
    console.log('获取返回数据：', originData);
    if (!originData.API_ERROR && originData.code === 0 && originData.response) {
      return {
        success: true,
        data: originData.response
      }
    }
    //my.hideLoading()
    // minxins.showModal('showToast', {
    //   type: 'fail',
    //   title: '温馨提示',
    //   content: originData.errorMsg ? originData.errorMsg : '接口请求错误!'
    // })
    return {
      success: false
    }
  },
  */
  // 优惠券信息
  queryHzUserVoucherInfo: async (alipayId = {}) => {
    const originData = await request(`/voucher/mappvoucher/queryHzUserVoucherInfo`, {
      aliUserId: alipayId
    }, {
      on: false,
      data: {}
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('获取优惠券返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    //my.hideLoading()
    // minxins.showModal('showToast', {
    //   type: 'fail',
    //   title: '温馨提示',
    //   content: originData.errorMsg ? originData.errorMsg : '接口请求错误!'
    // })
    return {
      success: false
    }
  },
  // 获取 支付宝userId
  getUserId: async (params = {}) => {
    const originData = await request(`/operation-activity/parentChildAccess/getAlipayUserId?auth_code=${params.authCode}`, {}, {
      on: false,
      data: {}
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('获取返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    //my.hideLoading()
    // minxins.showModal('showToast', {
    //   type: 'fail',
    //   title: '温馨提示',
    //   content: originData.errorMsg ? originData.errorMsg : '接口请求错误!'
    // })
    return {
      success: false
    }
  },
  // 获取亲子活动列表
  getAccessToken: async (params = {}) => {
    const originData = await request(`/operation-activity/parentChildAccess/getAccessToken?alipayId=${params.alipayId}`, params, {
      on: false,
      data: {}
    }, 'post', {
      urlType: 'token'
    })
    // 数据处理
    console.log('获取返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.code === '20000') {
      return {
        success: true,
        data: originData.data
      }
    }
    //my.hideLoading()
    // minxins.showModal('showToast', {
    //   type: 'fail',
    //   title: '温馨提示',
    //   content: originData.errorMsg ? originData.errorMsg : '接口请求错误!'
    // })
    return {
      success: false
    }
  },
  // 获取亲子活动列表
  getHomePageList: async (params = {}) => {
    // /manage/front/h5/open/goods/homePageList
    // /pccnl-admin/front/h5/open/goods/homePageList
    const originData = await request(`/manage/front/h5/open/goods/homePageList`, params, {
      on: false,
      data: {}
    }, 'post', {
      urlType: 'citizens',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('获取亲子活动列表：', originData.data.categories);
    if (!originData.API_ERROR && originData.success && originData.data) {
      return originData.data.categories
    }
    //my.hideLoading()
    // minxins.showModal('showToast', {
    //   type: 'fail',
    //   title: '温馨提示',
    //   content: originData.errorMsg ? originData.errorMsg : '接口请求错误!'
    // })
    return {
      success: false
    }
  },
  doLogin : async (authCode) => {
    console.log("authcode22===",authCode)
    let app =getApp()
    const originData = await request(`/miniapp_login.do?auth_code=${authCode}&citycode=${app.cityCode}&appid=${app.appId}`, '',{
      on: false,
      data: {}
    }, 'get', {
      urlType: 'cardManageDomain'
    })
    if (!originData.API_ERROR && originData.msg === 'SUCCESS' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    //my.hideLoading()
    // minxins.showModal('showToast', {
    //   type: 'fail',
    //   title: '温馨提示',
    //   content: originData.errorMsg ? originData.errorMsg : '接口请求错误!'
    // })
    return {
      success: false
    }
  }
  ,
    // 上送formId
  sendFormId: async (params = {}) => {
    const domain = getDomain('cardManageDomain')
    let res = await my.request({
      url: `${domain}/gateway.do?service=ioc.ebus.event.send&biz_content=${JSON.stringify(params)}&timestamp=${Math.floor(new Date().getTime() / 1000)}`
    })
    if (res.data.code === 200) {
      return {
        success: true,
        data: res.data.data
      }
    } else {
      return {
        success: false
      }
    }
  },
}

