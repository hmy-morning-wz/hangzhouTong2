import store from './store'
const app = getApp();
//import api from './server';
//import { SHOP_URL, MAP_URL, NEWS_URL } from '../../constant'
import common from '/utils/common'
//let SHOPURL = SHOP_URL
//let MAPURL = MAP_URL

// {name: '哈哈', children: [{skuName: '1'}]}, {name: '哈哈', children: [{skuName: '1'}]}, {name: '哈哈', children: [{skuName: '1'}]}, {name: '哈哈', children: [{skuName: '1'}]}
const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
    showAddPop: false,
    myTempServiceIcon: [],
    myServiceIcon: [
    ],
    all_service: {

    },
    service_group: [],
    ele_icons: []
    /*
    "service_group": [{
      "group_id": "travel_service",
      "box_title": "出行服务",
      "box_desc": ""
    }, {
      "group_id": "all_service",
      "box_title": "全部服务",
      "box_desc": ""
    }],

    "ele_icons": [{
      "group_id": "travel_service",
      "icon_id": "ccjl",
      "priority": 1,
      "default_home": true,
      "icon_name": "乘车记录",
      "icon_desc": "",
      "icon_img": "https://images.allcitygo.com/cardico/c_chengchejilu.png",
      "url_type": "alipay",
      "url_path": "alipays://platformapi/startapp?appId=20000076&returnHome=NO&extReq=%7B%22cardType%22%3A%20%22{cardType}%22%7D&bizSubType=75%3b107&showSearch=false&title=%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95"
    },
    {
      "group_id": "all_service",
      "icon_id": "syxz",
      "priority": 2,
      "icon_img": "https://images.allcitygo.com/cardico/c_shiyongxuzhi.png",
      "url_type": "self",
      "url_path": "/pages/card/pages/usage/usage",
      "url_data": "",
      "url_remark": "",
      "icon_name": "使用须知"
    },
    {
      "icon_img": "https://images.allcitygo.com/cardico/c_shiyongfanwei.png",
      "url_type": "self",
      "url_path": "/pages/card/pages/busline/busline",
      "url_data": "",
      "url_remark": "",
      "icon_name": "使用范围"
    },
    {
      "group_id": "all_service",
      "icon_id": "syxz",
      "priority": 20,
      "card_status": true,
      "icon_name": "退卡申请",
      "icon_desc": "",
      "icon_img": "https://images.allcitygo.com/cardico/c_tuikashenqing.png",
      "url_type": "self",
      "url_path": "/pages/card/pages/invoke/invoke",
      "url_data": "",
      "url_remark": ""
    }
    ]*/
  },
  async onLoad() {
      
    my.showNavigationBarLoading()
    my.getSystemInfo({
      success: (res) => {
        //console.log(res)
        let { windowWidth } = res || {}
        this.setData({ windowWidth: windowWidth || 320 })
      },
    });

  },
  async onShow() {
    let t0 = Date.now()
    let _this = this;
    try {

    } catch (err) {
      console.error(err)
    }
    await this.dispatch('$global:getCardInfo')
    await this.dispatch('$global:getECH5CardInfo')
    await this.loadData()

    let t1 = Date.now() - t0
    app.Tracker.calc('onShow', t1)
    my.hideNavigationBarLoading()
    console.log("onShow 耗时", t1)

  },
  loadIcon(serviceGroup, eleIcons) {
    let ele_cards = this.data.$global.ele_cards || {}

    if (eleIcons) {
      eleIcons = eleIcons.filter((t) => {
        let match = false
        if (t.card_type) {
          t.card_type.forEach(card_type => {
            if (ele_cards[card_type] && ele_cards[card_type].status === 'received') {
              match = true
            }
            //  if( (card_type === ele_cards_key[0] || (ele_cards_key.length >= 2 && card_type === ele_cards_key[1]))) match = true
          })
        } else if (t.card_status) {
          let card_type = app.cardType
          if (ele_cards[card_type] && ele_cards[card_type].status === 'received') {
            match = true
          }
        } else {
          match = true
        }
        return match

      })
    }


    eleIcons = eleIcons.sort((t1, t2) => {
     let c=  ((t2.priority || 0) - (t1.priority || 0))
     if(c==0) {
       c= t2.icon_id > t1.icon_id
     }
     return c
      } )
    let all_service = {}
    serviceGroup.forEach((item) => {
      let ele_service = {
        ele_icons: eleIcons.filter((t) => t.group_id == item.group_id)
      }
      Object.assign(ele_service, item)
      ele_service.ele_icons.length && (all_service[item.group_id] = ele_service)

    })
    let homeIcon = this.data.$global.homeIcon || []
    homeIcon.forEach(t => {
      all_service = this.removeFromAllService(t, all_service)
    })

    this.setData({ service_group: serviceGroup, all_service, eleIcons })
  },

  async loadData() {
    let _this = this
    try {
      await this.dispatch('$global:loadHomeIcon')
      let homeIcon = this.data.$global.homeIcon || []
      let myServiceIcon = homeIcon.slice(0, 5)
      if (homeIcon.length > 5) {
        myServiceIcon.push({ "icon_img": "https://images.allcitygo.com/miniapp/more.png" })
      }
      this.setData({ myServiceIcon })

      await this.dispatch('$global:getPageJSON', 'pages/icon/index')
      if (this.data.$getters.curpage) {
        let { service_group, ele_icons } = this.data.$getters.curpage
        ele_icons = ele_icons && ele_icons.map((t) => { t.icon_id = t.icon_id || '_' + common.hashCode(t.icon_name); return t })
        ele_icons = await this.mergeIcon(ele_icons || [])
        this.loadIcon(service_group, ele_icons)
      } else {
        console.warn("没有页面配置JSON")
        let ele_icons = await this.mergeIcon([])
        let service_group = [{
          "group_id": "travel_service",
          "box_title": "出行服务",
          "box_desc": ""
        }]
        this.loadIcon(service_group, ele_icons)
      }
    } catch (err) {
      console.error(err)
    }




  },

  async mergeIcon(ele_icons) {
    try {
      await this.dispatch('$global:getHomePage')
      let travel_service_icon = (this.data.$global.travelIcon) || []

      travel_service_icon.length && (ele_icons = ele_icons.concat(travel_service_icon))

    } catch (err) {
      console.warn(err)
    }
    return ele_icons
  },

  toService(e) {
    app.handleIconClick(e)
  },
  toAddMyService(e) {
    let myTempServiceIcon = this.data.$global.homeIcon || []//this.data.myServiceIcon
    let { windowWidth } = this.data
    let iconWidth = windowWidth / 4
    let xy = []
    let index = 0
    for (; index < 8; index++) {
      let x = (index % 4) * iconWidth
      let y = index < 4 ? 0 : iconWidth
      xy.push({ x, y })
    }

    this.setData({ showAddPop: true, xy, myTempServiceIcon })
  },
  onPopupClose1(e) {
    this.loadData()
    this.setData({ showAddPop: false, myTempServiceIcon: [] })
  },
  onPopupClose2(e) {
    this.loadData()
    this.setData({ showAddPop: false, myTempServiceIcon: [] })
  },
  onPopupDone(e) {
    let myTempServiceIcon = this.data.myTempServiceIcon
    this.setData({ showAddPop: false, myServiceIcon: myTempServiceIcon, myTempServiceIcon: [] }, () => {

    })
    this.dispatch('$global:setHomeIcon', myTempServiceIcon)
    this.loadData()
    let icon =myTempServiceIcon.map((t)=>{return t.icon_name}) || [];
    this.$mtr_click("编辑图标完成",{icon:JSON.stringify(icon)})
  },
  removeService(e) {
    let myTempServiceIcon = this.data.myTempServiceIcon
    let { all_service } = this.data
    let obj = e.currentTarget.dataset.obj
    if (obj) {
      myTempServiceIcon = myTempServiceIcon.filter((t1) => (t1 != null && t1.icon_id !== obj.icon_id))
      let { ele_icons } = all_service[obj.group_id] || {}
      ele_icons && (ele_icons.push(obj),  ele_icons = ele_icons.sort((t1, t2) => {
     let c=  ((t2.priority || 0) - (t1.priority || 0))
     if(c==0) {
       c= t2.icon_id > t1.icon_id
     }
     return c
      } ) )
    }
    this.setData({ myTempServiceIcon, all_service })
    console.log("removeService", obj)
  },
  removeFromAllService(obj, all_service) {
    if (obj) {
      let { ele_icons } = all_service[obj.group_id] || {}
      ele_icons && ( all_service[obj.group_id].ele_icons = ele_icons && ele_icons.filter((t1) => (t1 != null && t1.icon_id !== obj.icon_id)) )
    }
    return all_service
  },

  toAddService(e) {
    let myTempServiceIcon = this.data.myTempServiceIcon || []
    let { all_service, windowWidth } = this.data
    if (myTempServiceIcon.length >= 7) {
      my.showToast({
        type: 'success',
        content: '已经达到最大个数'
      });
      return
    }
    let obj = e.currentTarget.dataset.obj || {}
    let found = false
    myTempServiceIcon.forEach((t) => {
      if (t && t.icon_id == obj.icon_id) {
        found = true
      }
    })
    if (!found) {
      myTempServiceIcon.push(obj)
      /*
      let index = 0
      let iconWidth = windowWidth / 4
      myTempServiceIcon.forEach((t) => {
        t.x = (index % 4) * iconWidth
        t.y = index < 4 ? 0 : iconWidth
        index++
      })*/
      let { ele_icons } = all_service[obj.group_id] || {}
      all_service[obj.group_id].ele_icons = ele_icons.filter((t1) => (t1 != null && t1.icon_id !== obj.icon_id))
      this.setData({ myTempServiceIcon, all_service })
    }
    console.log("toAddService", obj)
  },
  onMovableChangeEnd(e) {
    console.log("onChangeEnd", e)
    let { windowWidth } = this.data
    let iconWidth = windowWidth / 4
    let { x, y } = e.detail
    let index = e.currentTarget.dataset.index

    let { xy } = this.data
    let o = {}
    let cx = x + (iconWidth / 2)
    let cy = y + (iconWidth / 2)
    xy = xy.map((t, i) => {
      if (i == index) {
        o = t
        return { x, y }
      }
      else return t
    })

    this.setData({ xy }, () => {
      let swapIndex = 0

      xy = xy.map((t, i) => {
        if (i == index) return o
        else return t
      })
      xy.forEach((t, i) => {
        if (cx >= t.x && cx <= (t.x + iconWidth) && cy >= t.y && cy <= (t.y + iconWidth)) {
          swapIndex = i
        }
      })
      let {  myTempServiceIcon } = this.data
      if(index< myTempServiceIcon.length) {
      if (swapIndex >= myTempServiceIcon.length) {
        swapIndex = myTempServiceIcon.length - 1
      }
      let temp = myTempServiceIcon[swapIndex]
      let temp2 =  myTempServiceIcon[index]
      temp2 && (myTempServiceIcon[swapIndex] =temp2)
      temp && (myTempServiceIcon[index] = temp)
      }
      this.setData({ xy,myTempServiceIcon })
    })

  },
  onMovableChange(e) {
    console.log("onMovableChange", e)
    //source "touch"
  },
  onAppear(e) {
    //type "appear"
    //console.log("onAppear", e)
  },

});
