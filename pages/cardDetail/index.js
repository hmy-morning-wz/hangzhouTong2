import store from './store'
import busService from '/pages/card/service/busService';
import { jumpToBusCode } from '../../components/card-component/utils'

const app = getApp()
const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
    imageUrl: '',
    infoContent: '',
    showTop: false, // 显示协议
    account: null,
    monthCardAccount: (new Date()).getMonth() + 1,
    activeTab: 0,
    userId: null,
    cardType: '',
    showInfo: false,
    cardName: '',
    agreement_url: [],
   /* cardId: null,
    cardLogo: null,
    status: null,
    menus: null,*/
    cardInfoJson:{}
  },
  async onLoad(option) {
    //(this,option)
    my.showLoading()
    console.log('onLoad', option)
    let { cardType } = option || {}
    cardType = cardType || this.data.cardType || app.cardType
    this.setData({
      cardType: cardType,
    })
    
    // let account = await app.getAccount(app.alipayId)
    await this.dispatch('$global:getHomePage') //this.dispatch('getHomePage')
    let {cardRelativeTarget}  = this.data.$global//.getIn('cardRelativeTarget',{})
     
    if(cardRelativeTarget && cardRelativeTarget.pageTitle ) my.setNavigationBar({
      title:cardRelativeTarget.pageTitle 
    });
    //let cardRelativeTarget = this.data.cardRelativeTarget
    this.setData({cardRelativeTarget,cardInfoJson:cardRelativeTarget && cardRelativeTarget[cardType]|| (cardRelativeTarget &&cardRelativeTarget.cardInfo)})

    if (app.cityCode !== '330100') {
      console.time("time-busServiceinit")
      await busService.reday()
      if (!busService.ctoken) {
        try {
          await busService.getToken()
        } catch (err) {
          console.warn('busService getToken', err)
        }
      }
      console.timeEnd("time-busServiceinit")
    }
   
    await this.getPageJSON()
    //await this.dispatch('getCardImg', { pids: `${cardType}`, userId: app.alipayId })
    try {
      //let cardInfo = this.data.$global.normalCardInfo
      let cardInfo = {}
      let activeTab =0
      /*
      if (cardType === 'T2330100') {
        cardInfo = this.data.$global.monthCardInfo
        activeTab = 1
      } else {
        cardInfo = this.data.$global.normalCardInfo
        activeTab = 0
      }*/
      //let cardName =  cardInfo.cardTitle
      //let cardNo = cardInfo.cardModels && cardInfo.cardModels.length > 0 ? cardInfo.cardModels[0].cardNo : ''
      let imageUrl = this.data.$getters.ele_cards[cardType] ? this.data.$getters.ele_cards[cardType].imageUrl : null
      if (this.data.indexCard && this.data.indexCard.length && this.data.indexCard[0].buscard && this.data.indexCard[0].buscard.coverImg) imageUrl = this.data.indexCard[0].buscard.coverImg
      this.setData({
        imageUrl: imageUrl,
        cardType: cardType,
        //account: account,
        //cardNo:cardNo,
        activeTab: activeTab,
        //cardName:cardName
      })
      console.log('[cardInfo imageUrl]', imageUrl)
    } catch (err) {
      console.log(err)
    }

    my.hideLoading()
  },
  async getPageJSON() {
    await this.dispatch('$global:getPageJSON','pages/cardDetail/index')
    let pageConfig = this.data.$getters.curpage
    console.log('[pageConfig]', pageConfig)
    pageConfig && this.dispatch('setPageList', pageConfig)
    /* my.setNavigationBar({
       title: pageConfig.data.page_title
     })*/
  },

  async onShow() {
    try {    
      await this.dispatch('$global:getCardInfo')
      await this.dispatch('$global:getECH5CardInfo')
      
      let  cardType =  this.data.cardType || app.cardType
      let  ele_cards =  cardType &&this.data.$global.ele_cards &&  this.data.$global.ele_cards[cardType] || {}
      let cardStatus =  ele_cards.status
      let cardTitle = ele_cards.cardTitle
      //await this.dispatch('getCardImg', { pids: `${this.data.cardType}`, userId: app.alipayId })
      let imageUrl = this.data.$getters.ele_cards[cardType] ? this.data.$getters.ele_cards[cardType].imageUrl : null
      //console.log('imageUrl', imageUrl)
      if (this.data.indexCard && this.data.indexCard.length && this.data.indexCard[0].buscard && this.data.indexCard[0].buscard.coverImg) imageUrl = this.data.indexCard[0].buscard.coverImg
      //console.log('imageUrl', imageUrl)
      this.setData({
        imageUrl: imageUrl,
        showDetail:cardStatus=='received'
      })
      if(cardStatus=='noReceive') {
           my.confirm({
        title: '温馨提示',
        content: `未申领${cardTitle}，跳转领卡页面领卡`,
        confirmButtonText: '马上领卡',
        cancelButtonText: '暂不需要',
        success: (result) => {
          if (result.confirm) {          
            jumpToBusCode(cardType)
          }else {
            my.reLaunch({url:'/pages/index/index'})
          }
        },
      })

      }
    } catch (err) {
      console.error(err)
    }
  },
  onReady() {
  },
  handleClick(e) {
    let obj = e.currentTarget.dataset.obj
    if (!obj) {
      console.warn('handleClick dataset obj is undefine')
      return
    }
   /* app.Tracker.//click(e.currentTarget.dataset.obj.text, {
      target: JSON.stringify(e.currentTarget.dataset.obj)
    })*/
    this.handleNavigate(e.currentTarget.dataset.obj)
  },

  // 切换卡面
  handleModifyCard(e) {
    console.log(e)
   /* app.Tracker.//click(e.currentTarget.dataset.obj.text, {
      target: JSON.stringify(e.currentTarget.dataset.obj)
    })*/
    //card_type
    e.currentTarget.dataset.obj.url_path += `?card_type=${this.data.cardType}&cardId=${this.data.cardNo}`
    //e.currentTarget.dataset.obj.url_path = `${e.currentTarget.dataset.obj.url_path}?activity=${e.currentTarget.dataset.activity.activity_id}`
    this.handleNavigate(e.currentTarget.dataset.obj)
  },
  // 充值
  handleRecharge(e) {
    console.log(e.currentTarget.dataset)
    /*app.Tracker.//click(e.currentTarget.dataset.obj.text, {
      target: JSON.stringify(e.currentTarget.dataset.obj)
    })*/
    this.handleNavigate(e.currentTarget.dataset.obj)
  },
  // 监听弹框信息
  handleInformation(e) {
    // data-info
    let infoContent = e.currentTarget.dataset.info
    this.setData({
      showInfo: true,
      infoContent: infoContent
    })
  },
  // 监听弹框
  handlemodal() {
    this.setData({
      showInfo: false,
      infoContent: "",
    })
  },
  // 监听卡
  handleCard(e) {
    console.log(e.detail.current)
    this.setData({
      activeTab: e.detail.current
    })
  },
  // 监听协议
  handleAgreement(e) {
   // app.Tracker//.click(e.currentTarget.dataset.obj.title)
    this.handleNavigate(e.currentTarget.dataset.obj)
    /*
    my.navigateTo({
      url: `/pages/webview/webview?url=${e.currentTarget.dataset.obj.url_path}`
    })*/
  },
  // 监听菜单
  handleMenuItem(e) {
    /*app.Tracker//.click(e.currentTarget.dataset.obj.text, {
      target: JSON.stringify(e.currentTarget.dataset.obj)
    })*/
    this.handleNavigate(e.currentTarget.dataset.obj)
  },
  // 关闭协议弹框
  onPopupClose() {
    this.setData({
      showTop: false
    })
  },
  async handleNavigate(options) {
    let url = options.url_path ? options.url_path.split('?') : options.url_path
    console.log(options.url_type, options.url_path)
    switch (options.url_type) {
      case 'self':
        my.navigateTo({
          url: options.url_path
        })
        break
      case 'selfWebview':
      {
       let url_path = '/pages/webview/webview?url=' + encodeURIComponent(options.url_path)
        my.navigateTo({
          url: url_path
        })}
      break
      case 'balanceSmkOut':
        console.log('跳转查看余额', app.account, this.data.account)
        if (!this.data.account) {
          await this.getAccount()
        }
        app.specialUrl = `${options.url_path}?status=${app.account.status}&money=${app.account.wmoney}`
        my.call('startApp', {
          appId: '20000067',
          param: {
            url: app.specialUrl,
            chInfo: 'ch_2019031163539131'
          }
        })
        break
      case 'balanceSmk':
        console.log('跳转查看余额', app.account, this.data.account)
        if (!this.data.account) {
          await this.getAccount()
        }
        app.specialUrl = `${options.url_path}?status=${app.account.status}&money=${app.account.wmoney}`
        my.navigateTo({
          url: `/pages/webview/webview?special=1`
        })
        break
      case 'smk':
        if (url.length > 1) {
          app.specialUrl = `${options.url_path}&token=${app.token}&channel=${app.channel}&userId=${app.alipayId}`
        } else {
          app.specialUrl = `${url}?token=${app.token}&channel=${app.channel}&userId=${app.alipayId}`
        }
        console.log(app.specialUrl)
        my.navigateTo({
          url: `/pages/webview/webview?special=1`
        })
        break
      case 'smkOut':
        if (url.length > 1) {
          app.specialUrl = `${options.url_path}&token=${app.token}&channel=${app.channel}&userId=${app.alipayId}`
        } else {
          app.specialUrl = `${url}?token=${app.token}&channel=${app.channel}&userId=${app.alipayId}`
        }
        console.log(app.specialUrl)
        my.call('startApp', {
          appId: '20000067',
          param: {
            url: app.specialUrl,
            chInfo: 'ch_2019031163539131'
          }
        })
        break
      case 'agreement':
        this.setData({
          showTop: true,
          agreement_url: options.agreement_url || []
        })
        break
      case 'startApp':
        my.call('startApp', {
          appId: (options.appId || '20000042'),
          param: {
            publicBizType: options.publicBizType,
            publicId: options.publicId,
            chInfo: options.chInfo
          }
        })
        break
      case 'alipay':
        console.log(options.url_path)
        my.ap.navigateToAlipayPage({
          path: options.url_path,
          fail: (err) => {
            my.alert({
              content: JSON.stringify(err)
            })
          }
        })
        break
      case 'miniapp':
        // console.log('跳转', options)
        my.navigateToMiniProgram({
          appId: options.url_remark,
          path: options.url_path,
          extraData: options.url_data || {},
            fail:(res)=>{
                let {globalData} = getApp()
                my.reportAnalytics("jsapi_fail",{
                  api:"navigateToMiniProgram",
                  file:"cardDetail/index.js/handleNavigate",
                  timestamp:+Date.now(),
                  extra:JSON.stringify(options),
                  appId:options.url_remark,
                  path:options.url_path,
                  userId:globalData.userId,
                  err:JSON.stringify(res)})
              }
        })
        break
      case 'unregister': {
        /*
        if (this.data.status === state.ACTIVE) {
          my.confirm({
            title: '提示',
            content: '确定退卡？',
            success: (res) => {
              if (res.confirm) {
                busService.unregister().then(autoErrorPage(({ data }) => {
                  console.log('unregister====>', data);
                  const u = makeUrl(options.url_path, { successTips: data });
                  my.navigateTo({ url: u });
                }), autoMiniErrorPage());
              }
            },

          });
        } else*/ {
          my.navigateTo({ url: options.url_path });
        }
      } break
      case 'none':
      case '':
        break
      default:
        break
    }
  },
});
