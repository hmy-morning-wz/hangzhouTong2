import store from './store'
//import busService from '/pages/card/service/busService';
import { startApp, autoErrorPage, autoMiniErrorPage } from '/pages/card/utils/ErrorHandler';
import { makeUrl } from '/pages/card/utils/request';
import state from '/pages/card/utils/CardStatus';
import { jump, jumpToBusCode } from 'bus-tinyapp-components/es/utils'
// import CONFIG from '../../../../utils/config'
let busService = getApp().busService
const USE_CARD = 'https://render.alipay.com/p/f/public_transit/card_entry.html';

const createPage = function (options) {
  return Page(store.register(options))
};

const app = getApp();

createPage({
  data: {
    status: null,
    cardLogo: null,
    cardType: null,
    menus: [],
  },
  onLoad() {
   
      

    my.setNavigationBar({
      title: app.config.cardName,
    });
    this.setData({
       cardType: app.cityInfo.cardType
    });
    const menus = app.config.menus.map(item => {
      if (item.name !== "乘车福利") {
        return {
          "icon": item.icon,
          "text": item.name,
          "code": item.code,
          "url": item.url
        }
      }
    });
    busService.getCard().then(autoErrorPage(({data}) => {
      console.log('>>> 卡信息查询: ', data);
      this.setData({
        cardId: data.cardId,
        cardLogo: app.config.logoUrl,        
        status: data.status,
        menus,
      });
    })).catch(error => {
        autoMiniErrorPage('', '../../pages/main/main');
    });
  },
  onItemClick: function(ev) {
    const code = this.data.menus[ev.detail.index].code;
    const url = this.data.menus[ev.detail.index].url;
    console.log('cardType', this.data.cardType, code, url)    
    // if (!url) {
    //   my.alert({
    //     title: "",
    //     content: "url错误"
    //   })
    // }  
    if (url) {
      if (url.startsWith(USE_CARD)) {  
        jumpToBusCode(this.data.cardType);        
      } else {
        // startApp(url);
        jump(url);
      }      
      return;
    }
    switch (code) {
      case 'balance':
        my.navigateTo({
          url: '../../pages/balance/balance',
        });
        break;
      case 'recharge':
        my.navigateTo({
          url: '../../pages/recharge/recharge',
        });
        break;
      case 'travelRecord':
        my.navigateTo({
          url: '../../pages/travel/travel',
        });
        break;
      case 'openLines':
        my.navigateTo({
          url: '../../pages/busline/busline',
        });
        break;
      case 'faq':
        my.navigateTo({
          url: '../../pages/usage/usage',
        });
        break;
      case 'openLife':
        const url = app.config.openLifeUrl;
        console.log('生活号跳转', url)
        if (url) {
          jump(url);
        }
        break;
      case 'unregister':
        this.unregister();
        break;
      default:
        break;
    }    
  },
  unregister() {
    busService.getCard().then(autoErrorPage(({ data }) => {      
      if (data.status === state.ACTIVE) {
        my.confirm({
          title: '提示',
          content: '确定退卡？',
          success: (res) => {
            if (res.confirm) {
              busService.unregister().then(autoErrorPage(({ data }) => {
                console.log('unregister====>', data);
                const u = makeUrl('../../pages/invoke/invoke', { successTips: data });
                my.navigateTo({ url: u });
              }), autoMiniErrorPage());
            }
          },
        });
      } else {
        my.navigateTo({ url: '../../pages/invoke/invoke' });
      }
    })).catch(error => {
      autoMiniErrorPage('', '../../pages/main/main');
    });
  }
});
