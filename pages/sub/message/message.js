import store from './store'
import message from '../services/message'

const app = getApp()
const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
    showReadIcon: false,
    pageNum: 1,
    pageSize: 20,
    msg: {
      title: '优惠券到期通知',
      text: "您有一张苏泊尔5折优惠券即将在1天后到期，请尽快使用。 您有一张苏泊尔5折优惠券即将在1天后到期，请尽快使用，您有一张苏泊尔5折优惠券即将在1天后到期，请尽快使用。"
    },
    showMsgBox: false,
    items: [
      /* {
           mailId: 1,
           title: '优惠券到期通知',
           sendDate: '1小时前',
           content: '你有一张苏泊尔5折优惠券即将在1000000000天后到期，请尽快使用',
           readStatus:'READ'

       },
       {
           title: '优惠券到期通知',
           sendDate: '2015-11-20 11:00:11',
           content: '你有一张苏泊尔5折优惠券即将在1天后到期，请尽快使用',

       },
       {
           title: '优惠券到期通知',
           content: '你有一张苏泊尔5折优惠券即将在1天后到期，请尽快使用',

       },
       {
           title: '多行列表',

       },
       {
           title: '多行列表',
       },*/
    ]
  },
  async onLoad() {
      
    console.log("onLoad",app.globalData)
    this.loadData(1)
   

  },
  async onShow() {

  },

  async loadData(pageNum) {
    let {  pageSize ,items} = this.data
   
    let res = await message.mailList({
      aliUserId: app.alipayId, pageNum: pageNum,
      pageSize: pageSize
    })
    let msg
    if (res && (res.success) && res.data ) {
      msg = res.data
    }
    //{"code":"20000","msg":"Success","data":[{"mailId":"1","title":"::::>>","content":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","sendDate":"2019-06-15 20:01:24"}],"success":true}
    let mailIdList = []
    if (msg && msg.length) {
      msg.forEach(t => {
        'NO_READ' === t.readStatus && mailIdList.push(t.mailId)
      })
    }else {
      console.log("NO MORE DATA")
      return 
    }
    this.setData({
      items: items.concat(msg),
      pageNum:pageNum
    })
    //this.setData({})
    /*  {
          "aliUserId": "string",
          "mailIdList": [
          "string"
      ]
      }*/
    if (mailIdList.length) await message.readMail({ aliUserId: app.alipayId, mailIdList: mailIdList })
  },
  onClose() {
    console.log('onClose')
    this.setData({
      showMsgBox: false
    })
  },
  onItemClick(ev) {
    /* my.alert({
       content: `点击了第${ev.index}行`,
     });*/
    //ev.index
    let msg = this.data.items[ev.index]
    msg.readStatus = 'READ'
    console.log(`点击了第${ev.index}行`, msg)
    if (msg) {
      this.setData({
        items: this.data.items,
        showMsgBox: true,
        msg: {
          title: msg.title,
          text: msg.content
        }
      })
    }
  },
  onScrollToLower() {
    console.log('onScrollToLower')
    let {pageNum} = this.data
    this.loadData(pageNum+1)
  }
})
