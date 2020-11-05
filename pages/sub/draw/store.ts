//import Store from 'herculex'

import * as services from "../services/acitivty"

// @ts-ignore
import parse from 'mini-html-parser2';
// @ts-ignore
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
  connectGlobal: true, // 是否关联global
  state: {
     remainLotteryNumber:0,
     activityId:activityIdDefault,
     tagMatch:false,
     prizeResult:{
     /*  typeClass:"modal-type",
       money:7,
       name:"乘车券",
       text1:"乘公交车自动抵扣",
       title:"别灰心，明天再来~",//"恭喜你抽中",
       button1Action:"BusQrcode",
       button2Action:"Guidance",
       button1:"去乘车",
       button2:"明日快速抽奖通道",
       type:"BusCoupons",//"NONE",//"LinkCoupons",//"BusCoupons",*/
      }
  },
  getters: {

  },
  plugins: ['logger', serviceplugin()],
  services: servicesCreactor(services),
  mutations: {
    //updatePrizeResult
    UPDATE_PRIZE_RESULT:(state:any,res:any)=>{
      state.prizeResult = res.prizeResult
    }
  },
  actions: {
       async pageLoad({commit, global,dispatch,state}:any) {
         dispatch("$service:checkTag")
         await dispatch('$global:getPageJSON', 'pages/sub/draw/draw');
         await dispatch("pageOnNextLoad")   
    },
    async pageOnNextLoad({ state, commit ,dispatch,global  }: any,playlod:any){
       let  curpage  =  global.getIn(['pageJson','pages/sub/draw/draw'],{})
       let activityId =curpage['activityId'] ||   state.getIn(['activityId']) 
       activityId   && dispatch('$service:getZZPrizeList',{activityId:activityIdDefault}) 
       let {rule,drawTag} =curpage
       let tagMatch = false
       //@ts-ignore
       let {globalData,Tracker} = getApp()
       let tagOption:any = {userId:globalData?.userId}
      if (drawTag && drawTag.length) {
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
      curpage.rule = ""
      //https://braft.margox.cn/demos/basic 在线富文本编辑器
      //https://operation-citytsm.oss-cn-hangzhou.aliyuncs.com/EditJS/index.html
      setTimeout(()=>{       
       var pattern = /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g;
	     if(pattern.test(rule)) {
         parse(rule, (err:any, nodes:any) => {
          if (!err) {
           commit("rule",{ruleRichText:nodes})
          }
         })
       }else {
         commit("rule", {
           ruleRichText: [{
             name: 'div',
             attrs: {
               class: 'text-item',
               style: 'color: #7696bb;',
             },
             children: [{
               type: 'text',
               text: rule,
             }],
           }]
         })
       }
       },0)
      
      let humantohumanSet = curpage.humantohumanSet
      curpage.humantohumanSet=null
      if (humantohumanSet && humantohumanSet.length) {
        humantohumanSet = humantohumanSet.map((t:any) => {
          let money = t.money
          let moneyLen = 1;
          if (money) {
            moneyLen = ("" + money).length
            if (moneyLen > 2) moneyLen = 2

          }
          return { moneyLen, ...t }
        })
      }
   
       commit("curpage",{...curpage,humantohumanSet })
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
