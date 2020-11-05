let request = getApp().request

// import minxins from '../util/mixins'
//import getDomain from '/utils/env'
export default {
getEch5Page: async (params = {}) => {
    const originData = await request(`/api/marketing?cityCode=${params.cityCode}`, {}, {
      on: false,
      data: {}
    }, 'get', {
        urlType: 'cardManageDomain'
      })
    // 数据处理
    console.log('获取icon返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'SUCCESS' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
  getPageList: async (params) => {
   // const domain = getDomain('default')
  /*  let res = await my.request({
      url: `${domain}/operation-push/push/page`,
      method: 'POST',
      data: params
    })*/

     const originData = await request(`/operation-push/push/page`, {}, {
      on: false,
      data: params
    }, 'POST', {
        urlType: 'default'
      })

    console.log('获取配置', originData)
    if (!originData.API_ERROR && originData.msg === 'SUCCESS' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    } else {
      return {
        success: false
      }
    }
  },
  // 获取首页配置
  getHomePage: async (params = {}) => {
    const originData = await request(`/api/marketing?cityCode=${params.cityCode}`, {}, {
      on: false,
      data: {}
    }, 'get', {
        urlType: 'cardDatailH5Domain'
      })
    // 数据处理
    console.log('获取icon返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'SUCCESS' && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
  // 获取卡面图片
  getCardImg: async (queryString = '') => {
    const originData = await request(`/operation-site/hangzhoutong/getIndexCard?${queryString}`, {}, {
      on: false,
      data: {}
    }, 'get', {
        urlType: 'default'
      })
    // 数据处理
    console.log('获取卡面图片', originData);
    if (!originData.API_ERROR && originData.data) {
      return {
        success: true,
        data: originData.data
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
  // 获取icon 地址
  getDataList: async (params = {},latitude,longitude) => {
    const originData = await request(`/v3/place/around?key=5d1564203934a57a268d0ef563babc03&&location=${longitude},${latitude}&keywords=&types=Bus+Station&radius=1000&offset=6&page=1&extensions=all`, params, {
      on: false,
      data: {}
    }, 'get', {
        urlType: 'map'
      })
    if (!originData.API_ERROR && originData.pois) {
      return {
        success: true,
        data: originData.pois
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
}
