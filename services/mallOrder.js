import {
  request
} from '../utils/service'


export default {
    /*
    curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \
   "orderStatusList": [ \
     0 \
   ], \
   "userId": "string" \
 }' 'http://sit-operation.allcitygo.com:80/operation-order/mallOrder/getUserOrderCount'
    * */
    getUserOrderCount: async (data) => {
    const originData = await request(`/operation-order/mallOrder/getUserOrderCount`,data, {
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
vpList: async (data) => {
  /*
  pageNo: 1,
        pageSize: 100,
        userId: this.$route.query.userId ,
        // || "2088702267429045"
        voucherType: this.voucherType
  */ 
    const originData = await request(`/voucher/mallVoucherPackage/vpCount`,data, {
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

  voucherRemind: async (data) => {
    //userId：xxx
    const originData = await request(`/voucher/mallVoucher/remindVoucher`,data, {
      on: false,
      //data: mockData
    }, 'post', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData); //"code":"20000"
    if (!originData.API_ERROR && originData.code === '20000' && originData.data) {
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
  immediateToUse: async (voucherId) => {
    //voucherId = xxx
    const originData = await request(`/voucher/mallVoucher/immediateToUse?voucherId=${voucherId}`,{}, {
      on: false,
      //data: mockData
    }, 'get', {
      urlType: 'default',
      headers: {
        'content-type': 'application/json'
      }
    })
    // 数据处理
    console.log('返回数据：', originData);
    if (!originData.API_ERROR && originData.code === '20000' && originData.data) {
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

