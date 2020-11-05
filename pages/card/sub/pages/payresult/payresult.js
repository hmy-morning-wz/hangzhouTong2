//import busService from '/pages/card/service/busService';
import {
    autoErrorPage,
    autoMiniErrorPage
} from '/pages/card/utils/ErrorHandler';
import PayStatus from '/pages/card/utils/PayStatus';

let busService = getApp().busService
const MAX_QUERY_TIME_MS = 30 * 1000;

const QUERY_STEP_MS = 3 * 1000;

Page({
  data: {
      PayStatus,
  },

  onLoad(query) {
  
      

    my.showLoading({ content: '支付中...' });

    const outTradeId = query.outTradeId;

    const timer = setInterval(() => this.queryPay(outTradeId), QUERY_STEP_MS);

    this.setData({
      outTradeId,
      startTime: (new Date().getTime()),
      done: false,
      // done: true,
      status: PayStatus.UNPAY,
      // status: PayStatus.ERROR,
      // status: PayStatus.SUCCESS,
      timer,
    });
  },

  queryPay(outTradeId){
    const elapsed = new Date().getTime() - this.data.startTime;

    if (elapsed >= MAX_QUERY_TIME_MS) {
      this.terminateQuery({ status: 'timeout' });
    } else {
      busService.queryPay(outTradeId).then(autoErrorPage(({ data }) => {
        switch(data.result) {
          case PayStatus.UNPAY:
            break;
          default:
            this.terminateQuery({ status: data.result });
        }
      }), autoMiniErrorPage());
    }
  },

  terminateQuery(newState) {

    if (this.data && this.data.timer) {
      clearInterval(this.data.timer);
    }

    this.setData({
      done: true,
      timer: null,
      desc: PayStatus.toName(newState.status),
      ...newState,
    });

    my.hideLoading();
  },

  onUnload() {
    this.terminateQuery('close');
  },

  back() {
    let pages = getCurrentPages().length
    if(pages>=2) {
    my.navigateBack({
      delta: 1
    });
    }else {
      my.redirectTo({
        url: '/pages/index/index'
      });
    }
  }
});