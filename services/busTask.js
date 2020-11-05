import {
  request
} from '../utils/service'


export default {
//https://sit-operation.allcitygo.com/operation-free-bus/account/getUserPoint?accountId=oa20190319184021085255

    getUserPoint: async (userId) => {
    const originData = await request(`/operation-free-bus/account/getUserPointByAlipayId?alipayId=${userId}`,{}, {
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
  //邀你赚钱列表展示
  /*
  
  code	string	
非必须
msg	string	
非必须
data	object []	
非必须
item 类型: object

id	number	
非必须
taskName	string	
非必须
名称	
taskAmount	number	
非必须
剩余数量	
reward	string	
非必须
好友奖励（x元红包）	
coolingTime	number	
非必须
imageUrl	string	
非必须
商家logo	
point	number	
非必须
入会奖励（赏金）	
operationActivityId	string	
非必须
活动id	
detailInfo	string	
非必须
规则说明	
stepInfo	string	
非必须
步骤说明	
stepImageUrl	string	
非必须
步骤图	
myPoint	number	
非必须
获得总赏金	
inviteNum	number	
非必须
邀请人数	
percent	number	
非必须
剩余百分比	
endTime	string	
非必须
结束时间
  
   */
      getInviteTask: async (userId) => {
    const originData = await request(`/operation-free-bus/api/inviteTask/getInviteTask?accountId=${userId}`,{}, {
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
  }
}

