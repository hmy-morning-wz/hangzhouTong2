import store from './store'
import busChanger from '../../services/bus_changer'
import busTask from '../../services/busTask'
import mallOrder from '../../services/mallOrder'
import message from '../../services/message'

const app = getApp()
const DEFAULT_ICON = 'https://images.allcitygo.com/miniapp/202007/avatar.webp'
const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
    page_title: '我的',
    userId: app.alipayId || null,
    nickName: "用户昵称",
    showAuth: false,
    avatar: DEFAULT_ICON,
    pageJson: {},
    indicatorDots: true,
    autoplay: false,
    vertical: false,
    interval: 1000,
    circular: true,
    redCardVoucher: {},
    orderCount: {},
    reward: {},
    busChangerExpertInfo: {
      count: 0,
      userIcon: []
    },
    busChangerAwardAmount: 0,
    busTaskAward: 0,
    messageCount: 0,
    vpListNum: 0,
    lastMessage: '',
    lifestyle:true,
    publicId: app.globalData.publicId, 
    bus_changer: {},
    order_service_icon: {
      "box_title": "我的订单",
      "box_desc": "全部订单",
      "url_type": "smkOut",
      "url_path": "https://life.96225.com/city/#/activeDetial?id=201905061740591001",
      "url_data": "",
      "url_remark": "",
      "ele_icons": [
        /*  {
            "icon_name": "公交卡业务",
            "icon_desc": "",
            "icon_img": "https://front-h5.oss-cn-hangzhou.aliyuncs.com/img/hangzhou/icon1.png",
            "url_type": "miniapp",
            "url_path": "pages/index/index",
            "url_data": {
              "cityCode": 330100
            },
            "url_remark": "2019022863420364"
          } */
      ]
    },
    my_service_icon: {
      "box_title": "我的服务",
      "box_desc": "",
      "ele_icons": [
        /* {
           "icon_name": "公交卡业务",
           "icon_desc": "",
           "icon_img": "https://front-h5.oss-cn-hangzhou.aliyuncs.com/img/hangzhou/icon1.png",
           "url_type": "miniapp",
           "url_path": "pages/index/index",
           "url_data": {
             "cityCode": 330100
           },
           "url_remark": "2019022863420364"
         }*/
      ]
    }
    ,
    middle_banner: [
      /* {
         "img_src": "http://sit-images.allcitygo.com/20190519145921846J9T8ub.png",
         "url_type": "smkOut",
         "url_path": "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2018121062528095&scope=auth_base&redirect_uri=https%3A%2F%2Fmoney/.allcitygo.com%2Flifecircle%2F%23%2Fsuporactivity",
         "url_data": "",
         "url_remark": "",
         "text": "1-苏泊尔"
       }*/
    ]

  },
  async onLoad() {
      
    this.setData({
      bus_changer: {
        name: '乘车挑战',
        url_type: "miniapp",
        url_path: "/pages/index/index",
        url_data: { cityCode: app.cityCode, cityName: app.cityName },
        url_remark: "2019060565504470",
        //envVersion:develop
      }
    })

    this.loadUserInfo()

     await this.dispatch('$global:getPageJSON','pages/me/me')  
     let curpage = this.data.$getters.curpage 
    if (curpage) {
      if (curpage.order_service_icon && curpage.order_service_icon.ele_icons && curpage.order_service_icon.ele_icons.length > 0) {
        // res.data.order_service_icon.ele_icons[1].num =111
        curpage.order_service_icon.seedName = "我的-全部订单"
        curpage.order_service_icon.ele_icons.forEach((t) => {
          if (t.icon_name === '待付款') {
            t.type = 'dfk'
          } else if (t.icon_name === '待发货') {
            t.type = 'dfh'
          } else if (t.icon_name === '待收货') {
            t.type = 'dsh'
          } else if (t.icon_name === '已完成') {
            t.type = 'ywc'
          }

        })
      }
      curpage.redCardVoucher && (curpage.redCardVoucher.seedName = "我的-卡包卡券")
      curpage.reward && (curpage.reward.seedName = "我的-我的赏金")
      //curpage.middle_banner = null
      this.setData({
        page_title:curpage.page_title || this.data.page_title,
        pageJson: curpage,
        order_service_icon: curpage.order_service_icon || { ele_icons: [] },
        my_service_icon: curpage.my_service_icon || { ele_icons: [] },
        middle_banner: curpage.middle_banner || [],
        redCardVoucher: curpage.redCardVoucher || {},
        reward: curpage.reward || {},
      },()=>{
        if(!this.hide) {
           my.setNavigationBar({
               title: this.data.page_title
           });
        }
      })
    }
  


  },
  onHide(){
    console.log("onHide")
    this.hide = true
  },
  async onShow() {
    let res = null
    this.hide = false
    my.setNavigationBar({
      title: this.data.page_title
    });
    //卡券

    let vpListNum = 0
    res = await mallOrder.vpList({
        canUse: true,
  //pageNo: 0,
  //pageSize: 0,
  //userId:app.alipayId ,
  //"voucherType": "string"
      pageNo: 1,
      pageSize: 100,
      userId: app.alipayId // ,voucherType:null
    })
    if (res && (res.success) && res.data) {
      vpListNum = res.data.count
    }
    //免费乘车赏金
    //todo
    let busTaskAward = 0
    res = await busTask.getUserPoint(app.alipayId)
    if (res && res.success && res.data) {
      busTaskAward = res.data.availablePoint
    }
    //console.log("busTaskAward",busTaskAward,res)
    //我的消息
    //todo
    let messageCount = 0
    res = await message.noReadCount(app.alipayId)
    if (res && (res.success) && res.data) {
      messageCount = res.data.count
    }

    //我的订单
    //
    //（全部：orderStatusList不传；待付款：传1,6,7；待发货：传2,3；待收货：传4；已完成：传5）
    // userOrderCount
    let orderCount = {}

    // let res = await mallOrder.getUserOrderCount({userId:app.alipayId})
    // res&&res.data && (orderCount[all]=res.data.userOrderCount)
    /*
    res = await mallOrder.getUserOrderCount({ userId: app.alipayId, orderStatusList: [1, 6, 7] })
    if (res && (res.success) && res.data) {
      orderCount.dfk = res.data.userOrderCount
    }
    res = await mallOrder.getUserOrderCount({ userId: app.alipayId, orderStatusList: [2, 3] })
    if (res && (res.success) && res.data) {
      orderCount.dfh = res.data.userOrderCount
    }
    res = await mallOrder.getUserOrderCount({ userId: app.alipayId, orderStatusList: [4] })
    if (res && (res.success) && res.data) {
      orderCount.dsh = res.data.userOrderCount
    }*/
    /*
    res = await mallOrder.getUserOrderCount({ userId: app.alipayId, orderStatusList: [5] })
    if (res && (res.success) && res.data) {
      orderCount.ywc = res.data.userOrderCount
    }*/
    let order_service_icon = this.data.order_service_icon
    let ele_icons = order_service_icon.ele_icons
    ele_icons && ele_icons.forEach((t) => {
      if (t.type) {
        t.num = orderCount[t.type]
      }
    })

    //乘车挑战
    //todo
    let busChangerExpertInfo = {
      count: 0,
      userIcon: []
    }
    let busChangerAwardAmount = 0
    res = await busChanger.expertInfo(app.cityCode)
    //[{"icon":"https://sit-images.allcitygo.com/20190328173946588UMByyl.jpg","nickname":"9537","desc":"累计乘车310次","type":"max_count"},{"icon":null,"nickname":null,"desc":"362014","type":"max_user"},{"icon":"https://sit-images.allcitygo.com/20190328173946588UMByyl.jpg","nickname":"9497","desc":"连续乘车42次","type":"max_insist"}
    if (res && (res.success) && res.data) {
      let info = res.data
      //console.log(info)
      if (info.length) {
        info.forEach(t => {
          if (t.type === 'max_user') {
            busChangerExpertInfo.count = t.desc
          } else {
            t.icon && busChangerExpertInfo.userIcon.push({ imageUrl: t.icon })
          }
        })
      }
    }

    res = await busChanger.awardAmount(app.alipayId, app.cityCode)
    if (res && (res.success)) {
      busChangerAwardAmount = res.data
      console.log("got busChangerAwardAmount", busChangerAwardAmount)
    }

    this.setData({
      orderCount: orderCount,
      order_service_icon: order_service_icon,
      busChangerExpertInfo: busChangerExpertInfo,
      busChangerAwardAmount: busChangerAwardAmount,
      busTaskAward: busTaskAward,
      messageCount: messageCount,
      vpListNum: vpListNum
    })
  },
  onReady() {
  },
  handleIconClick(e) {
    app.handleIconClick(e)
  },

  getSetting() {
    return new Promise((r, v) => {
      my.getSetting({
        success: (res) => {
          /*
           * res.authSetting = {
           *   "location": true,
           *   "audioRecord": true,
           *   ...
           * }
           */
          let { authSetting: { userInfo } } = res
          if (!userInfo) {
            my.removeStorage({ key: 'userInfo',complete:()=>{
                r()
            } })
          }else {
             r()
          }          
         
        }
      })
    })

  },

  async loadUserInfo() {
    await  this.getSetting() 
    let that = this
    my.getStorage({
      key: 'userInfo',
      success: function(res) {
        console.log('getStorage userInfo', res.data);
        if (res.data && res.data.nickName) {
          let nickName = res.data.nickName
          if (nickName === '' || nickName == null || nickName.length === 0) {
            nickName = app.alipayId ? that.desensitization(app.alipayId, 0, app.alipayId.length - 6) : "用户昵称"
          }
          that.setData({
            nickName: nickName,
            avatar: res.data.avatar,
            showAuth: false,
          })
          //busChanger.addUser({ alipay_id: app.alipayId, name: res.data.nickName, icon: res.data.avatar })
        } else {
          that.updateUserInfo()
          let nickName = app.alipayId ? that.desensitization(app.alipayId, 0, app.alipayId.length - 6) : "用户昵称"
          that.setData({
            showAuth: true,
            nickName: nickName
          })
        }
      }, fail: function(res) {
        // my.alert({content: res.errorMessage});
      }
    })


  },
  desensitization(str, beginStr, endStr) {
    if (endStr > 0) {
      var len = str.length;
      // var leftStr = str.substring(0, beginStr);
      var rightStr = str.substring(endStr, len);
      return rightStr
    } else {
      return ""
    }
    /*    var len = str.length;
        var leftStr = str.substring(0, beginStr);
        var rightStr = str.substring(endStr, len);
        var str = ''
        var i = 0;
        var sCount = 0
        try {
          for (i = 0; i < endStr - beginStr; i++) {
            if (sCount >= 4) break
            str = str + '*'
            sCount++
          }
        } catch (error) {

        }
        str = leftStr + str + rightStr;
        return str;*/
  },
  updateUserInfo() {
    let that = this
    console.log('updateUserInfo');

    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        my.getAuthUserInfo({
          success: (userInfo) => {
            console.log('updateUserInfo success', userInfo);
            let nickName = userInfo.nickName
            if (nickName === '' || nickName == null || nickName.length === 0) {
              nickName = app.alipayId ? that.desensitization(app.alipayId, 0, app.alipayId.length - 6) : "用户昵称"
            }
            that.setData({
              nickName: nickName,
              avatar: userInfo.avatar,
              showAuth: false
            })
            busChanger.addUser({ alipay_id: app.alipayId, name: userInfo.nickName, icon: userInfo.avatar })


            my.setStorage({
              key: 'userInfo',
              data: {
                nickName: userInfo.nickName,
                avatar: userInfo.avatar,
              },
              success: function() {
                // my.alert({content: '写入成功'});
                console.log('setStorage userInfo success ');
              }
            });
          }
        })
      }
    })
  },

  goMessage() {
    my.navigateTo({
      url: '/pages/sub/message/message'
    })
  },
onAppear(e) {
    //type "appear"
    //console.log("onAppear", e)
  },

})
