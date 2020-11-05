import '@tklc/miniapp-tracker-sdk';
import { getUserId, config, request } from './utils/TinyAppHttp';
import { MyTracert } from './utils/mytracert';
import { setEnv } from './utils/env';
import life from './services/life';
import busService from './pages/card/service/busService';
import common from './utils/common';
import appVersion from './version.json';
import GlobalData from './utils/globalData';
import herculex from 'herculex';
import serviceplugin from "./utils/serviceplugin";
import servicesCreactor from "./utils/serviceCreator";
import Store from './store';
const Tracert = new MyTracert({
    spmAPos: 'a56',
    spmBPos: 'b23056',
    system: "a1001",
    subsystem: "b1001",
    bizType: 'common',
    logLevel: 2,
    chInfo: '',
    debug: false,
    mdata: {},
});
App(Store({
    herculex,
    Tracert,
    serviceplugin,
    servicesCreactor,
    busService,
    request,
    isNewUser: true,
    env: null,
    redirectPage: null,
    type: 'normal',
    config: {},
    homePage: {},
    replaceConfig: {},
    channel: 'tkalipay2',
    token: '',
    specialUrl: null,
    alipayId: null,
    account: null,
    appId: null,
    msg: {},
    mtrConfig: {
        version: appVersion.version + '@' + appVersion.date,
        stat_auto_click: true,
        stat_auto_expo: true,
        stat_reach_bottom: true,
        stat_batch_send: true,
    },
    globalData: new GlobalData({ version: appVersion.version,
    }),
    async onShow(options) {
        const { query, scene } = options;
        this.type = (query && query.type) || 'normal';
        if (query) {
            this.msg = query;
            if (query._preview) {
                let reg = new RegExp('\{.*\}');
                if (reg.test(query._preview)) {
                    try {
                        let preview = JSON.parse(query._preview);
                        if (preview && preview.exp) {
                            if (+Date.now() > preview.exp) {
                                console.warn("预览码过期");
                                preview = null;
                                my.showToast({ content: "亲，你扫的预览码已过期" });
                            }
                        }
                        this.preview = preview;
                    }
                    catch (err) {
                    }
                    console.log("_preview", query, this.preview);
                }
            }
            if (query.clear) {
                setTimeout(() => {
                    my.clearStorageSync();
                    my.confirm({
                        title: '缓存清除提示',
                        content: '缓存已经清除，是否重启应用？',
                        success: function (res) {
                            if (res.confirm) {
                                my.reLaunch({ url: '/pages/index/index' });
                            }
                        }
                    });
                }, 3000);
            }
        }
        scene && (this.scene = scene);
        console.log('onShow', options);
        if (options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.navigateOuter) {
            judgeNavigate(options.referrerInfo.extraData, this);
        }
    },
    async onLaunch(options) {
        var _a;
        console.time("time-onLaunch");
        const { query, scene, referrerInfo } = options;
        if (query) {
            this.msg = query;
            if (query.clear) {
                this.globalData.clear();
                my.clearStorageSync();
            }
        }
        this.scene = scene;
        const extJson = my.getExtConfigSync();
        const env = extJson.env;
        this.replaceConfig = Object.assign(Object.assign(Object.assign({}, this.replaceConfig), extJson.cityInfo), { miniAppName: extJson.cityInfo.title }),
            Object.assign(this.globalData, Object.assign(Object.assign({ extJson }, extJson.cityInfo), { publicId: extJson.publicId }));
        setEnv(extJson.env);
        if (this.Tracker && this.Tracker.App && this.Tracker.App.config) {
            this.Tracker.App.config({
                server: [extJson.apiHost['webtrack'] || 'https://webtrack.allcitygo.com:8088/event/upload'],
                appName: extJson.cityInfo.title,
                appId: extJson.cityInfo.appid,
                mtrDebug: env == 'sit'
            });
        }
        config({
            env,
            autoLogin: false,
            appId: extJson.cityInfo.appid,
            hostBaseUrl: env === 'sit' ? 'https://sit-basic-ug.allcitygo.com' : 'https://ztmanage.allcitygo.com:8192'
        });
        this.extJson = extJson;
        this.env = extJson.env;
        this.appId = extJson.cityInfo.appid;
        this.cityInfo = extJson.cityInfo;
        this.pageInfo = extJson.pageInfo;
        this.cardList = extJson.cardList;
        this.cityName = this.cityInfo.cityName;
        this.cityCode = this.cityInfo.cityCode;
        this.CONFIG = {
            normal: {
                cardType: extJson.cardList.length && extJson.cardList[0].cardType,
                balanceMode: extJson.cardList.length && extJson.cardList[0].balanceMode
            },
            month: {
                cardType: (extJson.cardList && extJson.cardList.length >= 2) ? extJson.cardList[1].cardType : null
            }
        };
        this.cardType = extJson.cardList.length && extJson.cardList[0].cardType;
        this.cardAppType = extJson.cardList.length && extJson.cardList[0].appType;
        let balanceMode = this.cardList && this.cardList.length && ((_a = this.cardList[0]) === null || _a === void 0 ? void 0 : _a.balanceMode);
        this.ech5Disabled = (!balanceMode) || balanceMode === 'ALIPAY' || balanceMode === 'NONE';
        this.replaceConfig = {
            cardType: this.cardType,
            cityName: this.cityName,
            cityCode: this.cityCode,
            appId: this.appId,
            appName: extJson.cityInfo.title,
            cityNamePy: extJson.cityInfo.cityNamePy || this.cityCode,
            miniAppName: extJson.cityInfo.title,
            env
        };
        extJson.replaceConfig && (this.replaceConfig = Object.assign(this.replaceConfig, extJson.replaceConfig));
        Object.assign(this.globalData, this.replaceConfig);
        this.host = extJson.apiHost.ech5 || "https://ech5.allcitygo.com";
        let { model, platform } = this.systemInfo || {};
        const si = {
            app: this.cardAppType || 'alipay_mini',
            model,
            platform,
        };
        busService.init(this.host, this.cityCode, this.appId, '', si);
        this.globalData.configLoad = true;
        console.timeEnd("time-onLaunch");
        await this.globalData.reday();
        updateSystemInfo().then((res) => {
            this.systemInfo = res;
            let { model, platform } = this.systemInfo || {};
            busService.systemInfo = { model, platform };
        });
        if (this.ech5Disabled) {
            console.log("ech5Disabled");
        }
        else {
            await busService.loadToken(this.globalData);
        }
        console.log("CONFIG", this);
        this.loadUserId();
        my.reportAnalytics("v" + appVersion.version + '_' + appVersion.date, appVersion);
    },
    loadEch5Config() {
        if (this.ech5Disabled) {
            console.log("ech5Disabled");
            return;
        }
        if ((this.config && this.config.cityCode)) {
            return;
        }
        if (this.cityCode !== '330100') {
            busService.getConfig('ioc.ebuscard.city.config').then((res) => {
                console.log('ioc.ebuscard.city.config', res.data);
                this.config = res.data || {};
            });
        }
    },
    onHide() {
        console.log("app hide");
        this.globalData.store();
    },
    onError(error) {
        console.error('APP onError', error);
    },
    onTrackerError(tag, err) {
        this.Tracker.err(tag, err);
    },
    async loadUserId() {
        if (!this.alipayId) {
            let userId = await getUserId();
            this.alipayId = userId;
            this.globalData.userId = userId;
            this.replaceConfig.userId = userId;
            return { success: userId || false };
        }
        return { success: this.alipayId };
    },
    async getToken(alipayId) {
        const { data } = await life.getAccessToken({ alipayId: alipayId, channel: this.channel });
        this.token = data;
        console.log('token', this.token);
    },
    onSubmit(e) {
        if (e.detail && e.detail.formId) {
            console.log("formId", e.detail.formId);
            this.formId = e.detail.formId;
        }
    },
    async getFormId() {
        if (this.formId) {
            return this.formId;
        }
        else {
            await common.sleep(100);
            return this.formId;
        }
    },
    handleIconClick(e) {
        console.log('handleClick', e.currentTarget.dataset);
        this.loadEch5Config();
        if (e.detail && e.detail.formId) {
            console.log("formId", e.detail.formId);
            this.formId = this.globalData.formId = e.detail.formId;
        }
        let obj = e.currentTarget.dataset.obj;
        if (!obj) {
            console.warn('handleClick dataset obj is undefine');
            return;
        }
        common.handleNavigate(obj, this);
    },
    async handleNavigate(options) {
        common.handleNavigate(options, this);
    }
}));
async function judgeNavigate(options, app) {
    await app.loadUserId();
    let globalData = app.globalData || {};
    switch (options.type) {
        case 'h5Out':
            {
                let url_path = options.url;
                if (url_path.indexOf('{userId}') > -1) {
                    url_path = url_path.replace('{userId}', globalData.alipayId);
                }
                if (url_path.indexOf('{appId}') > -1) {
                    url_path = url_path.replace('{appId}', globalData.appId);
                }
                if (globalData.formId && url_path.indexOf('{formId}') > -1) {
                    url_path = url_path.replace('{formId}', globalData.formId);
                }
                if (url_path.indexOf('{cityCode}') > -1) {
                    url_path = url_path.replace('{cityCode}', globalData.cityInfo.cityCode);
                }
                if (url_path.indexOf('{cityName}') > -1) {
                    url_path = url_path.replace('{cityName}', globalData.cityInfo.cityName);
                }
                my.call('startApp', {
                    appId: '20000067',
                    param: {
                        url: url_path,
                        chInfo: 'ch_2019031163539131',
                    },
                    success: () => {
                        let close = options.close;
                        if (options.close == undefined) {
                            close = true;
                        }
                        if (!close) {
                            return;
                        }
                        if (my.canIUse('onAppShow')) {
                            my.onAppShow(() => {
                                my.navigateBackMiniProgram({
                                    extraData: {
                                        "h5Out": "success"
                                    },
                                    success: (res) => {
                                        console.log(JSON.stringify(res));
                                    },
                                    fail: (res) => {
                                        console.log(JSON.stringify(res));
                                    }
                                });
                            });
                        }
                        else {
                            setTimeout(() => {
                                my.navigateBackMiniProgram({
                                    extraData: {
                                        "h5Out": "success"
                                    },
                                    success: (res) => {
                                        console.log(JSON.stringify(res));
                                    },
                                    fail: (res) => {
                                        console.log(JSON.stringify(res));
                                    }
                                });
                            }, 500);
                        }
                    }
                });
            }
            break;
        case 'smkOut':
            if (!globalData.token)
                globalData.token = 'null';
            my.call('startApp', {
                appId: '20000067',
                param: {
                    url: `https://life.96225.com/city/index.html?from=singlemessage&isappinstalled=0#/activeDetial?id=${options.id}&token=${globalData.token}&channel=${globalData.channel}`,
                    chInfo: 'ch_2019031163539131'
                }
            });
            break;
        case 'startApp':
            my.call('startApp', {
                appId: (options.appId || '20000042'),
                param: {
                    publicBizType: options.publicBizType,
                    publicId: options.publicId,
                    chInfo: options.chInfo
                }
            });
            break;
        case 'alipay':
            console.log(options.url);
            my.ap.navigateToAlipayPage({
                path: options.url,
                fail: (err) => {
                    my.alert({
                        content: JSON.stringify(err)
                    });
                }
            });
            break;
        case 'miniapp':
            my.navigateToMiniProgram({
                appId: options.remark,
                path: options.url,
                extraData: options.data || {},
                fail: (res) => {
                    my.reportAnalytics("jsapi_fail", {
                        api: "navigateToMiniProgram",
                        file: "app.ts/judgeNavigate",
                        timestamp: +Date.now(),
                        extra: JSON.stringify(options),
                        userId: globalData.userId,
                        err: JSON.stringify(res)
                    });
                }
            });
            break;
        default:
            break;
    }
}
async function updateSystemInfo() {
    let res = await common.getSystemInfoSync();
    let versionCodes = res.version.split(".").map((t) => parseInt(t));
    let version = versionCodes[0] * 10000 + versionCodes[1] * 100 + versionCodes[2];
    if (version < 100170) {
        my.showToast({
            type: 'success',
            content: '您当前支付宝版本过低，须更新'
        });
        my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient();
    }
    else {
        let sdkVersionCodes = my.SDKVersion.split(".").map((t) => parseInt(t));
        let sdkVersion = sdkVersionCodes[0] * 10000 + sdkVersionCodes[1] * 100 + sdkVersionCodes[2];
        if (sdkVersion < 11100) {
            my.showToast({
                type: 'success',
                content: '您当前支付宝基础库版本过低，须更新'
            });
            my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient();
        }
    }
    try {
        if (my.canIUse('getUpdateManager')) {
            const updateManager = my.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                console.log(res.hasUpdate);
            });
            updateManager.onUpdateReady(function () {
                my.confirm({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            updateManager.applyUpdate();
                        }
                    }
                });
            });
            updateManager.onUpdateFailed(function () {
            });
        }
    }
    catch (err) {
        console.error(err);
    }
    return res;
}
