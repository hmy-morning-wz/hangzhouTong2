import {
  request
} from '../utils/service'
export default {
  getThisWeekSign: async (data) => {
    const originData = await request(`/operation-activity/sign/getThisWeekSign`,data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        data: originData.data,
        success: true,
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
   addSign: async (data) => {
    const originData = await request(`/operation-activity/sign/addSign`,data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        data: originData.data,
        success: true,
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
  getSumHeathMoney: async (data) => {
    const originData = await request(`/oper-act-tmall/voucher/sumHealthMoney`,data, {
      on: false,
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        data: originData.data,
        success: true,
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
  getAdmit: async (userId) => {
    const originData = await request(`/oper-act-tmall/healthMoney/admit?userId=${userId}`,{}, {
      on: false,
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    if (!originData.API_ERROR && originData.msg === 'Success' && originData.data) {
      return {
        data: originData.data,
        success: true,
      }
    }
    //my.hideLoading()
    return {
      success: false
    }
  },
}

