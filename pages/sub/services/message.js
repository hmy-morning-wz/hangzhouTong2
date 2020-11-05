/*import {
  request
} from '../utils/service'*/
let request = getApp().request

export default {

  mailList: async (data) => {
    const originData = await request(`/operation-site/mail/mailList`, data, {
        on: false,
        //data: mockData
      }, 'post', {
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
        data: originData.data
      }
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
  noReadCount: async (aliUserId) => {
    const originData = await request(`/operation-site/mail/noReadCount`, { aliUserId: aliUserId }, {
      on: false,
      //data: mockData
    }, 'post', {
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
        data: originData.data
      }
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
  readMail: async (data) => {
    const originData = await request(`/operation-site/mail/readMail`, data, {
      on: false,
      //data: mockData
    }, 'post', {
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
        data: originData.data
      }
    }
    //my.hideLoading()

    return {
      success: false
    }
  },

}

