import { request } from '../utils/TinyAppHttp'
import mockData from './mock/pageJson.json'
export default {

  queryPageJson: async (data) => {
    let originData
    let count = 0
    do {
      if (data.key) {
        originData = await request(`/preview/getByKey`, { key: data.key }, {
          on: false,
          data: {
            msg: "Success",
            data: mockData
          }
        }, 'post', {
          urlType: 'preview',
          headers: {
            'content-type': 'application/json'
          }
        })
      } else {
        originData = await request(`/push/page?_=${Date.now()}`, data, {
          on: false,
          data: {
            msg: "Success",
            data: mockData
          }
        }, 'post', {
          urlType: 'push',
          headers: {
            'content-type': 'application/json'
          }
        })
      }
      if (!originData.API_ERROR) {
        break
      }
      count++
    } while (count < 3)
    if(count==3 && originData.API_ERROR) {
       my.showToast({content:"网络连接不可用,请稍后重试"})
    }
    // 数据处理
    console.log('返回数据：',count, originData);
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

