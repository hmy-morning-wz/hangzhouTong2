import { doGet, doPost } from '/pages/card/utils/request';
import { getTimestamp } from '/pages/card/utils/Utils';
import { getToken } from '/utils/service';

const DEFAULT_GATEWAY = '/gateway.do';

const CTOKEN_HEADER_NAME = 'COM_IOC_CTOKEN';

export default class APIService {
  init(host, gateway, ctoken) {
    this.gateway = gateway || DEFAULT_GATEWAY;
    this.host = host;

    this.apiUrl = `${this.host}${this.gateway}`;
    this.ctoken = ctoken 
  }

  setCToken(ctoken) {
    this.ctoken = ctoken;
    let globalData = getApp().globalData
    if(globalData && globalData.set) {
      globalData.set('ech5', ctoken,{expire:9 * 60000})
    }
  }

  addTokenHeader(options) {
    const opts = options || {};

    if (!('headers' in opts)) {
      opts.headers = {};
    }

    opts.headers[CTOKEN_HEADER_NAME] = this.ctoken;

    return opts;
  }

  async apiRequest(api, data, requestMethod, options) {
    const bizContent = JSON.stringify(data || {});
    const newBody = {
      service: api,
      biz_content: bizContent,
      v: (options.ver || '1.0'),
      timestamp: getTimestamp(),
    };

    let res = await requestMethod(this.apiUrl, newBody, this.addTokenHeader(options));
    if(res.code===302) {
        console.log("apiRequest 302")
        if(res.msg.indexOf('Forbidden')>-1) {
           await this.getToken()
           res = await requestMethod(this.apiUrl, newBody, this.addTokenHeader(options));
        }
    }
    return res
  }

  apiGet(api, data, option) {
    return this.apiRequest(api, data, doGet, {
      method: 'GET',
      ...option,
    });
  }

  apiPost(api, data, option) {
    return this.apiRequest(api, data, doPost, {
      method: 'POST',
      ...option,
    });
  }
}