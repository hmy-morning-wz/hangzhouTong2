import store from '../main/store'
//import busService from '/pages/card/service/busService';
import { autoErrorPage, autoMiniErrorPage } from '/pages/card/utils/ErrorHandler';
import state from '/pages/card/utils/CardStatus';
import {  jumpToBusCode } from '/components/card-component/utils'
    const app = getApp()
    let busService = getApp().busService
//card_hasBind_mark_text 这块角标配置自动    
const createPage = function (options) {
  return Page(store.register(options))
};

createPage({
  data: {
    hasBind: false,
    loading:true,
    cardNo:null,
    result:'info',//"warn" success,
    successTips:"",
    successMessage:"",
    buttonText:''
  },

  onLoad(options) {
    
  this.dispatch('$global:getHomePage')   
     my.showLoading({
      content: '查询中...',
    });

  },

  async  getCard(){
   await this.dispatch('$global:getCardInfo')
   await this.dispatch('$global:getECH5CardInfo')
   my.hideLoading()   
   try{
   let cardType = app.cardType
   let {hasBind,cardId,status}= this.data.$global.account || {}
   let  ele_cards =  cardType &&this.data.$global.ele_cards &&  this.data.$global.ele_cards[cardType] || {}
   let cardStatus = ele_cards.status
   let cardRelativeTarget =this.data.$global.cardRelativeTarget && (this.data.$global.cardRelativeTarget[cardType] || this.data.$global.cardRelativeTarget.cardInfo );
   let notice_img = cardRelativeTarget &&  cardRelativeTarget.notice_img //|| 'https://images.allcitygo.com/202001061557484139TQ9rK.png'
   //hasBind=true
   let cardNo =ele_cards.cardNo 
   console.log('getCard',cardNo)
   this.setData({cardType,cardNo:cardNo||cardId,hasBind,status,cardStatus, ready:status!=undefined,loading:false})   
   /**
    *  status,
                    hasBind,
                    cardId,
                    disabled,
                    disabledTips
    * 
    */
   if(hasBind) {
         this.setData({              
         successTips:"成功",
         result:'success',
         notice_img,
         successMessage:"已经绑定市民卡",
         buttonText:'绑定市民卡',
      });
    }else if(cardNo && status==undefined){
       this.setData({              
         successTips:"提示",
         result:'info',
         successMessage:"正在同步数据",
         notice_img,
         buttonText:'稍后再来',
      });
    }else if( cardStatus === 'noReceive') {	    
        this.setData({              
         successTips:"提示",
         result:'info',
         notice_img,
         successMessage:"需要领取虚拟卡后才能绑定",
         buttonText:'去领卡',
      });   
    } else if(status==undefined) {
        this.setData({              
         successTips:"提示",
         result:'info',
         notice_img,
         successMessage:"正在同步数据",
         buttonText:'稍后再来',
      });
    } else  {
       this.setData({              
         successTips:"提示",
         result:'info',
         notice_img,
         successMessage:"绑定市民卡享受乘车优惠",
         buttonText:'绑定市民卡',
      });
    }
   }catch(err){
     console.warn(err)
   }
  },
  onBind(){
   let {cardType,hasBind,cardStatus,cardNo,ready} = this.data
   if(cardStatus==='noReceive') {
    console.log('未领卡')
         jumpToBusCode( cardType)
   }
   else if(ready && cardNo && !hasBind){
       console.log('bind ',cardNo)
         my.showLoading({
          content: '提交中...',
        });
       busService.bind(cardNo).then(autoErrorPage(({ data }) => {
                  console.log('bind====>', data);
                  //{"code":200,"msg":"SUCCESS","redirectUrl":null,"data":{"bind":"false","failedReason":"SUCCESS"}}
                 if(data && (data.bind==='true'|| data.bind===true )) {
                   this.getCard()   
                 }else {
                   my.hideLoading()
                    this.setData({              
                        successTips:"失败提示",
                        result:'warn',
                        notice_img:null,
                        successMessage:data && data.failedReason || "系统开小差了，请稍后再试",
                        buttonText:'绑定市民卡',
                   });
                 }          
                }), autoMiniErrorPage());
       }
   else {
     if(!ready) {
         my.reLaunch({
           url: '/pages/index/index'
         });
       }else {
         my.showToast({
             content: '请稍后再试',
         });
         this.dispatch('$global:getCardInfo')
       }
       
      }
  },

 async onShow() {
      
    this.getCard()

  },

 
});
