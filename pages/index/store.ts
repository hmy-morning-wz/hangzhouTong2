// @ts-ignore
import Store from 'herculex'
import * as services from "./services/acitivty"
import common from '../../utils/common'
//import CONFIG from '../../services/config'
//import INDEX from './gridData'
// import BASE from '../../utils/config'
// @ts-ignore
import { getCardInfo } from '/components/card-component/utils/'
// @ts-ignore
import busService from '/pages/card/service/busService'
// @ts-ignore
import Utils from '/pages/card/utils/Utils'
// @ts-ignore
import { getPopContent } from './popup'
// @ts-ignore
import pageJson from '../../services/pageJson'
// @ts-ignore
import CONFIG from '/services/config'
// @ts-ignore
import HEALTHCONFIG from '/services/healthGold'
import { getUserId } from '../../utils/TinyAppHttp'
/*
import servicesCreactor from "../../utils/serviceCreator"
import * as services from "../../services/acitivty"
import serviceplugin from "../../utils/serviceplugin"*/
 const timeEn = false
 //@ts-ignore
 const { serviceplugin,servicesCreactor,herculex:Store} = getApp()
 const activityIdDefault = 93
const CodeMap:{[x:string]:string}= {
   //"BusCoupons",//"NONE",//"LinkCoupons",//"BusCoupons",
   "1":"BusCoupons", 
   "2":"BusCoupons",
   "3":"LinkCoupons",
   "99":"NONE", 
}
export default new Store({
  connectGlobal: false, // 是否关联global
  state: {
    card:true,
    eleCards:[/*{
      cardTitle: '杭州通支付宝公交卡',
      cardType: 'T0330100',
      balanceMode: 'NORMAL',
      cardLogo: 'https://zos.alipayobjects.com/rmsportal/xZpdTVoDJkISGbLQvgEk.png',
      imageUrl: 'https://gw.alipayobjects.com/mdn/gov_bus_ca/afts/img/A*KbIcR7MxoDsAAAAAAAAAAABkARQnAQ',
      applyUrl: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017011104993459&auth_skip=false&scope=auth_base&redirect_uri=https%3A%2F%2Fcitysvc.96225.com%2Fexthtml%2FalipayCard%2Fsrc%2Fpages%2Findex.html%3Ftype%3Dindex%26source%3Dalipay%26sence%3Dopen',
      status: 'received',
      cardNo: '3100700011760410',
    },{
      cardTitle: '杭州通公交月卡',
      cardType: 'T2330100',
      balanceMode: 'NONE',
      cardLogo: 'https://gw.alipayobjects.com/zos/rmsportal/OvYIjoCrDMcGtiPLnMwf.png',
      imageUrl: 'https://gw.alipayobjects.com/mdn/gov_bus_ca/afts/img/A*KjwwTpUia30AAAAAAAAAAABkARQnAQ',
      applyUrl: '',
      status: 'noReceive',
      cardNo: '',
    }*/],
    // mormalCard: INDEX.ele_page_home.ele_box_card.ele_cards[0],
    // monthCard: INDEX.ele_page_home.ele_box_card.ele_cards[1],
    // iconList: INDEX.ele_page_home.ele_box_icon,
    //  post: INDEX.ele_page_home.ele_notice,
    //  homePage: INDEX
      cardMark:{

    },
    ele_cards:{},
    ele_box_icon:[],
    signList: {},
    permission: false,
    permissionHasLoad:false,
    healthSet:{},
    circleRecommend:{},
    humantohumanSet:{},
    banner2List:{},
    bannerList:{},
    adFeedsPluginSet:{},
    activityId:activityIdDefault
  },

  plugins: ['logger', serviceplugin()],
  services: servicesCreactor(services),
  mutations: {
     LIST_DATA: (state:any, config:any) => {
      state.signList = JSON.parse(JSON.stringify(config))
    },
    PREMISSION: (state:any, config:any) => {
      state.permission = config
      state.permissionHasLoad = true 
    },
    ELE_CARD:(state:any,{eleCards}:any)=>{
      state.eleCards =eleCards
    },
     CARD_BALANCE: (state: any, account: any) => {
      state.account = account
    },
    UPDATE_CARD_INFO:(state: any, payload: any)=>{
      let {cardMark,eleCards,ele_box_icon} = payload
      state.cardMark = cardMark
      state.eleCards = eleCards
      state.ele_box_icon = ele_box_icon
    },
    CARD_INFO: (state:any, payload:any) => {
      //console.log('设置卡片信息 CARD_INFO', JSON.stringify(cardInfo))
     // let keys = Object.keys(payload)
      let app = getApp()
      for(let key in payload) {
      let cardInfo = payload[key]
      let t: any = {}
       let ele_cards  = {... state.ele_cards}
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
        //state.ele_cards[cardType] = t
        ele_cards[cardType] = t;
        state.ele_cards = ele_cards
       // if (data && data.cardModels && data.cardModels.length > 0) {
        //  state.cardListStatus[cardType] = true
       // }
      } else {
        let cardType = cardInfo.cardType
        cardType && (state.ele_cards[cardType] = {})
      }
      }

    },
  },
  actions: {
    async getThisWeekSign({state,commit}: any) {
      let health = state.getIn('health')
      if(!health) {
        console.warn("健康金模块开关关闭")
        return
      }
      // @ts-ignore
      const {success:userId} = await getApp().loadUserId();
      const  params = {
        userId: userId,
      }
      const { success, data } = await HEALTHCONFIG.getThisWeekSign(params)
      if (success) {
        commit('LIST_DATA', JSON.parse(JSON.stringify(data)))
      }else{
         commit('LIST_DATA', [])
      }
    },
    async getAdmit({state,commit}: any) {
       let health = state.getIn('health')
      if(!health) {
        console.warn("健康金模块开关关闭")
        return
      }
      // @ts-ignore
      const {success:userId} = await getApp().loadUserId();
      const { success, data } = await HEALTHCONFIG.getAdmit(userId)
      if (success) {
         commit('PREMISSION', data)
      }else{
         commit('PREMISSION', false)
      }
    },
    async pageOnLoad({ state, dispatch, commit   }: any) {

      //dispatch('$global:getCardInfoStorage').then(()=>{
       //  dispatch('updateCard')
      //})
      //
     // 投放 index icon home =》 首页刷新
     // 卡rpc => 卡面刷新， 余额接口 -》 更新余额
     //
      timeEn && console.time("time-pageOnLoad")
      timeEn && console.time("time-pageOnLoad-1")
      let app:any = getApp()
      await app.globalData.reday()
      timeEn && console.timeEnd("time-pageOnLoad-1")
      timeEn && console.time("time-pageOnLoad-2")
      rpcCardInfo().then((res)=>{
        console.log("rpcCardInfo",res)
        commit("CARD_INFO",res)
        dispatch('updateCardInfo')
      })
      getHomePage() 

      let p:any=[
        getPageJSON('pages/index/index'),
        getPageJSON('pages/icon/index'),
        common.getSystemInfoSync(),
        app.loadUserId()
        ]
      let res = await Promise.all(p)
       timeEn && console.timeEnd("time-pageOnLoad-2")
      //console.log("res",res)
      //{cardRelativeTarget:cardPage,travelIcon:ele_icons}
      await dispatch("pageOnNextLoad",res)
      timeEn && console.timeEnd("time-pageOnLoad")
    },
    async pageOnNextLoad({ state, commit ,dispatch  }: any,playlod:any){
      timeEn && console.time("time-pageOnNextLoad")
      timeEn && console.time("time-pageOnNextLoad-1")
      let  curpage =playlod[0] && playlod[0].data || {} //global.getIn(['pageJson', 'pages/index/index'],{})
      let iconPage = playlod[1] && playlod[1].data || {}

      let app:any = getApp()
      let globalData =  app.globalData
      let {bizScenario,version} = globalData
      let examine = (curpage['auditminiapp']==version)
      if(examine) {
        app.Tracker &&app.Tracker.Mtr && (app.Tracker.Mtr.stat_auto_expo=false)
      }
      let circleRecommend = curpage['circleRecommend'] || {}
      circleRecommend.appId =  circleRecommend.appId || '2019062165635711' //添加默认appId 配置
      //let cardMark = updateCardmark({state})
      //{ele_cards,travelIcon,iconPage}

      //let  eleCards = updateCard({state})
        //
        let popup =   curpage.popup
          curpage.popup = null
      let systemInfo = await common.getSystemInfoSync()
      let banner2List = curpage['banner2List']
      if(banner2List && banner2List.length) {
          banner2List = banner2List.map((t:any)=>{
            t.image = common.crossImage(t.image,{width:440,height:240,systemInfo:systemInfo})
            return t
          })
      }
      let humantohumanSet = curpage['humantohumanSet']
      
      if(humantohumanSet && humantohumanSet.image) {
          humantohumanSet.image = common.crossImage(humantohumanSet.image,{width:686,height:200,systemInfo:systemInfo})
      }
       let {drawTag, draw} =curpage
       let tagMatch = false
       //@ts-ignore
       let {Tracker} = getApp()
       let tagOption:any = {userId:globalData?.userId}
      if ( draw =="ON" && drawTag && drawTag.length) {
        for (let i = 0; i < drawTag.length; i++) {
          try {
            if (tagMatch) {
              break
            }
            let reg = new RegExp(drawTag[i])
            for (let key in tagOption) {
              if (reg.test(tagOption[key])) {
                console.log("match", drawTag[i], key, tagOption[key])
                tagMatch = true
                Tracker&&Tracker.setData && Tracker.setData("userTag",tagMatch)
                commit("tagMatch",{tagMatch})
                break
              }
            }
          } catch (e) {
            console.warn(e)
          }
        }
      }  
      commit("pageOnLoad", {
        ... curpage,        
        curpage,
        iconPage,
        bizScenario,
        examine,
        card:true,
        page_title:curpage['page_title'],
        lifestyle:(!examine) && checkSwitch(curpage["lifestyle"],'ON',false),
        icon:checkSwitch(curpage["icon"],'ON',true), //curpage["icon"]=='ON',
        banner:checkSwitch(curpage["banner"],'ON',false), //curpage["banner"]=='ON',
        humantohuman:checkSwitch(curpage["humantohuman"],'ON',false),
        health:(!examine) && checkSwitch(curpage["health"],'ON',false), //curpage["health"]=='ON',
        banner2:checkSwitch(curpage["banner2"],'ON',false), //curpage["banner2"]=='ON',
        circleRecommendItem:(!examine) && checkSwitch(curpage["circleRecommendItem"],'ON',false), //curpage["circleRecommendItem"]=='ON',
        adFeedsPlugin:(!examine) && checkSwitch(curpage["adFeedsPlugin"],'ON',false),
        circleRecommend,
        humantohumanSet,
        banner2List,
        systemInfo
        //eleCards
      })
      // @ts-ignore
      dispatch("getAdmit")
      dispatch("getThisWeekSign")
      timeEn && console.timeEnd("time-pageOnNextLoad-1")
      if(examine) { //审核中，下面不执行
        dispatch('updateCardInfo')
        timeEn && console.timeEnd("time-pageOnNextLoad")
        return
      }
      timeEn && console.time("time-pageOnNextLoad-2")
      if(draw =="ON") {
       let activityId = activityIdDefault
       dispatch("$service:checkTag")
       dispatch('$service:getZZLotteryMsg',{activityId}) 
      }
      if ( popup) {      
       getPopContent({ userId: globalData.userId, appId: globalData.appId, cityCode: globalData.cityCode, list: popup }).then((pop:any)=>{
           if (pop) {
            commit("popupWindow", { modalOpened: true, popupWindow: pop,popup:{imageLoad:true,showClose:true,hiddenButton:false} })
         }
      })       
      }
    
      getHomePage().then((homepage)=>{
         let {cardRelativeTarget,travelIcon} = homepage || {}
         commit("homepage", {cardRelativeTarget,travelIcon})
         getECH5CardInfo().then((res)=>{// 更新余额等
          commit('CARD_BALANCE', res)
          dispatch('updateCardInfo') //更新卡面
         }) 
      
      })

      timeEn && console.timeEnd("time-pageOnNextLoad-2")
      timeEn && console.timeEnd("time-pageOnNextLoad")
    },



    async getCardInfo({ state, dispatch, commit   }: any) {
     let p= [ rpcCardInfo(), getECH5CardInfo()]
     try{
     let res =  await Promise.all(p)
      commit("CARD_INFO",res[0])
      commit('CARD_BALANCE', res[1])
     }catch(e){console.error("getCardInfo catch err",e)}
      dispatch('updateCardInfo')
      //dispatch('updateCard')

    },

  async updateCardInfo({ state, dispatch, commit   }: any) {
      let ele_cards = state.getIn(['ele_cards'],{})
      let travelIcon = state.getIn(['travelIcon'],[])
      let iconPage = state.getIn(['iconPage'],{})
    let ele_box_icon = loadHomeIcon({ ele_cards, travelIcon, iconPage })
    if (ele_box_icon && ele_box_icon.length) {
      let systemInfo = state.getIn(['systemInfo'])
      ele_box_icon = ele_box_icon.map((item: any) => {
        item.icon_img = common.crossImage(item.icon_img, { width: 56, height: 56, systemInfo })
        return item
      })
    }
    let cardMark = updateCardmark({ state })
    let eleCards = updateCard({ state })

      commit("UPDATE_CARD_INFO",{cardMark,eleCards,ele_box_icon})
  },

   updateUserTag({state,commit,dispatch}:any) {
      console.log("checkTag")
      let result = state.getIn(['$loading', 'checkTag'])     
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') {
        let data = state.getIn(['$result', 'checkTag'])          
        if(data && +data === 1 ) {       
           let tagMatch = true 
           commit("checkTag",{tagMatch })
           //@ts-ignore
           let {Tracker} = getApp()
           Tracker&&Tracker.setData && Tracker.setData("userTag",tagMatch)
        }
      } 
    },
    updateZPrizeList({state,commit,dispatch}:any) {
      console.log("updateZPrizeList")
      let result = state.getIn(['$loading', 'getZZPrizeList'])     
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') {
        let prizeList = state.getIn(['$result', 'getZZPrizeList'])          
        if(prizeList && prizeList.length) {
          prizeList = prizeList.map(({picture:icon,name,type,activityId,id}:any)=>{ return {name:id,icon,activityId,type}  })
           commit("prizeList",{prizeList,prizeName:prizeList[0].name,currentIndex:0 })
        }
      }        
      let activityId = state.getIn(['activityId'])   
      activityId && dispatch('$service:getZZLotteryMsg',{activityId}) 
    },
    updateRemainLottery({state,commit}:any) {
      console.log("updateRemainLottery")
      let result = state.getIn(['$loading', 'getZZLotteryMsg'])     
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') {        
        let remainLotteryNumber = state.getIn(['$result', 'getZZLotteryMsg','remainLotteryNumber'],0)          
         commit("remainLotteryNumber",{remainLotteryNumber,disabled:false/*!remainLotteryNumber*/ })
         //@ts-ignore
         let {Tracker} = getApp()
         Tracker&&Tracker.setData && Tracker.setData("remainLotteryNumber",remainLotteryNumber)
      } 
    },
    updatePrizeResult({state,commit}:any) {
      console.log("updateRemainLottery")
      let result = state.getIn(['$loading', 'getPrize'])     
      if ((!result.isLoading) && result.type === 'SUCCESS'  && result.code == '20000') {  
        let textMap= {"BusQrcode":"去乘车","Guidance":"明日快速抽奖通道",...  state.getIn(['textMap'],{})    }
        let res:{[key:string]:string} = state.getIn(['$result', 'getPrize'],{}) 
        /**
         *   typeClass:"modal-type",
       money:7,
       name:"乘车券",
       text1:"乘公交车自动抵扣",
       title:"别灰心，明天再来~",//"恭喜你抽中",
       button1Action:"BusQrcode",
       button2Action:"Guidance",
       button1:"去乘车",
       button2:"明日快速抽奖通道",
       type:"BusCoupons",//"NONE",//"LinkCoupons",//"BusCoupons",

         */
         let type1 = res.type
         res.type = CodeMap[""+res.type]
         res.type1 =type1
         let moneyLen=0
         let {amount:money,content} = res
         if(res.type=="BusCoupons") {
           res.title=textMap["BusCouponsTitle"] ||"恭喜你抽中"
           res.button1Action="BusQrcode"
           res.button2Action="Guidance"
           if(type1=='1'){
             res.text1="乘公交车自动抵扣"
           }else {
             res.text1='使用时自动抵扣'
           }
           if(money) {
              moneyLen = (""+money).length
              if(moneyLen>4) moneyLen = 4
           }
         } else if(res.type=="LinkCoupons") {
           res.title=textMap["LinkCouponsTitle"] ||"别灰心，明天再来~"
           res.button2Action="BusQrcode"          
           res.button1Action="Guidance"
           if(typeof content == 'string' && content.indexOf("{")>-1) {
             try{
             content = JSON.parse(content)
             res = Object.assign(res,content)
             }catch(err){

             }
           }else if(typeof  content == 'object') {
              res = Object.assign(res,content)
           }
         }else if(res.type=="NONE") {
           res.title=textMap["NoneTitle"] || "今日次数已用完，明天再来~"
           res.button2Action="BusQrcode"          
           res.button1Action="Guidance"
         }
         res.button1 = textMap[res.button1Action]
         res.button2 = textMap[res.button2Action]
         commit("UPDATE_PRIZE_RESULT",{prizeResult:{typeClass:"modal-type",money,moneyLen,success:true,...res}   })
      } else {
        commit("UPDATE_PRIZE_RESULT",{prizeResult:{success:false ,type:"NONE",title:"别灰心，明天再来~"} })
        
      }
    }




  }
})

   function updateCard({ state   }: any){

      let app:any =getApp()
      let cardList = app.cardList
     let eleCards:any =  []
      if(cardList && cardList.length) {
           let ele_cards =state.getIn('ele_cards',{})
           //console.log("updateCard ele_cards",ele_cards,cardList)
           if(Object.keys(ele_cards).length) {
              eleCards =cardList.map((t:any)=>{
               let c = { ...ele_cards[t.cardType] ,...t }
               c.balanceMode =  c.balanceMode=='NORMAL' || c.balanceMode=='NORAML'
               let account = state.getIn('account',{})
               if(c.balanceMode) {
                 let {balance,balanceTitle,hasBind} = account
                 Object.assign(c,{balance,balanceTitle,hasBind})
               }
               return c
             })
              //console.log("updateCard eleCards",eleCards)
             //commit("ELE_CARD",{eleCards})
           }
      }
      return eleCards
    }

function loadHomeIcon({ele_cards,travelIcon,iconPage}:any) {
    //timeEn && console.time("time-loadHomeIcon")
    //
    let homeIcon:any =[] //getters.getIn('defaultIcon',[])
    let pageJson:any =iconPage// state.getIn(['iconPage'],{})
      //let travelIcon = state.getIn(['travelIcon'],[])
      if (pageJson || (travelIcon && travelIcon.length)) {
        let ele_icons = pageJson.ele_icons || []
        if(travelIcon&& travelIcon.length) {ele_icons = ele_icons.concat(travelIcon)}
        if (ele_icons && ele_icons.length) {
          console.log("HomeIcon ele_icons",ele_icons.length/*,ele_icons*/)
          ele_icons = ele_icons.map((t: any,index:number) => { 
            if(!t.priority) {
              t.priority = 0
            }else  {
                 t.priority = +t.priority
            }
            t.index = index
            t.icon_id = t.icon_id ||'_' + common.hashCode(t.icon_name); 
            return t 
          })
          ele_icons=  ele_icons.filter((t: { default_home: string | boolean }) => (t.default_home === 'true' ||  t.default_home ===true ||  t.default_home ==='1')  )
          ele_icons = ele_icons.sort((t1: any, t2: any) => {
           if(t2.priority==t1.priority) {
             return t1.index - t2.index
           }
           return ((t2.priority||0) - (t1.priority||0) )
          }
            )
          homeIcon =  ele_icons//.slice(0, 4)
          console.log("HomeIcon defaultIcon filter",ele_icons.length/*,ele_icons*/)
        }
      }else {
        console.log("HomeIcon defaultIcon NONE")
      }
    //await dispatch('$global:setHomeIcon', homeIcon)

    let app:any =getApp()
    //let homeIcon =global.getIn('homeIcon',[])
    //////
    // let ele_cards:any =state.getIn('ele_cards',{})

    if (homeIcon && homeIcon.length) {
      homeIcon = homeIcon.filter((t:any) => {
        let match = false
        if (t.card_type) {
          t.card_type.forEach( (card_type:any) => {
            if (ele_cards && ele_cards[card_type] && ele_cards[card_type].status === 'received') {
              match = true
            }
            //  if( (card_type === ele_cards_key[0] || (ele_cards_key.length >= 2 && card_type === ele_cards_key[1]))) match = true
          })
        } else if (t.card_status) {
          let card_type = app.cardType
          if (ele_cards && ele_cards[card_type] && ele_cards[card_type].status === 'received') {
            match = true
          }
        } else {
          match = true
        }
        return match

      })
        console.log("HomeIcon ele_cards filter",homeIcon.length/*,homeIcon,JSON.stringify(ele_cards)*/)
    }
    /*
    let allAppIcon ={
      "icon_name": "全部应用",
      "icon_desc": "",
      "icon_img": "https://images.allcitygo.com/miniapp/more.png",
      "url_type": "self",
      "url_path": "/pages/icon/index"
    }
    let getterAllAppIcon = getters.getIn('allAppIcon')
    getterAllAppIcon&& (Object.assign(allAppIcon,getterAllAppIcon) )
    */
    let ele_box_icon =homeIcon.slice(0, 4)// homeIcon.concat([allAppIcon])
    return ele_box_icon
  }
  //公交虚拟卡的折扣角标
  function updateCardmark({state}: any){
   timeEn &&  console.time("time-updateCardmark")
   let cardMark:any = {}
   let app:any =getApp()
   let cardList = app.cardList
    if(cardList &&cardList.length && cardList[0] &&  cardList[0].cardType){
     let cardRelativeTarget  = state.getIn('cardRelativeTarget',{})
     let hasBind =  state.getIn(['account','hasBind'],false)
     cardRelativeTarget = cardRelativeTarget[cardList[0].cardType] || cardRelativeTarget.cardInfo ;
    /* cardRelativeTarget = {
     "card_mark_bg":"#eabf78",
    "card_mark_text_color":"#ffffff",
    "card_mark_text":"充值9折",
     }*/
     if(cardRelativeTarget){
     let mark:any={ }
     mark.bgColor  = cardRelativeTarget.card_mark_bg
     mark.textColor  = cardRelativeTarget.card_mark_text_color
     let text  =hasBind? cardRelativeTarget.card_bound_mark_text: cardRelativeTarget.card_mark_text//'充值享8.9折'//
     if(text){
     let  num= text.replace(/[^0-9.]/ig,"");
     if(num && num.length){
     let text1 = text.split(num)
     //text1 && text1.length>=2 &&( text= text1[0]+'\n'+  num +  text1[1])
     mark.text1 = ['','','']
     //mark.text1Large = num &&num.length==1
     mark.text1[0] = text1[0]
     mark.text1[1] = '\n'+num
     mark.text1[2] = text1[1]
     }else {
       mark.text = text
       mark.text1Large = text &&text.length==1
     }
     }
     mark.markUrl = cardRelativeTarget.card_mark_url //|| 'https://www.taobao.com'
     //mark.text = text
     mark.fontSize =  cardRelativeTarget.card_mark_font_size
     cardMark[cardList[0].cardType] = mark
     //commit("CARD_MARK",cardMark)
     }
    }
   timeEn &&  console.timeEnd("time-updateCardmark")
   return  cardMark
  }

  function checkSwitch(data:string,trueValue:string,defaultValue:boolean) {
    if(data==trueValue) return true
    if(data==undefined || data ==null) {
      return defaultValue
    }
    return false
  }



   async function getPageJSON( pageUrl: string) {
      let app: any = getApp()
      let globalData = app.globalData
      //await app.loadUserId()
      let appId = app.appId
      let aliUserId = app.alipayId
      let result
     {
      timeEn && console.time("time-getPageJSON-" + pageUrl)
      console.log('getPageJSON', pageUrl)
      let item = app.extJson.pageJson.filter(common.pageJsonFilter(pageUrl,{userId:aliUserId,...(app.systemInfo||{})}))
     /* let item = app.extJson.pageJson.filter((t: { pageUrl: any }) => {
        return t.pageUrl === pageUrl
      })*/
      if (item && item.length > 0) {
        let { locationId, templateId } = item[0]
        let local = null
        let  key
        try {
          local = await globalData.get(`PAGE_JSON_${locationId}_${templateId}`) //await common.getStorageSync({ key: `PAGE_JSON_${locationId}_${templateId}` })
          if(app.preview && locationId ==app.preview.locationId  && templateId==app.preview.templateId) {
              local=null  
              key = app.preview.key   
          }
          if (local) {
            result=( {
              pageUrl,
              data: local
            })

            console.log('getPageJSON use Storage')
            timeEn && console.timeEnd("time-getPageJSON-" + pageUrl)
            return result
          }
        } catch (err) {
          console.warn(err, 'getStorageSync fail')
        }

        let res = await pageJson.queryPageJson({ appId, aliUserId, locationId, templateId ,key})
        console.log('getPageJSON queryPageJson await', res)
        if (res && res.success && res.data) {
           let data =  common.replaceJSON(res.data, app.replaceConfig)
            result=( {
              pageUrl,
              data
            })

          globalData.set(`PAGE_JSON_${locationId}_${templateId}`, data, { expire: 30 * 60000 })
        } else if (local) {
          console.log('getPageJSON queryPageJson fail use local')
          result=( {
              pageUrl,
              data: local
            })

        }

      } else {
        console.warn('getPageJSON no config ', pageUrl)
      }
      timeEn && console.timeEnd("time-getPageJSON-" + pageUrl)
       }
       return result
      //commit('SET_PAGE_JSON',{data:result})
    }

    async function rpcCardInfo(){
      let app: any = getApp()
      let result:any ={}
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
                res && (res.balanceMode = card.balanceMode, app.replaceConfig.cardName = res.cardTitle)
                result[card.cardType] = ( { cardType: card.cardType, data: res })
                globalData.set('CARD_INFO_' + card.cardType, res, { expire: 1440 * 60000 })
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
                result[card.cardType] = ( { cardType: card.cardType, data: res })
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
            result[card.cardType]=(  { cardType: card.cardType, data: {... CARD_MOCK[index],cardType:card.cardType} })
          });

        }
         } catch (err) {
        console.error(err)
      }
      return result

    }


  async function getECH5CardInfo() {
     timeEn && console.time("time-getECH5CardInfo")
       let result
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
          result=  { balance: balance, balanceTitle: balanceTitle }
          //res && commit('CARD_BALANCE', { balance: balance, balanceTitle: balanceTitle })
        }
        else {
          /*
          if (app.config && !app.config.supportAccount) {
            busService.getConfig('ioc.ebuscard.city.config').then((res: { data: any }) => {
              console.log('ioc.ebuscard.city.config', res.data)
              app.config = res.data
            })
          }*/

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
                  result= accounts[0]
                //accounts && accounts.length && commit('CARD_BALANCE', accounts[0])
              } else {
                 result= {
                  cardType,
                  status,
                  hasBind,
                  cardId,
                  disabled,
                  disabledTips
                }
                /*
                commit('CARD_BALANCE', {
                  cardType,
                  status,
                  hasBind,
                  cardId,
                  disabled,
                  disabledTips
                })*/
              }

            }
          }
        }

      } catch (err) {
        console.error(err)
      }
      timeEn && console.timeEnd("time-getECH5CardInfo")
      return result
    }

    async function getHomePage() {
      let result
      try {
        timeEn && console.time("time-getHomePage")
        timeEn && console.time("time-getHomePage-getStorageSync")
        let globalData = getApp().globalData
        globalData.getHomeCount = (globalData.getHomeCount || 0) +1
        if(globalData.getHomeCount==2) {
          console.log("getHomePage 正在调用，稍等片刻")
          await common.sleep(100)
        }
        let local = await globalData.get("HOME_PAGE_JSON") // await common.getStorageSync({ key: `HOME_PAGE_JSON` })
        timeEn && console.timeEnd("time-getHomePage-getStorageSync")
        //console.log('getHomePage getStorageSync', ret)
        // let local = ret  && ret.data && ret.data.data
        let success
        let cardPage
        if (local) {
          success = true
          cardPage = local
          globalData.getHomeCount=0
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
            globalData.getHomeCount=0
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
              priority:1,
              group_id: 'travel_service',
              icon_id: '_' + common.hashCode(t.icon_name)
            }, t)
          }))
          all_service_icon && all_service_icon.length && (ele_icons = ele_icons.concat(all_service_icon))
          travel_service_icon && travel_service_icon.length && (travel_service_icon = travel_service_icon.map((t: { icon_name: string | null | undefined }) => {
            return Object.assign({
              card_status: true,
              priority:1,
              group_id: 'travel_service',
              icon_id: '_' + common.hashCode(t.icon_name)
            }, t)
          }))
          travel_service_icon && travel_service_icon.length && (ele_icons = ele_icons.concat(travel_service_icon))
         //  commit('SET_ICON_LIST', )
         result= {cardRelativeTarget:cardPage,travelIcon:ele_icons}
         // commit('SET_HOME_PAGE', {cardRelativeTarget:cardPage,travelIcon:ele_icons})
        }
        timeEn && console.timeEnd("time-getHomePage-success")
      }
      catch (err) {
        console.error(err)
      }
      timeEn && console.timeEnd("time-getHomePage")
      return result
    }
