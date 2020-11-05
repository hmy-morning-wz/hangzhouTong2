// @ts-ignore
import { GlobalStore } from 'herculex'
// @ts-ignore
import { getCardInfo } from './components/card-component/utils/'
// @ts-ignore
import busService from './pages/card/service/busService'
// @ts-ignore
import card from './services/getCardInfo'
// @ts-ignore
import Utils from './pages/card/utils/Utils'
// @ts-ignore
import CONFIG from './services/config'
// @ts-ignore
import pageJson from './services/pageJson'
import common from './utils/common'
const timeEn = false
export default new GlobalStore({
  state: {    
    pageJson: {},
    cardStatus: true,
    normalCardInfo: null,
    ele_cards: {},
    ele_card_types: [],
    cardListStatus: {},
    account: null,
    monthCardInfo: null,
    //normalCardStatus: false, // 是否领卡
    //monthCardStatus: false, // 是否领卡
    cardRelativeTarget: {},
    homeIcon: null,
    travelIcon: []
  },
  mutations: {
    /*
    MONTH_CARD_INFO: (state: { monthCardInfo: any; monthCardStatus: boolean }, cardInfo: { cardModels: string | any[] }) => {
      //console.log('设置月卡卡片信息', cardInfo)
      state.monthCardInfo = cardInfo
      if (cardInfo.cardModels && cardInfo.cardModels.length > 0) {
        state.monthCardStatus = true
      }
    },
    NORMAL_CARD_INFO: (state: { normalCardInfo: any; normalCardStatus: boolean }, cardInfo: { cardModels: string | any[] }) => {
      //console.log('设置普通卡片信息', cardInfo)
      state.normalCardInfo = cardInfo
      if (cardInfo.cardModels && cardInfo.cardModels.length > 0) {
        state.normalCardStatus = true
      }
    },*/

    CARD_INFO: (state:any, cardInfo:any) => {
      //console.log('设置卡片信息 CARD_INFO', JSON.stringify(cardInfo))
      let app:any = getApp()
      let t: any = {}
      if (cardInfo && cardInfo.data) {
        let cardType = cardInfo.cardType
        let data = cardInfo.data
        t.cardTitle = data.cardTitle
        t.cardType = cardType
        t.balanceMode = data.balanceMode
        t.cardLogo = data.styleConfig && data.styleConfig.logoUrl
        t.imageUrl = data.styleConfig && data.styleConfig.imageUrl
        t.applyUrl = data.extInfo && data.extInfo.cardApplyUrl
        t.status = data.cardModels && data.cardModels.length > 0 ? 'received' : 'noReceive'
        t.cardNo = data.cardModels && data.cardModels.length > 0 ? data.cardModels[0].cardNo : ''
        app.globalData.cardNo = t.cardNo
        state.ele_cards[cardType] = t
        if (data && data.cardModels && data.cardModels.length > 0) {
          state.cardListStatus[cardType] = true
        }
      } else {
        let cardType = cardInfo.cardType
        state.ele_cards[cardType] = {}
      }

    },
    CARD_BALANCE: (state: { account: any }, account: any) => {
      //console.log('设置普通卡片余额', account)
      state.account = account
    },
    UPDATE_SYSTEM: (state: { systemInfo: any }, sys: any) => {
      //console.log('设置系统信息', sys)
      state.systemInfo = sys
    },
   
    SET_PAGE_JSON: (state: { pageJson: { [x: string]: any } }, payload:any) => {
      let app: any = getApp();
      payload.data?.forEach((res:any) => {
        state.pageJson[res.pageUrl] = common.replaceJSON(res.data, app.replaceConfig)
      });      
    },
    SET_COVER_IMAGE: (state: { coverImg: { [x: string]: any } }, res: { cardType: string | number }) => {
      state.coverImg[res.cardType] = res
    },
    SET_HOME_ICON: (state: { homeIcon: any }, res: any) => {
      state.homeIcon = res
    },
   
    SET_HOME_PAGE: (state:any, payload: any) => {
      state.cardRelativeTarget = payload.cardRelativeTarget
      state.travelIcon =  payload.travelIcon
    },

  },
  /*plugins: ['logger'],*/
  actions: {
    async getCardInfoStorage({ commit }: any) {
      console.log('getCardInfoStorage')
      let app: any = getApp()
      let globalData = app.globalData
      let cardList = app.cardList
      if (cardList && cardList.length >= 1) {
        let card = cardList[0]
        if (card && card.cardType) {
         let res =  await globalData.get('CARD_INFO_' + card.cardType)
         res  && (app.replaceConfig.cardName = res.cardTitle)
         
         res && commit('CARD_INFO', { cardType: card.cardType, data: res })
         /* my.getStorage({
            key: 'CARD_INFO_' + card.cardType,
            success: (res: any) => {
              console.log('getStorage success', res)
              res && res.data && (app.replaceConfig.cardName = res.data.cardTitle)
               res.data && commit('CARD_INFO', { cardType: card.cardType, data: res.data })
            },
            fail: () => {
            
            }
          })*/
      
        }
      }

      if (cardList && cardList.length >= 2) {
        let card = cardList[1]
        if (card && card.cardType) {
        /*  my.getStorage({
            key: 'CARD_INFO_' + card.cardType,
            success: (res) => {
              console.log('getStorage success')
               res.data && commit('CARD_INFO', { cardType: card.cardType, data: res.data })
            }
          })*/
         let res = await  globalData.get('CARD_INFO_' + card.cardType)  
         res && commit('CARD_INFO', { cardType: card.cardType, data: res })

        }
      }
    },
    /**
     * 获取公交卡信息
     */
    async getCardInfo({ commit }: any) {
      let app: any = getApp()
      let globalData = app.globalData
      let cardList = app.cardList
     // console.log('获取普通卡信息->', cardList)
      let cardType: any
      try {
        // @ts-ignore
        if (!my.isIDE) {
          if (cardList && cardList.length >= 1) {
            let card = cardList[0]
            if (card && card.cardType) {
              try {
                cardType = card.cardType
                let res
                res = await getCardInfo(card.cardType)
                //console.log('获取普通卡信息成功', res)
                res && (res.balanceMode = card.balanceMode, app.replaceConfig.cardName = res.cardTitle)
                commit('CARD_INFO', { cardType: card.cardType, data: res })
               // commit('NORMAL_CARD_INFO', res)
                  globalData.set('CARD_INFO_' + card.cardType, res, { expire: 1440 * 60000 })
              /*  my.setStorage({
                  key: 'CARD_INFO_' + card.cardType,
                  data: res
                })*/
              } catch (err) {
                app.onTrackerError("getCardInfoFail", err)
                //my.reportAnalytics('getCardInfoFail');                      
              }
            }
          }

          if (cardList && cardList.length >= 2) {
            let card = cardList[1]
            if (card && card.cardType) {
              try {
                let res
                res = await getCardInfo(card.cardType)
                //console.log('获取月卡信息成功', res)
                res && (res.balanceMode = card.balanceMode)
                commit('CARD_INFO', { cardType: card.cardType, data: res })
               // commit('MONTH_CARD_INFO', res)
                globalData.set('CARD_INFO_' + card.cardType, res, { expire: 1440 * 60000 })
               
              } catch (err) {
                console.warn('getCardInfo fail', err)
              }
            }
          }
        }else {
          console.warn("IDE 不能调用getCardInfo 接口,使用MOCK数据")
          const CARD_MOCK:any= [
            {"cardModels":[{"cardNo":"3100700011760410"}],"cardTitle":"杭州通支付宝公交卡","cardType":"T0330100","extInfo":{"cardApplyUrl":"https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017011104993459&auth_skip=false&scope=auth_base&redirect_uri=https%3A%2F%2Fcitysvc.96225.com%2Fexthtml%2FalipayCard%2Fsrc%2Fpages%2Findex.html%3Ftype%3Dindex%26source%3Dalipay%26sence%3Dopen"},"styleConfig":{"imageUrl":"https://gw.alipayobjects.com/mdn/gov_bus_ca/afts/img/A*KbIcR7MxoDsAAAAAAAAAAABkARQnAQ","codeLogo":"","logoUrl":"https://zos.alipayobjects.com/rmsportal/xZpdTVoDJkISGbLQvgEk.png"}},
            {"cardModels":[{"cardNo":"3100700011760410"}],"cardTitle":"杭州通公交月卡","cardType":"T2330100","extInfo":{"cardApplyUrl":"https://gjyp.96225.com/qrCodeMTichet/applyCard.html"},"styleConfig":{"imageUrl":"https://gw.alipayobjects.com/mdn/gov_bus_ca/afts/img/A*KjwwTpUia30AAAAAAAAAAABkARQnAQ","codeLogo":"","logoUrl":"https://gw.alipayobjects.com/zos/rmsportal/OvYIjoCrDMcGtiPLnMwf.png"},"balanceMode":"NONE"}
            ]
          cardList && cardList.length && cardList.forEach((card:any,index:number) => {
            globalData.set('CARD_INFO_' + card.cardType, CARD_MOCK[index], { expire: 1440 * 60000 })
            commit('CARD_INFO', { cardType: card.cardType, data: {... CARD_MOCK[index],cardType:card.cardType} })
          });          
          
        }
         } catch (err) {
        console.error(err)
      }
      },
      async getECH5CardInfo({ commit }: any) {
       try{
        let app:any = getApp()
        if(app.ech5Disabled) {
          console.log("ech5Disabled")
          return
        }
        let cardList = app.cardList
        if( (!cardList) || cardList.length==0) {
          return
        }
        let cardType = cardList[0].cardType
        await busService.reday()
        if (!busService.ctoken) {
          try {
            await busService.getToken()
          } catch (err) {
            console.warn('busService getToken', err)
          }
        }
        if (app.cityCode === '330100') {
          let res = await busService.getHzBalance() //await getApp().getAccount()
          let { balance } = res.data || {}
          let balanceTitle = ""
          if (balance == 0 || balance) {
            balanceTitle = balance + '元'
          }
          res && commit('CARD_BALANCE', { balance: balance, balanceTitle: balanceTitle })
        }
        else {
          if (app.config && !app.config.supportAccount) {
            busService.getConfig('ioc.ebuscard.city.config').then((res: { data: any }) => {
              console.log('ioc.ebuscard.city.config', res.data)
              app.config = res.data
            })
          }

          if (app.cardList && app.cardList.length && app.cardList[0] && (app.cardList[0].balanceMode != 'ALIPAY')) {
            let res = await busService.getCard()
            console.log('获得余额', res)
            if (res.code === 200 && res.data) {
              let hasBind = res.data.hasBind === 'true' || res.data.hasBind === true// || true
              let { cardId, disabled, disabledTips, status } = res.data
              if (res.data.accounts && res.data.accounts.length) {
                let accounts = res.data.accounts.map((acc: { type: number; balance: any; name: any; memo: any }) => {
                  if (acc.type === 1) {
                    let balance = Utils.formatRMBYuanDecimal(acc.balance)
                    return {
                      cardType,
                      type: acc.type,
                      title: acc.name || '电子钱包',
                      balance: +balance,
                      balanceTitle: balance + '元',
                      memo: acc.memo,
                      status,
                      hasBind,
                      cardId,
                      disabled,
                      disabledTips
                    }
                  }
                })
                accounts && accounts.length && commit('CARD_BALANCE', accounts[0])
              } else {
                commit('CARD_BALANCE', {
                  cardType,
                  status,
                  hasBind,
                  cardId,
                  disabled,
                  disabledTips
                })
              }

            }
          }
        }

      } catch (err) {
        console.error(err)
      }
    }
    ,
    async getHomePage({ commit }: any) {
      try {
        timeEn && console.time("time-getHomePage")
        timeEn && console.time("time-getHomePage-getStorageSync")
        let globalData = getApp().globalData
        let local = await globalData.get("HOME_PAGE_JSON") // await common.getStorageSync({ key: `HOME_PAGE_JSON` })
        timeEn && console.timeEnd("time-getHomePage-getStorageSync")
        //console.log('getHomePage getStorageSync', ret)
        // let local = ret  && ret.data && ret.data.data
        let success
        let cardPage
        if (local) {
          success = true
          cardPage = local
        } else {
          timeEn && console.time("time-getHomePage-request")
          let app: any = getApp()
          let res = await CONFIG.getHomePage({ cityCode: app.cityCode })
          let data = res.data
          success = res.success
          if (success && data && data.cardPage) {
            cardPage = common.replaceJSON(data.cardPage, app.replaceConfig) // JSON.parse(data.cardPage)
            //console.log('get H5后台配置', cardPage)
            globalData.set('HOME_PAGE_JSON', cardPage, { expire: 3 * 60000 })
            /*my.setStorage({
              key: `HOME_PAGE_JSON`,
              data: {
                timestamp: Date.now(),
                data: cardPage
              },
              success: (res) => {
               // console.log('H5后台配置 setStorage success')
              }
            })*/
          }
          timeEn && console.timeEnd("time-getHomePage-request")
        }

        timeEn && console.time("time-getHomePage-success")
        if (success && cardPage) {
          //let cardPage = common.replaceJSON(data.cardPage, getApp().replaceConfig) // JSON.parse(data.cardPage)
          //console.log('H5后台配置', cardPage)        

          let ele_icons: any[] = []
          let { all_service_icon, travel_service_icon } = cardPage || {}
          all_service_icon = all_service_icon && all_service_icon.ele_icons
          travel_service_icon = travel_service_icon && travel_service_icon.ele_icons
          all_service_icon && all_service_icon.length && (all_service_icon = all_service_icon.map((t: { icon_name: string | null | undefined }) => {
            return Object.assign({
              card_status: false,
              group_id: 'travel_service',
              icon_id: '_' + common.hashCode(t.icon_name)
            }, t)
          }))
          all_service_icon && all_service_icon.length && (ele_icons = ele_icons.concat(all_service_icon))
          travel_service_icon && travel_service_icon.length && (travel_service_icon = travel_service_icon.map((t: { icon_name: string | null | undefined }) => {
            return Object.assign({
              card_status: true,
              group_id: 'travel_service',
              icon_id: '_' + common.hashCode(t.icon_name)
            }, t)
          }))
          travel_service_icon && travel_service_icon.length && (ele_icons = ele_icons.concat(travel_service_icon))
         //  commit('SET_ICON_LIST', )
          commit('SET_HOME_PAGE', {cardRelativeTarget:cardPage,travelIcon:ele_icons})
        }
        timeEn && console.timeEnd("time-getHomePage-success")
      }
      catch (err) {
        console.error(err)
      }
      timeEn && console.timeEnd("time-getHomePage")
    },
    async getPageJSON({ commit }: any, payload: string|string[]) {
      let app: any = getApp()
      let globalData = app.globalData
      await app.loadUserId()
      let appId = app.appId
      let aliUserId = app.alipayId
      let arr:string[]=[]
      if(Array.isArray(payload)) {
          arr = payload
      }else {
          arr = [payload]
      }
      let result:any=[]
      for(let i=0;i<arr.length;i++)
     {     
      let pageUrl = arr[i]
      timeEn && console.time("time-getPageJSON-" + pageUrl)
      console.log('getPageJSON', pageUrl)
   
      let item = app.extJson.pageJson.filter(common.pageJsonFilter(pageUrl,{userId:aliUserId,...(app.systemInfo||{})}))
      /*((t: { pageUrl: any }) => {
        return t.pageUrl === pageUrl
      })*/
      if (item && item.length > 0) {
        let { locationId, templateId } = item[0]
        let local = null
        let key
        try {
          local = await globalData.get(`PAGE_JSON_${locationId}_${templateId}`) //await common.getStorageSync({ key: `PAGE_JSON_${locationId}_${templateId}` })
          //console.log('getPageJSON getStorageSync', ret)
          //local = ret  && ret.data && ret.data.data
          if(app.preview && locationId ==app.preview.locationId  && templateId==app.preview.templateId) {
              local=null      
              key = app.preview.key          
          }
          if (local) {
            result.push( {
              pageUrl,
              data: local
            })
            //commit('SET_PAGE_JSON',)
            /*
            pageJson.queryPageJson({ appId, aliUserId, locationId, templateId }).then((res: { success: any; data: any }) => {
              console.log('getPageJSON queryPageJson then', res)
              if (res && res.success && res.data) {
                commit('SET_PAGE_JSON', {
                  pageUrl,
                  data: res.data
                })
                globalData.set(`PAGE_JSON_${locationId}_${templateId}`, res.data, { expire: 30 * 60000 })            
              }
            })*/
            console.log('getPageJSON use Storage')
            timeEn && console.timeEnd("time-getPageJSON-" + pageUrl)
            continue
          }
        } catch (err) {
          console.warn(err, 'getStorageSync fail')
        }

        let res = await pageJson.queryPageJson({ appId, aliUserId, locationId, templateId,key })
        console.log('getPageJSON queryPageJson await', res)
        if (res && res.success && res.data) {
            result.push( {
              pageUrl,
              data: res.data
            })
         /* commit('SET_PAGE_JSON', {
            pageUrl,
            data: res.data
          })*/
          /*
          my.setStorage({
            key: `PAGE_JSON_${locationId}_${templateId}`,
            data: {
              timestamp: Date.now(),
              data: res.data
            },
            success: (res) => {
              console.log('getPageJSON setStorage success')
            }
          })*/
          globalData.set(`PAGE_JSON_${locationId}_${templateId}`, res.data, { expire: 30 * 60000 })
        } else if (local) {
          console.log('getPageJSON queryPageJson fail use local')
          result.push( {
              pageUrl,
              data: local
            })
          /*commit('SET_PAGE_JSON', {
            pageUrl,
            data: local
          })*/
        }
        //return res
      } else {
        console.warn('getPageJSON no config ', pageUrl)
      }
      timeEn && console.timeEnd("time-getPageJSON-" + pageUrl)
       }
      commit('SET_PAGE_JSON',{data:result})
    }
    , async getIndexCard({ commit }: any) {
      try {
        let app: any = getApp()
        await app.loadUserId()
        let cardInfo = { pid: `${app.CONFIG.normal.cardType}`, userId: app.alipayId }
        let buscardInfo = await card.getIndexCard(cardInfo);
        if (buscardInfo && buscardInfo.length) {
          let buscard = buscardInfo[0].buscard// || { coverImg: 'https://gw.alipayobjects.com/zos/rmsportal/oWXlTlCclYVcUhsBpvcf.png' }
          if (buscard && buscard.coverImg) {
            commit('SET_COVER_IMAGE', {
              cardType: app.CONFIG.normal.cardType,
              coverImg: buscard.coverImg
            })
            my.setStorage({
              key: `COVER_IMAG_${app.CONFIG.normal.cardType}`,
              data: {
                timestamp: Date.now(),
                data: buscard.coverImg
              }
            })
          } else {
            commit('SET_COVER_IMAGE', {
              cardType: app.CONFIG.normal.cardType,
              coverImg: null
            })
            my.setStorage({
              key: `COVER_IMAG_${app.CONFIG.normal.cardType}`,
              data: {
                timestamp: Date.now(),
                data: null
              }
            })
          }
        }
      } catch (err) {
        console.warn('getIndexCard err ', err)
      }
    }
    ,
    async setDefaultHomeIcon({ commit }: any, icons: any[]) {
      timeEn && console.time("time-setDefaultHomeIcon")
      icons = icons.filter((t1: null) => (t1 != null))
     // icons = icons && icons.slice(0, 4)
      commit('SET_HOME_ICON', icons)
      timeEn && console.timeEnd("time-setDefaultHomeIcon")
    },
    async setHomeIcon({ commit }: any, icons: any[]) {
      icons = icons.filter((t1: null) => (t1 != null))
      //icons = icons && icons.slice(0, 4)
      let globalData = getApp().globalData
      globalData.set('HOME_ICON', icons,{ expire: 30 * 60000 })
      /*   
      await common.setStorageSync({
        key: 'HOME_ICON',
        data: {
          timestamp: Date.now(),
          data: icons
        }
      }) */
      commit('SET_HOME_ICON', icons)
    },
    async loadHomeIcon({ commit }: any) {
      //let res = await common.getStorageSync({ key: 'HOME_ICON' })
      let globalData = getApp().globalData
      let res = await globalData.get("HOME_ICON")
      if (res) {
        let icons =res// res.data.data.filter((t1: null) => (t1 != null))
        commit('SET_HOME_ICON', icons)
      } else {
        //commit('SET_HOME_ICON', null)
      }
    }

  }
  // actions

})
