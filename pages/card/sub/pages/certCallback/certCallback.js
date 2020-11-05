//import busService from '/pages/card/service/busService';
import CertType from '/pages/card/utils/CertType';
import { autoErrorPage, autoMiniErrorPage } from '/pages/card/utils/ErrorHandler';
import config from '/pages/card/utils/config';
let busService = getApp().busService
const app = getApp();

Page({
  data: {
    loading: true,
    mode: null,
    requestId: null,
    authCode: null,
    isCreditOpened: null,
    cityInfo: null,
  },

  onLoad(options) {
 
      
  
    console.log('cert callback ===', options);
    let mode = CertType.REAL_NAME;
    let requestId;
    let authCode;
    let isCreditOpened;
    if ('request_id' in options) {
      requestId = options.request_id;
      authCode = options.auth_code;
      mode = CertType.REAL_NAME;
    } else if ('isCreditOpened' in options) {
      mode = CertType.ALIPAY_CREDIT;
      isCreditOpened = options.isCreditOpened;
    }

    this.setData({
      mode: mode,
      requestId: requestId,
      authCode: authCode,
      isCreditOpened: isCreditOpened,
      cityInfo: app.config.city,
    });
    getApp().certCallback = null;
    my.setNavigationBar({
        title: this.data.cityInfo.cardName,
    });
  },

  onShow() {
    this.doRegister();
  },


  doRegister() {
    let param = {};
    switch (this.data.mode) {
      case CertType.REAL_NAME:
        param = {
          requestId: this.data.requestId,
          authCode: this.data.authCode,
          appSource: config.APP_SOURCE,
        };
        break;
      case CertType.ALIPAY_CREDIT:
        param = {
          isCreditOpened: this.data.isCreditOpened,
          appSource: config.APP_SOURCE,
        };
        break;
      default:
        break;
    }

    busService.register(param).then(autoErrorPage(() => {
      this.setData({
        loading: true,
      });
      my.redirectTo({ url: '../../pages/main/main?6' });
    }), '../../pages/error/error', '../../pages/error/error');
  },

  
});