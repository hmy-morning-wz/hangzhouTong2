//import busService from '../../../service/busService';
import { autoErrorPage, autoMiniErrorPage } from '../../../utils/ErrorHandler';
import { makeUrl } from '../../../utils/request';
import AccountType from '../../../utils/AccountType';
import Utils from '../../../utils/Utils';
import state from '../../../utils/CardStatus';
import store from '../main/store'
import {  jumpToBusCode } from '/components/card-component/utils'
import PayStatus from '../../..//utils/PayStatus';
    const app = getApp()
    let busService =  getApp().busService
const TPL_MAP = {};
TPL_MAP[AccountType.RECHARGE] = 'recharge';
TPL_MAP[AccountType.MONTH] = 'month';
TPL_MAP[AccountType.SEASON] = 'season';
TPL_MAP[AccountType.YEAR] = 'year';
TPL_MAP[AccountType.ALIPAY_CREDIT] = 'credit';
const CHANGER_BUTTON = false

const createPage = function (options) {
  return Page(store.register(options))
};

createPage({
  data: {
    loading: undefined,
    data: null,
    accounts: [],
    changerButton:CHANGER_BUTTON,
    info:null,
    activityText:"",
    activityLink:"",
    cardActive: true
  },
  async onLoad(option) {
    //  
  },
  async onShow() {
    let {loading} = this.data
    this.setData({ loading: loading===undefined, data: null });

  
      await this.dispatch('$global:getCardInfo')
      await this.dispatch('$global:getECH5CardInfo')
  
    
    let cardType = app.cardType
    let  ele_cards =  cardType &&this.data.$global.ele_cards &&  this.data.$global.ele_cards[cardType] || {}
    let cardStatus =  ele_cards.status
    //let cardNo =ele_cards.cardNo 
    await busService.reday()
    if (!busService.ctoken) {
            try {
              await busService.getToken()
            } catch (err) {
              console.warn('busService getToken', err)
            }
    }
   let myAccounts = []
   let card = {}
   let accounts= {}
    busService.getCard().then(autoErrorPage(({ data}) => {

      if(data) {      
      card = data
      accounts = data.accounts.map((acc) => {
        if (acc.type === 1) {
         const accConfig =getApp().config && (Utils.getAccountByType(getApp().config.supportAccount || [], acc.type) || { name: getApp().config.supportAccount && getApp().config.supportAccount[0] || '电子钱包'.name, memo: '暂无说明' }) ||{};
          return {
            tpl: TPL_MAP[acc.type],
            type: acc.type,
            title: acc.name || '电子钱包',
            balance: acc.balance,
            balanceTitle: Utils.formatRMBYuanDecimal(acc.balance) + '元',
            memo: accConfig.memo,//acc.memo,
            memoLink:accConfig.memoLink
          }
        }
        // console.log('acc', getApp().config.supportAccount || [], acc)
        // const accConfig = Utils.getAccountByType(getApp().config.supportAccount || [], acc.type) || { name: getApp().config.supportAccount[0] || '电子钱包'.name, memo: '暂无说明' };
        // console.log('accConfig', accConfig)
        // return {
        //   tpl: TPL_MAP[acc.type],
        //   type: acc.type,
        //   title: accConfig.name,
        //   balance: acc.balance,
        //   balanceTitle: Utils.formatRMBYuanDecimal(acc.balance) + '元',
        //   memo: acc.memo,
        // }
      })
      // .filter( e => {
      //   return e.type === 1;
      // });

      console.log('accounts', accounts)
      myAccounts = card.accounts || [];
      }
/// getRechargeConfig
      busService.getRechargeConfig().then(({ data }) => {
        if(!data) {
           this.setData({ loading: false,  cardStatus,eleCard:ele_cards, cardActive: false });
          return
        }
        const rechargeableList =data && data.list.filter((item) => {
          if(myAccounts && myAccounts.length) return item.rechargeable && Utils.arrayFind(myAccounts, acc => acc.type === item.type);
           else {
             return item.rechargeable //&& Utils.arrayFind(myAccounts, acc => acc.type === item.type);
           }
        })
        
        let balance = 0;
        myAccounts.map(e => {
          if (e.type === 1) {
            balance = e.balance;
            return;
          }
        });

        const selectedTypeIdx = rechargeableList &&rechargeableList.length > 0 ? 0 : -1;
      
        const newStateSetting = {
          loading: false,
          card,
          cardActive: card.status === state.ACTIVE,

          rechargeableList,

          balance: Utils.formatRMBYuanDecimal(balance),
          upper: Utils.formatRMBYuanDecimal(data.upperLimitAmount - balance),
          upperLimitAmount:Utils.formatRMBYuanDecimal(data.upperLimitAmount)
        };

        this.resetType(selectedTypeIdx, newStateSetting, rechargeableList);
      }, autoMiniErrorPage());
/// getRechargeConfig
      
      this.setData({ loading: false, data, accounts,cardStatus,eleCard:ele_cards, cardActive: data && data.status === state.ACTIVE });




    }), autoMiniErrorPage());
  },
    resetType(selectedTypeIdx, setting, recList) {
    const rechargeableList = recList || this.data.rechargeableList;

    let info = {};
    if (selectedTypeIdx >= 0 && selectedTypeIdx < rechargeableList.length) {
      info = rechargeableList[selectedTypeIdx];
    }
    let { activity,activityLink }  = info
    const limitAmt = setting.upper || 0;
    info.list && info.list.map(e => {
      if (e.value > limitAmt * 100) {
        e.exceed = true;
      }
    });

    this.setData({
      ...setting,

      info,
      activityText:activity,activityLink,
      selectedPriceIdx: -1,
      selectedTypeIdx,
    });
  },

  onTapRecharge() {
    my.navigateTo({ url: '../../pages/recharge/recharge' });
  },
  onTapPrice(e) {
    const { index } = e.target.dataset;
    const price = this.data.info.list[index].value;
    if (price > this.data.upper * 100) {
      my.showToast({content: '充值金额超过限制'});
      return;
    }

    this.setData({ selectedPriceIdx: index },()=>{
      if(!CHANGER_BUTTON) {
          this.onClickPay() 
      }
    });
  },
  onTapLog() {
     let app =getApp()
    let cardType = app.cardType
//alipays://platformapi/startapp?appId=20000076&returnHome=NO&extReq=%7B%22cardType%22%3A%20%22T0442000%22%7D&bizSubType=75%3b107&showSearch=false&title=%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95
    my.ap.navigateToAlipayPage({
    path: `alipays://platformapi/startapp?appId=20000076&returnHome=NO&extReq=%7B%22cardType%22%3A%20%22${cardType}%22%7D&bizSubType=75%3b107&showSearch=false&title=%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95`// 'alipays://platformapi/startapp?appId=20000076&returnHome=NO&bizSubType=75&showSearch=false&title=%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95&cardType=' + cardType 
  });
  },
  onJumpToBusCode() {
    let app =getApp()
    let cardType = app.cardType
    jumpToBusCode(cardType)
  },
  onMoreMemo() {
   let {accounts} = this.data
    if(accounts && accounts[0] && accounts[0].memoLink) {
      getApp().handleNavigate({url_type:"selfWebview",url_path:accounts[0].memoLink})
    }
  },
  onActivity(){
    let {activityLink} = this.data
    if(activityLink) {
      getApp().handleNavigate({url_type:"selfWebview",url_path:activityLink})
    }
  },
  onClickPay() {
    this.setData({ recharging: true });

    const accountType = this.data.info.type;
    const price = this.data.info.list[this.data.selectedPriceIdx].value;

    console.log('accountType', accountType)
    busService.appRecharge(accountType, price)
      .then(autoErrorPage(({ data }) => {
        this.setData({ recharging: false });
        console.log('>>>>> 下单成功', data.payUrl, data.orderNum);
        my.tradePay({
          tradeNO: data.payUrl || data.orderNum,  // 即上述服务端已经加签的orderSr参数
          success: (res) => {

            console.log('付款结果 ', res.resultCode, res);
            if (res.resultCode === '9000' || res.resultCode === '8000') {
              my.redirectTo({ url: makeUrl('/pages/payresult/payresult', { outTradeId: data.orderNum }) });
            } else {
              const msg = res.memo || PayStatus.getDesc(res.resultCode);
              //my.redirectTo({ url: makeUrl('/pages/error/error', { message: msg, code: res.resultCode }) });
              my.showToast({content:msg})
            }
          },
          fail: (res) => {
            my.alert(res.resultCode)
         }
        });
      }));
  },

  onTapRechargeLog() {
    my.navigateTo({ url: '../../pages/payrecords/payrecords' });
  },
});
