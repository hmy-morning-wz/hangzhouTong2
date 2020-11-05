const exampleJson = [
  {
    id: '0',
    startTime: '2019-7-6 00:00:00', // 开始时间 startTime  YYYY-MM-dd HH:mm:ss
    endTime: '2019-8-7 00:00:00', //结束时间   YYYY-MM-dd HH:mm:ss
    priority: 0,//优先级  priority   0~100 ,越大越优先
    switch: 'ON',//开关   ON or OFF
    onlineMode: 'normal', //上架状态   正常(默认) normal 灰度  gray 
    whiteList: '2088302313827690,2088xxxx002', //白名单
    seedName: '信用卡活动',//埋点名称 : "信用卡活动"
    apiData: false,
    apiUrl: '',/*
数据接口(只支持GET)  ：https://xxxx.allcitygo.com/api/xxxx?activity=xxx&userId={userId}&appId={appId}
返回｛
code："0",
msg:"success",
data:{
  show:true,
  image:'https://images.allcitygo.com/20190615140911268PxpEZR.png',//展示图片  
  title:'title',//标题 title
  centent:'centent',//正文 
  //跳转地址（类型，地址，附加参数，小程序appid）
  url_type :'',
  url_path:'',
  url_data:'',
  url_remark:'',
  list：[]//下期计划
}
｝
*/
    extreData: false, // 图片等内容信息是否从接口取
    showMode: 'awalys',//弹框模式（总是，一天一次，仅一次） showMode: awalys  onceday  once  
    showStyle: 'image',
    /*
    弹屏样式  showStyle ：
    image 只展示图片    
    all 展示背景图片、标题和文字  
    text 展示标题和文字 白色背景
    list 如优惠券列表 只能从接口取
    */
    image: 'https://front-h5.oss-cn-hangzhou.aliyuncs.com/img/hangzhou/WechatIMG1455.png',//展示图片  
    title: 'title',//标题 title
    centent: 'centent',//正文 
    buttonText: '立即领取',
    showButton: true,
    //buttonStyle:"border-radius:40rpx;  background:rgba(1,1,1,1);  color:rgba(255,255,255,1);",
    //style="border-radius:40rpx;  background:rgba(1,1,1,1);  color:rgba(255,255,255,1);"
    //跳转地址（类型，地址，附加参数，小程序appid）
    url_path: "/pages/webview/webview?url=https%3a%2f%2fmoney/.allcitygo.com%2fshopping%2f%23%2fgoodDetail%3fuserId%3d%7buserId%7d%26bizScenario%3dhangzhoutc%26goodsId%3d120",
    url_type: "self",
    url_data: '',
    url_remark: '',
  },
  {
    id: '1',
    startTime: '2019-7-6 00:00:00', // 开始时间 startTime  YYYY-MM-dd HH:mm:ss
    endTime: '2019-8-7 00:00:00', //结束时间   YYYY-MM-dd HH:mm:ss
    priority: 0,//优先级  priority   0~100 ,越大越优先
    switch: 'ON',//开关   ON or OFF
    onlineMode: 'normal', //上架状态   正常(默认) normal 灰度  gray 
    whiteList: '2088302313827690,2088xxxx002', //白名单
    seedName: '信用卡活动2',//埋点名称 : "信用卡活动"
    apiData: false,
    apiUrl: '',
    extreData: false, // 图片等内容信息是否从接口取
    showMode: 'awalys',//弹框模式（总是，一天一次，仅一次） showMode: awalys  onceday  once  
    showStyle: 'image',
    image: 'https://images.allcitygo.com/20190615140911268PxpEZR.png',//展示图片  
    title: 'title',//标题 title
    centent: 'centent',//正文 
    url_type: '',
    url_path: '',
    url_data: '',
    url_remark: '',
  },
  {
    id: '3',
    startTime: '2019-7-6 00:00:00', // 开始时间 startTime  YYYY-MM-dd HH:mm:ss
    endTime: '2019-8-7 00:00:00', //结束时间   YYYY-MM-dd HH:mm:ss
    priority: 100,//优先级  priority   0~100 ,越大越优先
    switch: 'ON',//开关   ON or OFF
    onlineMode: 'normal', //上架状态   正常(默认) normal 灰度  gray 
    whiteList: '2088302313827690,2088xxxx002', //白名单
    seedName: '信用卡活动3',//埋点名称 : "信用卡活动"
    apiData: true,
    apiUrl: 'https://operation.allcitygo.com/operation-site/hangzhoutong/getIndexCard?userId={userId}&appId={appId}',
    extreData: false, // 图片等内容信息是否从接口取
    showMode: 'awalys',//弹框模式（总是，一天一次，仅一次） showMode: awalys  onceday  once  
    showStyle: 'image',
    image: 'https://images.allcitygo.com/20190615140911268PxpEZR.png',//展示图片  
    title: 'title',//标题 title
    centent: 'centent',//正文 
    url_type: '',
    url_path: '',
    url_data: '',
    url_remark: '',
  }
]
function dateFormat(t, format) {
  var fmt = format || 'yyyy-MM-dd hh:mm:ss.S'
  if (typeof t !== 'object') {
    t = new Date(t)
  }
  var o = {
    'M+': t.getMonth() + 1, //月份
    'd+': t.getDate(), //日
    'h+': t.getHours(), //小时
    'm+': t.getMinutes(), //分
    's+': t.getSeconds(), //秒
    'q+': Math.floor((t.getMonth() + 3) / 3), //季度
    S: t.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (t.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}

async function downloadImage(image) {
  try {
    let res = await getStorageSync({ key: image })
    if (res && res.success && res.data) {
      console.log('popup getStorageSync image url', res.data)
      let ret = await getSavedFileInfo({ apFilePath: res.data })
      if (ret && ret.size) return res.data
    }
  } catch (err) {
    console.warn('popup getStorageSync image', err)
  }

  return new Promise((resolve, reject) => {
    console.log('popup downloadImage url', image)
    my.canIUse('downloadFile') &&  my.downloadFile({
      url: image,//'http://img.alicdn.com/tfs/TB1x669SXXXXXbdaFXXXXXXXXXX-520-280.jpg',
      success({ apFilePath }) {
        /* my.previewImage({
           urls: [apFilePath],
         });*/
        my.saveFile({
          apFilePath: apFilePath,
          success: (res) => {
            console.log(JSON.stringify(res))
            //apFilePath
            my.setStorage({
              key: image, // 缓存数据的key
              data: res.apFilePath, // 要缓存的数据
              success: (res) => {

              },
            });
          },
        });
        resolve(apFilePath)
      },
      fail(res) {
        console.warn('popup downloadFile fail', res)
        reject(res)
        /*
        my.alert({
          content: res.errorMessage || res.error,
        });*/
      },
    });
  })
}

function request({ url }) {
  return new Promise((resolve, reject) => {
    console.log('popup request url', url)
    my.request({
      url: url,
      success: (res) => {
        console.log('popup request success', res)
        let data = {}
        if (res && res.status === 200) {
          data.success = true
          data.data = res.data
        } else {
          data.success = false
        }
        resolve(data)
      },
      fail: (err) => {
        console.warn('popup request fail', err)
        reject(err)
      },
      complete: () => {

      }
    })
  })
}
function getSavedFileInfo({ apFilePath }) {
  return new Promise((resolve, reject) => {
    my.getSavedFileInfo({
      apFilePath: apFilePath,// 'https://resource/apml953bb093ebd2834530196f50a4413a87.video',
      success: (res) => {
        console.log('popup', JSON.stringify(res))
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })

  })
}

function getStorageSync({ key }) {
  return new Promise((resolve, reject) => {
    my.getStorage({
      key: key,
      success: (res) => {
        res.success = true
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
export async function getPopContent({ userId, appId, cityCode, list }) {
  //list = list || exampleJson
  let popList = list && list.length && list.filter((t) => {
    if (t.switch !== 'ON') return false
    let startTime = t.startTime && Date.parse(t.startTime)
    let endTime = t.endTime && Date.parse(t.endTime)
    let now = Date.now()
    if (startTime > now || endTime < now) {
      return false
    }
    return (t.onlineMode === 'normal' || (t.onlineMode === 'gray' && t.whiteList.indexOf(userId) > -1))
  })
  popList = popList && popList.length && popList.sort((t1, t2) => t1.showMode == t2.showMode ? t2.priority - t1.priority : (t2.showMode === 'awalys' ? 1 : -1))
  console.log("popup", popList)
  if (popList && popList.length) {
    let awalys = 0
    popList.forEach(t => { if (t.showMode === 'awalys') awalys++ })
    console.log("popup awalys", awalys)
    /*if (awalys === 1) {
      return popList[0]
    }*/
    let record
    try {
      let res = await getStorageSync({ key: 'pop_window_record' })
      record = res.success && res.data
    } catch (err) {
      console.warn(err)
    }
    let today = dateFormat(Date.now(), 'yyyy-MM-dd')
    let todayRecord = []
    let onceRecord = []
    console.log("popup record", record)
    let popList1 = popList
    let popList2
    if (record && record[today] && record[today].length) {
      todayRecord = record[today]
      onceRecord = record['once']
      popList2 = popList.filter((t) => {
        return todayRecord.indexOf(t.id) == -1 || (t.showMode === 'once' && onceRecord.indexOf(t.id) == -1)
      })
      if (awalys >= 1 && !(popList2 && popList2.length)) {
        todayRecord = []
      } else {
        popList = popList2
      }
    }
    let pop // popList && popList.length && popList[0]
    let index = 0
    if (popList && popList.length) {
      do {
        pop = popList[index++]
        if (pop && pop.apiData && pop.apiUrl) {
          let url = pop.apiUrl.replace('{userId}', userId).replace('{appId}', appId).replace('{cityCode}', cityCode)
          try {
            let res = await request({ url: url })
            if (res && res.success && res.data && res.data.show) {
              console.log('popup show')
              if (pop.extreData) {
                Object.assign(pop, res.data)
              }
              break
            } else {
              pop = null
            }
          } catch (err) {
            console.warn(err)
            pop = null
          }

          continue
        } else {
          break
        }
      } while (index < popList.length)
    }

    if (awalys > 1 && !(pop)) {
      todayRecord = []
      popList = popList1.filter((t) => {
        return (t.showMode === 'awalys' && (!(t.apiData && t.apiUrl)))
      })
      pop = popList && popList.length && popList[0]
    }
    if (pop) {
      try {
        pop.image = await downloadImage(pop.image + '?x-oss-process=image/resize,m_fill,h_680,w_542')
      } catch (err) {
         console.warn(err)
      }
      todayRecord.indexOf(pop.id) == -1 && todayRecord.push(pop.id)
      pop.showMode === 'once' && onceRecord.indexOf(pop.id) == -1 && onceRecord.push(pop.id)
      let data = { once: onceRecord }
      data[today] = todayRecord
      my.setStorage({
        key: 'pop_window_record', // 缓存数据的key
        data: data, // 要缓存的数据
        success: (res) => {

        },
      });
      console.log('popup', pop)
    }
    else {
      console.log('no popup')
    }
    return pop
  } else {
    console.log('no popup')
  }


}