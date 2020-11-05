//import busService from '/pages/card/service/busService';
import { autoErrorPage, autoMiniErrorPage } from '/pages/card/utils/ErrorHandler';
import { makeUrl } from '/pages/card/utils/request';
import Utils from '/pages/card/utils/Utils';
import PayStatus from '/pages/card/utils/PayStatus';
import state from '/pages/card/utils/CardStatus';
let busService = getApp().busService
Page({
  data: {
    loading: true,
    card: null,

    selectedTypeIdx: null,
    selectedPriceIdx: -1,

    recharging: false,

    info: null,
    rechargeableList: [],
    cardActive: true,
    balance: 0,
    upper: 0,
  },
  async onLoad(option) {
      
  },

  onShow() {
    busService.getCard().then(autoErrorPage(({ data: card }) => {
      const myAccounts = card.accounts || [];
      busService.getRechargeConfig().then(({ data }) => {
        const rechargeableList = data.list.filter((item) => {
          return item.rechargeable && Utils.arrayFind(myAccounts, acc => acc.type === item.type);
        });

        let balance = 0;
        myAccounts.map(e => {
          if (e.type === 1) {
            balance = e.balance;
            return;
          }
        });

        const selectedTypeIdx = rechargeableList.length > 0 ? 0 : -1;

        const newStateSetting = {
          loading: false,

          card,
          cardActive: card.status === state.ACTIVE,

          rechargeableList,

          balance: Utils.formatRMBYuanDecimal(balance),
          upper: Utils.formatRMBYuanDecimal(data.upperLimitAmount - balance)
        };

        this.resetType(selectedTypeIdx, newStateSetting, rechargeableList);
      }, autoMiniErrorPage());
    }), autoMiniErrorPage());
  },

  onTapPrice(e) {
    const { index } = e.target.dataset;
    const price = this.data.info.list[index].value;
    if (price > this.data.upper * 100) {
      my.showToast({content: '充值金额超过限制'});
      return;
    }

    this.setData({ selectedPriceIdx: index });
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
              my.redirectTo({ url: makeUrl('../../pages/payresult/payresult', { outTradeId: data.orderNum }) });
            } else {
              const msg = res.memo || PayStatus.getDesc(res.resultCode);
              my.redirectTo({ url: makeUrl('../../pages/error/error', { message: msg, code: res.resultCode }) });
            }
          },
          fail: (res) => {
            my.alert(res.resultCode)
         }
        });
      }));
  },

  onChangeType(e) {
    const index = e.detail.value;

    this.resetType(index, {});
  },

  resetType(selectedTypeIdx, setting, recList) {
    const rechargeableList = recList || this.data.rechargeableList;

    let info = {};
    if (selectedTypeIdx >= 0 && selectedTypeIdx < rechargeableList.length) {
      info = rechargeableList[selectedTypeIdx];
    }

    const limitAmt = setting.upper || 0;
    info.list.map(e => {
      if (e.value > limitAmt * 100) {
        e.exceed = true;
      }
    });

    this.setData({
      ...setting,

      info,

      selectedPriceIdx: -1,
      selectedTypeIdx,
    });
  },

  onTapAutoRecharge() {
    my.alert({ title: '功能开发中' });
  },

  onTapRechargeLog() {
    my.navigateTo({ url: '../../pages/payrecords/payrecords' });
  },
});
