import {
  request
} from '../utils/service'


export default {
 
  getGoodsList: async (data) => {
    const originData = await request(`/operation-mall/h5/getGoodsListBySkuId`,data, {
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
  getSpikeGoodsList: async (activityId) => {
        
    const originData = await request(`/operation-mall/h5/getSpikeGoodsListByActivityId?activityId=${activityId}`,{}, {
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
  //http://sit-operation.allcitygo.com:80/operation-activity/rideNotice/send
rideNotice: async (data) => {
        
    const originData = await request(`/operation-activity/rideNotice/send`,data, {
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
      return  {
      success: false,
      data:originData.data
    }
      
    }
    //my.hideLoading()

    return {
      success: false
    }
  },
  //倒计时计时器
 countdownTime(time) {
  let timer = Number(time);
  if(!isNaN(timer)) {
    let hours = Math.floor(timer / 3600000);
    let minutes = Math.floor((timer - hours * 3600000) / 60000);
    let seconds = Math.floor((timer - hours * 3600000 - minutes * 60000) / 1000);
    return {
      hours,
      minutes,
      seconds
    }
  }
  return 0;
},

}

