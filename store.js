import { GlobalStore } from 'herculex';
import { getCardInfo } from './components/card-component/utils/';
import busService from './pages/card/service/busService';
import card from './services/getCardInfo';
import Utils from './pages/card/utils/Utils';
import CONFIG from './services/config';
import pageJson from './services/pageJson';
import common from './utils/common';
const timeEn = false;
export default new GlobalStore({
    state: {
        pageJson: {},
        cardStatus: true,
        normalCardInfo: null,
        ele_cards: {},
        ele_card_types: [],
        cardListStatus: {},
        account: null,
        monthCardInfo: null,
        cardRelativeTarget: {},
        homeIcon: null,
        travelIcon: []
    },
    mutations: {
        CARD_INFO: (state, cardInfo) => {
            let app = getApp();
            let t = {};
            if (cardInfo && cardInfo.data) {
                let cardType = cardInfo.cardType;
                let data = cardInfo.data;
                t.cardTitle = data.cardTitle;
                t.cardType = cardType;
                t.balanceMode = data.balanceMode;
                t.cardLogo = data.styleConfig && data.styleConfig.logoUrl;
                t.imageUrl = data.styleConfig && data.styleConfig.imageUrl;
                t.applyUrl = data.extInfo && data.extInfo.cardApplyUrl;
                t.status = data.cardModels && data.cardModels.length > 0 ? 'received' : 'noReceive';
                t.cardNo = data.cardModels && data.cardModels.length > 0 ? data.cardModels[0].cardNo : '';
                app.globalData.cardNo = t.cardNo;
                state.ele_cards[cardType] = t;
                if (data && data.cardModels && data.cardModels.length > 0) {
                    state.cardListStatus[cardType] = true;
                }
            }
            else {
                let cardType = cardInfo.cardType;
                state.ele_cards[cardType] = {};
            }
        },
        CARD_BALANCE: (state, account) => {
            state.account = account;
        },
        UPDATE_SYSTEM: (state, sys) => {
            state.systemInfo = sys;
        },
        SET_PAGE_JSON: (state, payload) => {
            var _a;
            let app = getApp();
            (_a = payload.data) === null || _a === void 0 ? void 0 : _a.forEach((res) => {
                state.pageJson[res.pageUrl] = common.replaceJSON(res.data, app.replaceConfig);
            });
        },
        SET_COVER_IMAGE: (state, res) => {
            state.coverImg[res.cardType] = res;
        },
        SET_HOME_ICON: (state, res) => {
            state.homeIcon = res;
        },
        SET_HOME_PAGE: (state, payload) => {
            state.cardRelativeTarget = payload.cardRelativeTarget;
            state.travelIcon = payload.travelIcon;
        },
    },
    actions: {
        async getCardInfoStorage({ commit }) {
            console.log('getCardInfoStorage');
            let app = getApp();
            let globalData = app.globalData;
            let cardList = app.cardList;
            if (cardList && cardList.length >= 1) {
                let card = cardList[0];
                if (card && card.cardType) {
                    let res = await globalData.get('CARD_INFO_' + card.cardType);
                    res && (app.replaceConfig.cardName = res.cardTitle);
                    res && commit('CARD_INFO', { cardType: card.cardType, data: res });
                }
            }
            if (cardList && cardList.length >= 2) {
                let card = cardList[1];
                if (card && card.cardType) {
                    let res = await globalData.get('CARD_INFO_' + card.cardType);
                    res && commit('CARD_INFO', { cardType: card.cardType, data: res });
                }
            }
        },
        async getCardInfo({ commit }) {
            let app = getApp();
            let globalData = app.globalData;
            let cardList = app.cardList;
            let cardType;
            try {
                if (!my.isIDE) {
                    if (cardList && cardList.length >= 1) {
                        let card = cardList[0];
                        if (card && card.cardType) {
                            try {
                                cardType = card.cardType;
                                let res;
                                res = await getCardInfo(card.cardType);
                                res && (res.balanceMode = card.balanceMode, app.replaceConfig.cardName = res.cardTitle);
                                commit('CARD_INFO', { cardType: card.cardType, data: res });
                                globalData.set('CARD_INFO_' + card.cardType, res, { expire: 1440 * 60000 });
                            }
                            catch (err) {
                                app.onTrackerError("getCardInfoFail", err);
                            }
                        }
                    }
                    if (cardList && cardList.length >= 2) {
                        let card = cardList[1];
                        if (card && card.cardType) {
                            try {
                                let res;
                                res = await getCardInfo(card.cardType);
                                res && (res.balanceMode = card.balanceMode);
                                commit('CARD_INFO', { cardType: card.cardType, data: res });
                                globalData.set('CARD_INFO_' + card.cardType, res, { expire: 1440 * 60000 });
                            }
                            catch (err) {
                                console.warn('getCardInfo fail', err);
                            }
                        }
                    }
                }
                else {
                    console.warn("IDE 不能调用getCardInfo 接口,使用MOCK数据");
                    const CARD_MOCK = [
                        { "cardModels": [{ "cardNo": "3100700011760410" }], "cardTitle": "杭州通支付宝公交卡", "cardType": "T0330100", "extInfo": { "cardApplyUrl": "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017011104993459&auth_skip=false&scope=auth_base&redirect_uri=https%3A%2F%2Fcitysvc.96225.com%2Fexthtml%2FalipayCard%2Fsrc%2Fpages%2Findex.html%3Ftype%3Dindex%26source%3Dalipay%26sence%3Dopen" }, "styleConfig": { "imageUrl": "https://gw.alipayobjects.com/mdn/gov_bus_ca/afts/img/A*KbIcR7MxoDsAAAAAAAAAAABkARQnAQ", "codeLogo": "", "logoUrl": "https://zos.alipayobjects.com/rmsportal/xZpdTVoDJkISGbLQvgEk.png" } },
                        { "cardModels": [{ "cardNo": "3100700011760410" }], "cardTitle": "杭州通公交月卡", "cardType": "T2330100", "extInfo": { "cardApplyUrl": "https://gjyp.96225.com/qrCodeMTichet/applyCard.html" }, "styleConfig": { "imageUrl": "https://gw.alipayobjects.com/mdn/gov_bus_ca/afts/img/A*KjwwTpUia30AAAAAAAAAAABkARQnAQ", "codeLogo": "", "logoUrl": "https://gw.alipayobjects.com/zos/rmsportal/OvYIjoCrDMcGtiPLnMwf.png" }, "balanceMode": "NONE" }
                    ];
                    cardList && cardList.length && cardList.forEach((card, index) => {
                        globalData.set('CARD_INFO_' + card.cardType, CARD_MOCK[index], { expire: 1440 * 60000 });
                        commit('CARD_INFO', { cardType: card.cardType, data: Object.assign(Object.assign({}, CARD_MOCK[index]), { cardType: card.cardType }) });
                    });
                }
            }
            catch (err) {
                console.error(err);
            }
        },
        async getECH5CardInfo({ commit }) {
            try {
                let app = getApp();
                if (app.ech5Disabled) {
                    console.log("ech5Disabled");
                    return;
                }
                let cardList = app.cardList;
                if ((!cardList) || cardList.length == 0) {
                    return;
                }
                let cardType = cardList[0].cardType;
                await busService.reday();
                if (!busService.ctoken) {
                    try {
                        await busService.getToken();
                    }
                    catch (err) {
                        console.warn('busService getToken', err);
                    }
                }
                if (app.cityCode === '330100') {
                    let res = await busService.getHzBalance();
                    let { balance } = res.data || {};
                    let balanceTitle = "";
                    if (balance == 0 || balance) {
                        balanceTitle = balance + '元';
                    }
                    res && commit('CARD_BALANCE', { balance: balance, balanceTitle: balanceTitle });
                }
                else {
                    if (app.config && !app.config.supportAccount) {
                        busService.getConfig('ioc.ebuscard.city.config').then((res) => {
                            console.log('ioc.ebuscard.city.config', res.data);
                            app.config = res.data;
                        });
                    }
                    if (app.cardList && app.cardList.length && app.cardList[0] && (app.cardList[0].balanceMode != 'ALIPAY')) {
                        let res = await busService.getCard();
                        console.log('获得余额', res);
                        if (res.code === 200 && res.data) {
                            let hasBind = res.data.hasBind === 'true' || res.data.hasBind === true;
                            let { cardId, disabled, disabledTips, status } = res.data;
                            if (res.data.accounts && res.data.accounts.length) {
                                let accounts = res.data.accounts.map((acc) => {
                                    if (acc.type === 1) {
                                        let balance = Utils.formatRMBYuanDecimal(acc.balance);
                                        return {
                                            cardType,
                                            type: acc.type,
                                            title: acc.name || '电子钱包',
                                            balance: +balance,
                                            balanceTitle: balance + '元',
                                            memo: acc.memo,
                                            status,
                                            hasBind,
                                            cardId,
                                            disabled,
                                            disabledTips
                                        };
                                    }
                                });
                                accounts && accounts.length && commit('CARD_BALANCE', accounts[0]);
                            }
                            else {
                                commit('CARD_BALANCE', {
                                    cardType,
                                    status,
                                    hasBind,
                                    cardId,
                                    disabled,
                                    disabledTips
                                });
                            }
                        }
                    }
                }
            }
            catch (err) {
                console.error(err);
            }
        },
        async getHomePage({ commit }) {
            try {
                timeEn && console.time("time-getHomePage");
                timeEn && console.time("time-getHomePage-getStorageSync");
                let globalData = getApp().globalData;
                let local = await globalData.get("HOME_PAGE_JSON");
                timeEn && console.timeEnd("time-getHomePage-getStorageSync");
                let success;
                let cardPage;
                if (local) {
                    success = true;
                    cardPage = local;
                }
                else {
                    timeEn && console.time("time-getHomePage-request");
                    let app = getApp();
                    let res = await CONFIG.getHomePage({ cityCode: app.cityCode });
                    let data = res.data;
                    success = res.success;
                    if (success && data && data.cardPage) {
                        cardPage = common.replaceJSON(data.cardPage, app.replaceConfig);
                        globalData.set('HOME_PAGE_JSON', cardPage, { expire: 3 * 60000 });
                    }
                    timeEn && console.timeEnd("time-getHomePage-request");
                }
                timeEn && console.time("time-getHomePage-success");
                if (success && cardPage) {
                    let ele_icons = [];
                    let { all_service_icon, travel_service_icon } = cardPage || {};
                    all_service_icon = all_service_icon && all_service_icon.ele_icons;
                    travel_service_icon = travel_service_icon && travel_service_icon.ele_icons;
                    all_service_icon && all_service_icon.length && (all_service_icon = all_service_icon.map((t) => {
                        return Object.assign({
                            card_status: false,
                            group_id: 'travel_service',
                            icon_id: '_' + common.hashCode(t.icon_name)
                        }, t);
                    }));
                    all_service_icon && all_service_icon.length && (ele_icons = ele_icons.concat(all_service_icon));
                    travel_service_icon && travel_service_icon.length && (travel_service_icon = travel_service_icon.map((t) => {
                        return Object.assign({
                            card_status: true,
                            group_id: 'travel_service',
                            icon_id: '_' + common.hashCode(t.icon_name)
                        }, t);
                    }));
                    travel_service_icon && travel_service_icon.length && (ele_icons = ele_icons.concat(travel_service_icon));
                    commit('SET_HOME_PAGE', { cardRelativeTarget: cardPage, travelIcon: ele_icons });
                }
                timeEn && console.timeEnd("time-getHomePage-success");
            }
            catch (err) {
                console.error(err);
            }
            timeEn && console.timeEnd("time-getHomePage");
        },
        async getPageJSON({ commit }, payload) {
            let app = getApp();
            let globalData = app.globalData;
            await app.loadUserId();
            let appId = app.appId;
            let aliUserId = app.alipayId;
            let arr = [];
            if (Array.isArray(payload)) {
                arr = payload;
            }
            else {
                arr = [payload];
            }
            let result = [];
            for (let i = 0; i < arr.length; i++) {
                let pageUrl = arr[i];
                timeEn && console.time("time-getPageJSON-" + pageUrl);
                console.log('getPageJSON', pageUrl);
                let item = app.extJson.pageJson.filter(common.pageJsonFilter(pageUrl, Object.assign({ userId: aliUserId }, (app.systemInfo || {}))));
                if (item && item.length > 0) {
                    let { locationId, templateId } = item[0];
                    let local = null;
                    let key;
                    try {
                        local = await globalData.get(`PAGE_JSON_${locationId}_${templateId}`);
                        if (app.preview && locationId == app.preview.locationId && templateId == app.preview.templateId) {
                            local = null;
                            key = app.preview.key;
                        }
                        if (local) {
                            result.push({
                                pageUrl,
                                data: local
                            });
                            console.log('getPageJSON use Storage');
                            timeEn && console.timeEnd("time-getPageJSON-" + pageUrl);
                            continue;
                        }
                    }
                    catch (err) {
                        console.warn(err, 'getStorageSync fail');
                    }
                    let res = await pageJson.queryPageJson({ appId, aliUserId, locationId, templateId, key });
                    console.log('getPageJSON queryPageJson await', res);
                    if (res && res.success && res.data) {
                        result.push({
                            pageUrl,
                            data: res.data
                        });
                        globalData.set(`PAGE_JSON_${locationId}_${templateId}`, res.data, { expire: 30 * 60000 });
                    }
                    else if (local) {
                        console.log('getPageJSON queryPageJson fail use local');
                        result.push({
                            pageUrl,
                            data: local
                        });
                    }
                }
                else {
                    console.warn('getPageJSON no config ', pageUrl);
                }
                timeEn && console.timeEnd("time-getPageJSON-" + pageUrl);
            }
            commit('SET_PAGE_JSON', { data: result });
        },
        async getIndexCard({ commit }) {
            try {
                let app = getApp();
                await app.loadUserId();
                let cardInfo = { pid: `${app.CONFIG.normal.cardType}`, userId: app.alipayId };
                let buscardInfo = await card.getIndexCard(cardInfo);
                if (buscardInfo && buscardInfo.length) {
                    let buscard = buscardInfo[0].buscard;
                    if (buscard && buscard.coverImg) {
                        commit('SET_COVER_IMAGE', {
                            cardType: app.CONFIG.normal.cardType,
                            coverImg: buscard.coverImg
                        });
                        my.setStorage({
                            key: `COVER_IMAG_${app.CONFIG.normal.cardType}`,
                            data: {
                                timestamp: Date.now(),
                                data: buscard.coverImg
                            }
                        });
                    }
                    else {
                        commit('SET_COVER_IMAGE', {
                            cardType: app.CONFIG.normal.cardType,
                            coverImg: null
                        });
                        my.setStorage({
                            key: `COVER_IMAG_${app.CONFIG.normal.cardType}`,
                            data: {
                                timestamp: Date.now(),
                                data: null
                            }
                        });
                    }
                }
            }
            catch (err) {
                console.warn('getIndexCard err ', err);
            }
        },
        async setDefaultHomeIcon({ commit }, icons) {
            timeEn && console.time("time-setDefaultHomeIcon");
            icons = icons.filter((t1) => (t1 != null));
            commit('SET_HOME_ICON', icons);
            timeEn && console.timeEnd("time-setDefaultHomeIcon");
        },
        async setHomeIcon({ commit }, icons) {
            icons = icons.filter((t1) => (t1 != null));
            let globalData = getApp().globalData;
            globalData.set('HOME_ICON', icons, { expire: 30 * 60000 });
            commit('SET_HOME_ICON', icons);
        },
        async loadHomeIcon({ commit }) {
            let globalData = getApp().globalData;
            let res = await globalData.get("HOME_ICON");
            if (res) {
                let icons = res;
                commit('SET_HOME_ICON', icons);
            }
            else {
            }
        }
    }
});
