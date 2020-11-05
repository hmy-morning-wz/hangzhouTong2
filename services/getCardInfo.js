import {
  request
} from '../utils/service'


export default {
 
  getCardList: async (data) => {
   

    const originData = await request(`/operation-site/hangzhoutong/withoutGetBusCardList?userId=${data.userId}&pid=${data.pid}`,{}, {
      on: false,
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return originData.data
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
  //卡详情
    getH5CardDetail: async (obj) => {
    const originData = await request(`/operation-site/hangzhoutong/getH5CardDetail?cardId=${obj.cardId}&pid=${obj.pid}&userId=${obj.userId}`,{}, {
      on: false,
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return originData.data
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
  

  getXValue: async (data) => {
    const originData = await request(`/operation-site/hangzhoutong/getXValue?userId=${data.userId}&pid=${data.pid}`,{}, {
      on: false,
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        success: true,
        data:originData.data
      }
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
  
      getOrChangeCard: async (data) => {
          my.showLoading({
        content: '加载中...',
      });
    const originData = await request(`/operation-site/hangzhoutong/getBusCard`,data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success') {
      return originData
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
//获取附近站点
 getLocationList: async (params = {},latitude,longitude) => {
    const originData = await request(`/v3/place/around?key=5d1564203934a57a268d0ef563babc03&&location=${longitude},${latitude}&keywords=&types=Bus+Station&radius=1000&offset=1&page=1&extensions=all`, params, {
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
    return {
      success: false
    }
  },
  getNearAllActivity: async (data) => {
    ///operation-site/h5/site/v2/queryNearActivity
    ///operation-site/h5/site/queryNearActivity
    const originData = await request(`/operation-site/h5/site/v2/queryNearActivityBatch`,data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return originData.data
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
  //获取站点附近活动
  queryNearActivity: async (data) => {
    ///operation-site/h5/site/v2/queryNearActivity
    ///operation-site/h5/site/queryNearActivity
    const originData = await request(`/operation-site/h5/site/v2/queryNearActivity`,data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return originData.data
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },

    //更换列表
  validBusCardList: async (data) => {
    const originData = await request(`/operation-site/hangzhoutong/validBusCardList?userId=${data.userId}&pid=${data.pid}`,{}, {
      on: false,
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return originData.data
      
    }
    //my.hideLoading()

    return false;
  },
    //获取默认卡面
  getIndexCard: async (data) => {
      // http://sit-operation.allcitygo.com/operation-site/hangzhoutong/getIndexCard?pids=T0330100&userid=2088702434758033
    const originData = await request(`/operation-site/hangzhoutong/getIndexCard?userid=${data.userId}&pids=${data.pid}`,{}, {
      on: false,
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })    
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return originData.data
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
  
     //更换卡面
  changeCard: async (data) => {
      my.showLoading({
        content: '加载中...',
      });
    const originData = await request(`/operation-site/hangzhoutong/changeCard?userId=${data.userId}&pid=${data.pid}&cardId=${data.cardId}`,{}, {
      on: false,
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.msg === 'Success') {
      return originData
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },

  
    creditCard: async (data) => {
    const originData = await request(`/api/user/state?alipay_id=${data.userId}`,{}, {
      on: false,
    }, 'get', {
      urlType: 'credit_card',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    //{"data":{"state":0,"text":"公交专享福利，限时免费领取"},"code":"0","message":"SUCCESS"}
    if (!originData.API_ERROR && originData.code === '0' && originData.data) {
      return {
        success: true,
        data:originData.data
      }
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
  
}

