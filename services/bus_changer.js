import {
  request
} from '../utils/service'


export default {

    addUser: async (data) => {
        const originData = await request(`/challenge/api/user/add`,data, {
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
        if (!originData.API_ERROR && originData.code === '0' && originData.data) {
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
    expertInfo: async (cityCode) => {
    const originData = await request(`/challenge/api/user/expert_info?city_code=${cityCode}`,{}, {
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
    if (!originData.API_ERROR && (originData.code === '0'  ) && originData.data) {
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
    awardAmount: async (userId,cityCode) => {
        const originData = await request(`/challenge/api/lottery/award_amount?alipay_id=${userId}&city_code=${cityCode}`,null, {
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
        if (!originData.API_ERROR && originData.code === '0' && originData.data!=null) {
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

    /*
    curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \
   "orderStatusList": [ \
     0 \
   ], \
   "userId": "string" \
 }' 'http://sit-operation.allcitygo.com:80/operation-order/mallOrder/getUserOrderCount'
    * */
}

