import Utils from '/pages/card/utils/Utils';
import PayStatus from '/pages/card/utils/PayStatus';

const app = getApp();
Page({
  data: {
    info: null,
    accConfig: null,
  },
  async onLoad(option) {
      
  },

  onShow() {
    const info = app.item;
    info.status = PayStatus.toName(info.status);
    const acc = Utils.getAccountByType(app.config.supportAccount, info.accountType);
    const accConfig = acc ? acc.name : `未知-${info.accountType}`;
    this.setData({ info, accConfig });
  },

});
