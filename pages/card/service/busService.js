
import APIService from './APIService';
import { doGet } from '/pages/card/utils/request';

const OATH_UID_PATH = '/miniapp_login.do';
function sleep(time) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        //console.log("busService sleep",time)
        resolve()
      }, time || 1000)
    } catch (e) {
      reject(e);
    }
  });
}
function silenceAuthCode() {
  return new Promise((resolve, reject) => {
    try {
      my.getAuthCode({
        scopes: 'auth_base',
        success: (res) => {
          resolve(res);
        },
        fail: (e) => {
          reject(e);
          /*
            my.alert({
                title: '授权失败，请稍后再试',
                complete: () => reject(res)
            });
            */
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

class ECardService extends APIService {
  init(host, cityCode, appid, ver, systemInfo) {
    super.init(host);

    this.config = { cityCode };
    this.appid = appid;

    this.ver = ver;

    this.systemInfo = systemInfo;
  }

  getConfig(api) {
    return this.apiGet(api, this.config, this.options);
  }

  getCard() {
    return this.apiGet('ioc.ebuscard.card.my', { ...this.config, ...this.systemInfo }, this.options);
  }

  getRechargeConfig() {
    return this.apiGet('ioc.ebuscard.recharge.template', this.config, this.options);
  }

  getRechargeLog(month, page, pageSize) {
    const param = {
      ...this.config,
      month,
      page,
      pageSize,
    };
    return this.apiGet('ioc.ebuscard.recharge.records', param, this.options);
  }

  doLogin(authCode) {
    console.log('getToken authCode', authCode)
    return doGet(this.host + OATH_UID_PATH, { auth_code: authCode, cityCode: this.config.cityCode, appid: this.appid });
  }
  async loadToken(data) {
    console.log('busService loadToken ...')
    this._loading = true
    let globalData = data || getApp().globalData
    this.ctoken  =await globalData.get('ech5')  
    if (!this.ctoken) {
      await this.getToken()
    }
    this._reday = true
    this._loading = false
    console.log('busService loadToken reday')
  }
  async reday() {
    if (this._reday)
        return
    if(!this._loading) {
       await this.loadToken()
    }    
    let count = 0
    do {
      if (this._reday)
        return
      await sleep(100)
      count++
    } while (count < 100)
  }

  async getToken() {
    console.log('busService getToken ...')
    if (this.getTokening) {
      await sleep(3000)
      if (this.ctoken) {
        console.log("getToken have ctoken")
        return
      }
    }
    this.getTokening = true
    let silenceRes = {}
    try {
      silenceRes = await silenceAuthCode()
    } catch (err) {
       console.log("getToken silenceAuthCode err",err)
      await sleep(3000)
      silenceRes = await silenceAuthCode()
    }
    const { authCode } = silenceRes;
    try{
    let ret = await this.doLogin(authCode)
    if (ret && ret.data) {

      this.setCToken(ret.data.ctoken)
    }
    }catch (err) {
       console.log("getToken err",err)
    }
    this.getTokening = false
  }


  getTravelLog(month, page, pageSize) {
    const monthStr = month;
    return this.apiGet('ioc.ebuscard.travel.records', {
      ...this.config, month: monthStr, page, pageSize,
    }, this.options);
  }

  register(param) {
    return this.apiGet('ioc.ebuscard.card.register', { ...this.config, ...param });
  }

  registerMiniapp(authCode) {
    return this.apiGet('ioc.ebuscard.card.register_miniapp', { ...this.config, authCode });
  }

  getCertUrl(appSource) {
    return this.apiGet('ioc.ebuscard.certification.url', { ...this.config, appSource });
  }

  unregister() {
    return this.apiGet('ioc.ebuscard.card.unregister', this.config);
  }

  rollbackUnregister() {
    return this.apiGet('ioc.ebuscard.card.rollback_unregister', this.config);
  }

  queryPay(orderId) {
    return this.apiGet('ioc.ebuscard.recharge.query', { ...this.config, outTradeNo: orderId });
  }

  recharge(accountType, amount) {
    return this.apiPost('ioc.ebuscard.card.recharge', { ...this.config, accountType, amount, payChannel: 'alipay_applet' });
  }

  appRecharge(accountType, amount) {
    return this.apiPost('ioc.ebuscard.card.recharge', { ...this.config, accountType, amount, payChannel: 'alipay_applet', terminalType: 'app' }, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    });
  }

  getAutoRechargeStatus() {
    return this.apiGet('ioc.ebuscard.auto_recharge.query', this.config);
  }

  signAndOpenAutoRecharge(type, balance, ammount) {
    return this.apiPost('ioc.ebuscard.auto_charge.open', {
      ...this.config, type, balance, ammount,
    });
  }

  cancelAutoRecharge(type) {
    return this.apiPost('ioc.ebuscard.auto_recharge.cancel', { ...this.config, type });
  }
  bind(cardNo) {
    return this.apiPost('ioc.ebuscard.card.bind', { ...this.config, cardNo, source: 'alipay' }, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    });
  }


  getHzBalance() {
    return this.apiPost('ioc.ebuscard.hz.getvircard', { ...this.config, source: 'alipay' }, {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    });
  }

}

export default new ECardService();
