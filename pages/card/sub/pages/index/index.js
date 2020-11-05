//import busService from '/pages/card/service/busService';
import { autoErrorPage, autoMiniErrorPage } from '/pages/card/utils/ErrorHandler';
import { makeUrl } from '/pages/card/utils/request';
import state from '/pages/card/utils/CardStatus';
let busService = getApp().busService
// 获取应用实例
const app = getApp();

Page({
    data: {
        cardId: null,
        status: null,
        cardLogo: null,
        menus: [],
    },
    onLoad(query) {
   
      

        busService.getCard().then(autoErrorPage(({data}) => {
            console.log('>>> 卡信息查询: ', data);
            this.setData({
                cardId: data.cardId,
                cardLogo: app.config.logoUrl,
                status: data.status,
                menus: app.config.menus
            });
        })).catch(error => {
            autoMiniErrorPage('', '/pages/index/index');
        });
    },
    onMenuItemClick(index) {
        const {index: code} = index;
        if (code === 'balance') {
            my.navigateTo({
                url: '../../pages/balance/balance',
            });
        }
        if (code === 'travelRecord') {
            my.navigateTo({
                url: '../../pages/travel/travel',
            });
        }
        if (code === 'openLines') {
            my.navigateTo({
                url: '../../pages/busline/busline', // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
            });
        }
        if (code === 'faq') {
            my.navigateTo({
                url: '../../pages/usage/usage',
            });
        }
        if (code === 'unregister') {
            if (this.data.status === state.ACTIVE) {
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
        }
        if (code === 'openLife') {
            
        }
    },
});
