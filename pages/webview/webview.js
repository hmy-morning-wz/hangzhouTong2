import store from './store'
import { jumpToBusCode } from '../../components/card-component/utils'
import { getUserId, getToken } from '../../utils/service'
const app = getApp()
const createPage = function (options) {
    return Page(store.register(options))
};

function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
createPage({
    data: {
        url: '' // h5链接
    },
    async onLoad(options) {
        //(this, options)
        this.webViewContext = my.createWebViewContext('web-view-1');
        await app.loadUserId()
        if (options.special) {
            this.setData({
                url: app.specialUrl
            })
        } else {
            let url = options.url//.replace(/(\s*$)/g,"") //'http://sit-operation.allcitygo.com/TeStabc/test.html'//
            if (url.indexOf('{userId}') > -1) {
                url = url.replace('{userId}', app.alipayId)
            }
            if (url.indexOf('{appId}') > -1) {
                url = url.replace('{appId}', app.appId)
            }
            if (url.indexOf('{cityCode}') > -1) {
                url = url.replace('{cityCode}', app.cityInfo.cityCode)
            }
            if (url.indexOf('{cityName}') > -1) {
                url = url.replace('{cityName}', app.cityInfo.cityName)
            }
            if (url.indexOf('{formId}') > -1) {
                url = url.replace('{formId}', app.formId)
            }


            this.setData({
                url: trim(url)
            }, () => {
                console.log('页面地址', this.data.url + "|" + encodeURIComponent(this.data.url))
            })

        }


    },
    // 接收来自H5的消息
    async onMessage(e) {
        console.log(e); //{'sendToMiniProgram': '0'}
        let msg = e.detail
        let param = {}
        let ret
        if (msg && msg.method)
            switch (msg.method) {
                case 'openCardDetail':
                    my.openCardDetail(msg.param)
                    ret = true
                    break;
                case 'openCardList':
                    my.openCardList(msg.param)
                    ret = true
                    break;
                case 'openKBVoucherDetail':
                    my.openKBVoucherDetail(msg.param)
                    ret = true
                    break;
                case 'openMerchantCardList':
                    my.openMerchantCardList(msg.param)
                    ret = true
                    break;
                case 'openMerchantVoucherList':
                    my.openMerchantVoucherList(msg.param)
                    ret = true
                    break;
                case 'openTicketDetail':
                    my.openTicketDetail(msg.param)
                    ret = true
                    break;
                case 'openTicketList':
                    my.openTicketList(msg.param)
                    ret = true
                    break;
                case 'openMerchantTicketList':
                    my.openMerchantTicketList(msg.param)
                    ret = true
                    break;
                case 'openVoucherDetail':
                    my.openVoucherDetail(msg.param)
                    ret = true
                    break;
                case 'openVoucherList':
                    my.openVoucherList(msg.param)
                    ret = true
                    break;
                case 'jumpToBusCode':
                    app.cardType && jumpToBusCode(app.cardType)
                    ret = true
                    break
                case 'reportAnalytics':
                    msg.param && msg.param.seed && my.reportAnalytics(msg.param.seed, msg.param.data || {})
                    ret = true
                    break

                case 'jumpToPage':
                    msg.param && app.handleNavigate(msg.param)
                    ret = true
                    break

                case 'makePhoneCall':
                    msg.param && my.makePhoneCall({ number: '' + msg.param.number })
                    ret = true
                    break
                case 'getUserInfo':
                    {
                        let token = await getToken()
                        param = {
                            userId: app.alipayId,
                            appId: app.appId,
                            cityCode: app.cityInfo.cityCode,
                            cityName: app.cityInfo.cityName,
                            token: token,
                            formId: app.formId
                        }
                        ret = true
                    }
                    break
                case 'showSharePanel':
                    my.showSharePanel()
                    ret = true
                    break
                case 'hideShareMenu':
                    my.hideShareMenu()
                    ret = true
                    break

                case 'goTaobaoLive':
                    this.goLive(msg.param.sellerId)
                    ret = true
                    break
                default:
                    ret = false
                    break

            }
        // 向H5发送消息

        this.webViewContext.postMessage({ 'success': ret, method: msg.method, data: param });
    },
    goLive(sellerId) {
        // alipays://platformapi/startapp?appId=2019091867543618&page=pages/live-room/live-room&query=userId%3d69226163
        my.navigateToMiniProgram({
            appId: '2019091867543618',
            path: 'pages/live-room/live-room?userId=' + sellerId,
            extraData: {

            },
            success: (res) => {
                console.log(JSON.stringify(res))
            },
            fail: (res) => {
                console.log(JSON.stringify(res))
            }
        });
    },
    onShow() {
        //scene
        this.webViewContext && app.scene && this.webViewContext.postMessage({ onShow: { scene: app.scene } });
    },
    onReady() {
        app.Tracker.click("LOAD_H5_PAGE", { url: this.data.url })
    },
    onShareAppMessage(options) {
        let url = options.webViewUrl || this.data.url
        if (url && url.indexOf(app.alipayId)) {
            url = url.replace(app.alipayId, "{userId}")
        }
        //my.alert({content:JSON.stringify(url)});
        return {
            title: `分享${app.cityInfo.title}`,
            //desc: 'View 组件很通用',
            path: `pages/webview/webview?url=${encodeURIComponent(url)} `,
            'web-view': url,
        };
    },

});
