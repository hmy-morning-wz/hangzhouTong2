import {
  STATUS_OK,
  STATUS_REDIRECT,
  SERVICE_UNAVAILABLE,
  makeUrl,
  encodeQueryString,
} from './request';
import config from './config';

const DEFAULT_BACKPAGE_NOT_NEW = '/pages/index/index'
const DEFAULT_BACKPAGE_NEW = '/pages/index/index'
function getPagePath() {
  try {
    var a = getCurrentPages()[getCurrentPages().length - 1];
    return '/'+a.route;
  } catch (c) {
    console.log( c);
  }
}
const autoErrorPage = (dataHandler, backPage, errorPage) => {
  const back = backPage ||getPagePath()|| (getApp().isNewUser ? DEFAULT_BACKPAGE_NEW : DEFAULT_BACKPAGE_NOT_NEW);

  return (resp) => {
    const {code, msg, redirectUrl} = resp
    // console.log('code', code)
    switch (code) {
      case STATUS_REDIRECT:                
        my.redirectTo({
          url:config.DEFAULT_ERROR_PAGE,
        });
        break;
      case SERVICE_UNAVAILABLE:
        my.redirectTo({
          url: config.DEFAULT_ERROR_PAGE,//unavailable
        });
        break;
      case STATUS_OK:
        dataHandler(resp);
        break;
      default:
        errorPage = errorPage || config.DEFAULT_ERROR_PAGE;
        const u = makeUrl(errorPage, {
          message: msg || '系统开小差了，请稍后再试',
          code,
          back
        });
        console.warn(u)
        my.redirectTo({
          url: u, // 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用
        });
    }
  };
};

// 小程序异常
const autoMiniErrorPage = (errorPage, backPage) => {
  const back = backPage || (getApp().isNewUser ? DEFAULT_BACKPAGE_NEW : DEFAULT_BACKPAGE_NOT_NEW);
  errorPage = errorPage || config.DEFAULT_ERROR_PAGE;
  return (Error) => {
    console.log('####', Error);
    let {
      error,
      errorMessage
    } = Error;
    switch (error) {
      case 12:
      case 13:
      case 19:
        errorMessage = '网络出错了';
        break;
      case 11:
      case 14:
        errorMessage = '程序出错了';
        break;
      default:
        errorMessage = '未知异常';
    }
    const u = makeUrl(errorPage, {
      message: errorMessage,
      code: error,
      back
    });
    my.redirectTo({
      url: u, // 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用
    });
  };
};

const startApp = (url) => {
  my.call('startApp', {
    appId: '20000067',
    param: {
      url: url
    },
    closeCurrentApp: false
  });
};

export default {
    autoErrorPage, 
    autoMiniErrorPage,
    startApp,
};
