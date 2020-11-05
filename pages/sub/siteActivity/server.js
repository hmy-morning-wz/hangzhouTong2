let request = getApp().request

export default {
 
  getNearActivity: async (data) => {
    ///operation-site/h5/site/queryNearActivity
    ///operation-site/h5/site/v2/queryNearActivity
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
    my.hideLoading()

    return {
      success: false
    }
  },
  getLocalActivity: async (data) => {
    const originData = await request(`/operation-site/h5/site/v2/queryLocalActivity`,data, {
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
      return originData;
      
    }
    my.hideLoading()

    return {
      success: false
    }
  },
  getQzCategoryList: async () => {
    const originData = await request(`/operation-mall/category/getQzCategoryList`,{}, {
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
      return originData;
      
    }
    my.hideLoading()

    return {
      success: false
    }
  },
  
}

