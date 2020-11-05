import * as services from "./services/acitivty";
import common from '../../utils/common';
import { getCardInfo } from '/components/card-component/utils/';
import busService from '/pages/card/service/busService';
import Utils from '/pages/card/utils/Utils';
import { getPopContent } from './popup';
import pageJson from '../../services/pageJson';
import CONFIG from '/services/config';
import HEALTHCONFIG from '/services/healthGold';
const timeEn = false;
const { serviceplugin, servicesCreactor, herculex: Store } = getApp();
const activityIdDefault = 93;
const CodeMap = {
    "1": "BusCoupons",
    "2": "BusCoupons",
    "3": "LinkCoupons",
    "99": "NONE",
};
export default new Store({
    connectGlobal: false,
    state: {
        card: true,
        eleCards: [],
        cardMark: {},
        ele_cards: {},
        ele_box_icon: [],
        signList: {},
        permission: false,
        permissionHasLoad: false,
        healthSet: {},
        circleRecommend: {},
        humantohumanSet: {},
        banner2List: {},
        bannerList: {},
        adFeedsPluginSet: {},
        activityId: activityIdDefault
    },
    plugins: ['logger', serviceplugin()],
    services: servicesCreactor(services),
    mutations: {
        LIST_DATA: (state, config) => {
            state.signList = JSON.parse(JSON.stringify(config));
        },
        PREMISSION: (state, config) => {
            state.permission = config;
            state.permissionHasLoad = true;
        },
        ELE_CARD: (state, { eleCards }) => {
            state.eleCards = eleCards;
        },
        CARD_BALANCE: (state, account) => {
            state.account = account;
        },
        UPDATE_CARD_INFO: (state, payload) => {
            let { cardMark, eleCards, ele_box_icon } = payload;
            state.cardMark = cardMark;
            state.eleCards = eleCards;
            state.ele_box_icon = ele_box_icon;
        },
        CARD_INFO: (state, payload) => {
            let app = getApp();
            for (let key in payload) {
                let cardInfo = payload[key];
                let t = {};
                let ele_cards = Object.assign({}, state.ele_cards);
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
                    ele_cards[cardType] = t;
                    state.ele_cards = ele_cards;
                }
                else {
                    let cardType = cardInfo.cardType;
                    cardType && (state.ele_cards[cardType] = {});
                }
            }
        },
    },
    actions: {
        async getThisWeekSign({ state, commit }) {
            let health = state.getIn('health');
            if (!health) {
                console.warn("健康金模块开关关闭");
                return;
            }
            const { success: userId } = await getApp().loadUserId();
            const params = {
                userId: userId,
            };
            const { success, data } = await HEALTHCONFIG.getThisWeekSign(params);
            if (success) {
                commit('LIST_DATA', JSON.parse(JSON.stringify(data)));
            }
            else {
                commit('LIST_DATA', []);
            }
        },
        async getAdmit({ state, commit }) {
            let health = state.getIn('health');
            if (!health) {
                console.warn("健康金模块开关关闭");
                return;
            }
            const { success: userId } = await getApp().loadUserId();
            const { success, data } = await HEALTHCONFIG.getAdmit(userId);
            if (success) {
                commit('PREMISSION', data);
            }
            else {
                commit('PREMISSION', false);
            }
        },
        async pageOnLoad({ state, dispatch, commit }) {
            timeEn && console.time("time-pageOnLoad");
            timeEn && console.time("time-pageOnLoad-1");
            let app = getApp();
            await app.globalData.reday();
            timeEn && console.timeEnd("time-pageOnLoad-1");
            timeEn && console.time("time-pageOnLoad-2");
            rpcCardInfo().then((res) => {
                console.log("rpcCardInfo", res);
                commit("CARD_INFO", res);
                dispatch('updateCardInfo');
            });
            getHomePage();
            let p = [
                getPageJSON('pages/index/index'),
                getPageJSON('pages/icon/index'),
                common.getSystemInfoSync(),
                app.loadUserId()
            ];
            let res = await Promise.all(p);
            timeEn && console.timeEnd("time-pageOnLoad-2");
            await dispatch("pageOnNextLoad", res);
            timeEn && console.timeEnd("time-pageOnLoad");
        },
        async pageOnNextLoad({ state, commit, dispatch }, playlod) {
            timeEn && console.time("time-pageOnNextLoad");
            timeEn && console.time("time-pageOnNextLoad-1");
            let curpage = playlod[0] && playlod[0].data || {};
            let iconPage = playlod[1] && playlod[1].data || {};
            let app = getApp();
            let globalData = app.globalData;
            let { bizScenario, version } = globalData;
            let examine = (curpage['auditminiapp'] == version);
            if (examine) {
                app.Tracker && app.Tracker.Mtr && (app.Tracker.Mtr.stat_auto_expo = false);
            }
            let circleRecommend = curpage['circleRecommend'] || {};
            circleRecommend.appId = circleRecommend.appId || '2019062165635711';
            let popup = curpage.popup;
            curpage.popup = null;
            let systemInfo = await common.getSystemInfoSync();
            let banner2List = curpage['banner2List'];
            if (banner2List && banner2List.length) {
                banner2List = banner2List.map((t) => {
                    t.image = common.crossImage(t.image, { width: 440, height: 240, systemInfo: systemInfo });
                    return t;
                });
            }
            let humantohumanSet = curpage['humantohumanSet'];
            if (humantohumanSet && humantohumanSet.image) {
                humantohumanSet.image = common.crossImage(humantohumanSet.image, { width: 686, height: 200, systemInfo: systemInfo });
            }
            let { drawTag, draw } = curpage;
            let tagMatch = false;
            let { Tracker } = getApp();
            let tagOption = { userId: globalData === null || globalData === void 0 ? void 0 : globalData.userId };
            if (draw == "ON" && drawTag && drawTag.length) {
                for (let i = 0; i < drawTag.length; i++) {
                    try {
                        if (tagMatch) {
                            break;
                        }
                        let reg = new RegExp(drawTag[i]);
                        for (let key in tagOption) {
                            if (reg.test(tagOption[key])) {
                                console.log("match", drawTag[i], key, tagOption[key]);
                                tagMatch = true;
                                Tracker && Tracker.setData && Tracker.setData("userTag", tagMatch);
                                commit("tagMatch", { tagMatch });
                                break;
                            }
                        }
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
            }
            commit("pageOnLoad", Object.assign(Object.assign({}, curpage), { curpage,
                iconPage,
                bizScenario,
                examine, card: true, page_title: curpage['page_title'], lifestyle: (!examine) && checkSwitch(curpage["lifestyle"], 'ON', false), icon: checkSwitch(curpage["icon"], 'ON', true), banner: checkSwitch(curpage["banner"], 'ON', false), humantohuman: checkSwitch(curpage["humantohuman"], 'ON', false), health: (!examine) && checkSwitch(curpage["health"], 'ON', false), banner2: checkSwitch(curpage["banner2"], 'ON', false), circleRecommendItem: (!examine) && checkSwitch(curpage["circleRecommendItem"], 'ON', false), adFeedsPlugin: (!examine) && checkSwitch(curpage["adFeedsPlugin"], 'ON', false), circleRecommend,
                humantohumanSet,
                banner2List,
                systemInfo }));
            dispatch("getAdmit");
            dispatch("getThisWeekSign");
            timeEn && console.timeEnd("time-pageOnNextLoad-1");
            if (examine) {
                dispatch('updateCardInfo');
                timeEn && console.timeEnd("time-pageOnNextLoad");
                return;
            }
            timeEn && console.time("time-pageOnNextLoad-2");
            if (draw == "ON") {
                let activityId = activityIdDefault;
                dispatch("$service:checkTag");
                dispatch('$service:getZZLotteryMsg', { activityId });
            }
            if (popup) {
                getPopContent({ userId: globalData.userId, appId: globalData.appId, cityCode: globalData.cityCode, list: popup }).then((pop) => {
                    if (pop) {
                        commit("popupWindow", { modalOpened: true, popupWindow: pop, popup: { imageLoad: true, showClose: true, hiddenButton: false } });
                    }
                });
            }
            getHomePage().then((homepage) => {
                let { cardRelativeTarget, travelIcon } = homepage || {};
                commit("homepage", { cardRelativeTarget, travelIcon });
                getECH5CardInfo().then((res) => {
                    commit('CARD_BALANCE', res);
                    dispatch('updateCardInfo');
                });
            });
            timeEn && console.timeEnd("time-pageOnNextLoad-2");
            timeEn && console.timeEnd("time-pageOnNextLoad");
        },
        async getCardInfo({ state, dispatch, commit }) {
            let p = [rpcCardInfo(), getECH5CardInfo()];
            try {
                let res = await Promise.all(p);
                commit("CARD_INFO", res[0]);
                commit('CARD_BALANCE', res[1]);
            }
            catch (e) {
                console.error("getCardInfo catch err", e);
            }
            dispatch('updateCardInfo');
        },
        async updateCardInfo({ state, dispatch, commit }) {
            let ele_cards = state.getIn(['ele_cards'], {});
            let travelIcon = state.getIn(['travelIcon'], []);
            let iconPage = state.getIn(['iconPage'], {});
            let ele_box_icon = loadHomeIcon({ ele_cards, travelIcon, iconPage });
            if (ele_box_icon && ele_box_icon.length) {
                let systemInfo = state.getIn(['systemInfo']);
                ele_box_icon = ele_box_icon.map((item) => {
                    item.icon_img = common.crossImage(item.icon_img, { width: 56, height: 56, systemInfo });
                    return item;
                });
            }
            let cardMark = updateCardmark({ state });
            let eleCards = updateCard({ state });
            commit("UPDATE_CARD_INFO", { cardMark, eleCards, ele_box_icon });
        },
        updateUserTag({ state, commit, dispatch }) {
            console.log("checkTag");
            let result = state.getIn(['$loading', 'checkTag']);
            if ((!result.isLoading) && result.type === 'SUCCESS' && result.code == '20000') {
                let data = state.getIn(['$result', 'checkTag']);
                if (data && +data === 1) {
                    let tagMatch = true;
                    commit("checkTag", { tagMatch });
                    let { Tracker } = getApp();
                    Tracker && Tracker.setData && Tracker.setData("userTag", tagMatch);
                }
            }
        },
        updateZPrizeList({ state, commit, dispatch }) {
            console.log("updateZPrizeList");
            let result = state.getIn(['$loading', 'getZZPrizeList']);
            if ((!result.isLoading) && result.type === 'SUCCESS' && result.code == '20000') {
                let prizeList = state.getIn(['$result', 'getZZPrizeList']);
                if (prizeList && prizeList.length) {
                    prizeList = prizeList.map(({ picture: icon, name, type, activityId, id }) => { return { name: id, icon, activityId, type }; });
                    commit("prizeList", { prizeList, prizeName: prizeList[0].name, currentIndex: 0 });
                }
            }
            let activityId = state.getIn(['activityId']);
            activityId && dispatch('$service:getZZLotteryMsg', { activityId });
        },
        updateRemainLottery({ state, commit }) {
            console.log("updateRemainLottery");
            let result = state.getIn(['$loading', 'getZZLotteryMsg']);
            if ((!result.isLoading) && result.type === 'SUCCESS' && result.code == '20000') {
                let remainLotteryNumber = state.getIn(['$result', 'getZZLotteryMsg', 'remainLotteryNumber'], 0);
                commit("remainLotteryNumber", { remainLotteryNumber, disabled: false });
                let { Tracker } = getApp();
                Tracker && Tracker.setData && Tracker.setData("remainLotteryNumber", remainLotteryNumber);
            }
        },
        updatePrizeResult({ state, commit }) {
            console.log("updateRemainLottery");
            let result = state.getIn(['$loading', 'getPrize']);
            if ((!result.isLoading) && result.type === 'SUCCESS' && result.code == '20000') {
                let textMap = Object.assign({ "BusQrcode": "去乘车", "Guidance": "明日快速抽奖通道" }, state.getIn(['textMap'], {}));
                let res = state.getIn(['$result', 'getPrize'], {});
                let type1 = res.type;
                res.type = CodeMap["" + res.type];
                res.type1 = type1;
                let moneyLen = 0;
                let { amount: money, content } = res;
                if (res.type == "BusCoupons") {
                    res.title = textMap["BusCouponsTitle"] || "恭喜你抽中";
                    res.button1Action = "BusQrcode";
                    res.button2Action = "Guidance";
                    if (type1 == '1') {
                        res.text1 = "乘公交车自动抵扣";
                    }
                    else {
                        res.text1 = '使用时自动抵扣';
                    }
                    if (money) {
                        moneyLen = ("" + money).length;
                        if (moneyLen > 4)
                            moneyLen = 4;
                    }
                }
                else if (res.type == "LinkCoupons") {
                    res.title = textMap["LinkCouponsTitle"] || "别灰心，明天再来~";
                    res.button2Action = "BusQrcode";
                    res.button1Action = "Guidance";
                    if (typeof content == 'string' && content.indexOf("{") > -1) {
                        try {
                            content = JSON.parse(content);
                            res = Object.assign(res, content);
                        }
                        catch (err) {
                        }
                    }
                    else if (typeof content == 'object') {
                        res = Object.assign(res, content);
                    }
                }
                else if (res.type == "NONE") {
                    res.title = textMap["NoneTitle"] || "今日次数已用完，明天再来~";
                    res.button2Action = "BusQrcode";
                    res.button1Action = "Guidance";
                }
                res.button1 = textMap[res.button1Action];
                res.button2 = textMap[res.button2Action];
                commit("UPDATE_PRIZE_RESULT", { prizeResult: Object.assign({ typeClass: "modal-type", money, moneyLen, success: true }, res) });
            }
            else {
                commit("UPDATE_PRIZE_RESULT", { prizeResult: { success: false, type: "NONE", title: "别灰心，明天再来~" } });
            }
        }
    }
});
function updateCard({ state }) {
    let app = getApp();
    let cardList = app.cardList;
    let eleCards = [];
    if (cardList && cardList.length) {
        let ele_cards = state.getIn('ele_cards', {});
        if (Object.keys(ele_cards).length) {
            eleCards = cardList.map((t) => {
                let c = Object.assign(Object.assign({}, ele_cards[t.cardType]), t);
                c.balanceMode = c.balanceMode == 'NORMAL' || c.balanceMode == 'NORAML';
                let account = state.getIn('account', {});
                if (c.balanceMode) {
                    let { balance, balanceTitle, hasBind } = account;
                    Object.assign(c, { balance, balanceTitle, hasBind });
                }
                return c;
            });
        }
    }
    return eleCards;
}
function loadHomeIcon({ ele_cards, travelIcon, iconPage }) {
    let homeIcon = [];
    let pageJson = iconPage;
    if (pageJson || (travelIcon && travelIcon.length)) {
        let ele_icons = pageJson.ele_icons || [];
        if (travelIcon && travelIcon.length) {
            ele_icons = ele_icons.concat(travelIcon);
        }
        if (ele_icons && ele_icons.length) {
            console.log("HomeIcon ele_icons", ele_icons.length);
            ele_icons = ele_icons.map((t, index) => {
                if (!t.priority) {
                    t.priority = 0;
                }
                else {
                    t.priority = +t.priority;
                }
                t.index = index;
                t.icon_id = t.icon_id || '_' + common.hashCode(t.icon_name);
                return t;
            });
            ele_icons = ele_icons.filter((t) => (t.default_home === 'true' || t.default_home === true || t.default_home === '1'));
            ele_icons = ele_icons.sort((t1, t2) => {
                if (t2.priority == t1.priority) {
                    return t1.index - t2.index;
                }
                return ((t2.priority || 0) - (t1.priority || 0));
            });
            homeIcon = ele_icons;
            console.log("HomeIcon defaultIcon filter", ele_icons.length);
        }
    }
    else {
        console.log("HomeIcon defaultIcon NONE");
    }
    let app = getApp();
    if (homeIcon && homeIcon.length) {
        homeIcon = homeIcon.filter((t) => {
            let match = false;
            if (t.card_type) {
                t.card_type.forEach((card_type) => {
                    if (ele_cards && ele_cards[card_type] && ele_cards[card_type].status === 'received') {
                        match = true;
                    }
                });
            }
            else if (t.card_status) {
                let card_type = app.cardType;
                if (ele_cards && ele_cards[card_type] && ele_cards[card_type].status === 'received') {
                    match = true;
                }
            }
            else {
                match = true;
            }
            return match;
        });
        console.log("HomeIcon ele_cards filter", homeIcon.length);
    }
    let ele_box_icon = homeIcon.slice(0, 4);
    return ele_box_icon;
}
function updateCardmark({ state }) {
    timeEn && console.time("time-updateCardmark");
    let cardMark = {};
    let app = getApp();
    let cardList = app.cardList;
    if (cardList && cardList.length && cardList[0] && cardList[0].cardType) {
        let cardRelativeTarget = state.getIn('cardRelativeTarget', {});
        let hasBind = state.getIn(['account', 'hasBind'], false);
        cardRelativeTarget = cardRelativeTarget[cardList[0].cardType] || cardRelativeTarget.cardInfo;
        if (cardRelativeTarget) {
            let mark = {};
            mark.bgColor = cardRelativeTarget.card_mark_bg;
            mark.textColor = cardRelativeTarget.card_mark_text_color;
            let text = hasBind ? cardRelativeTarget.card_bound_mark_text : cardRelativeTarget.card_mark_text;
            if (text) {
                let num = text.replace(/[^0-9.]/ig, "");
                if (num && num.length) {
                    let text1 = text.split(num);
                    mark.text1 = ['', '', ''];
                    mark.text1[0] = text1[0];
                    mark.text1[1] = '\n' + num;
                    mark.text1[2] = text1[1];
                }
                else {
                    mark.text = text;
                    mark.text1Large = text && text.length == 1;
                }
            }
            mark.markUrl = cardRelativeTarget.card_mark_url;
            mark.fontSize = cardRelativeTarget.card_mark_font_size;
            cardMark[cardList[0].cardType] = mark;
        }
    }
    timeEn && console.timeEnd("time-updateCardmark");
    return cardMark;
}
function checkSwitch(data, trueValue, defaultValue) {
    if (data == trueValue)
        return true;
    if (data == undefined || data == null) {
        return defaultValue;
    }
    return false;
}
async function getPageJSON(pageUrl) {
    let app = getApp();
    let globalData = app.globalData;
    let appId = app.appId;
    let aliUserId = app.alipayId;
    let result;
    {
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
                    result = ({
                        pageUrl,
                        data: local
                    });
                    console.log('getPageJSON use Storage');
                    timeEn && console.timeEnd("time-getPageJSON-" + pageUrl);
                    return result;
                }
            }
            catch (err) {
                console.warn(err, 'getStorageSync fail');
            }
            let res = await pageJson.queryPageJson({ appId, aliUserId, locationId, templateId, key });
            console.log('getPageJSON queryPageJson await', res);
            if (res && res.success && res.data) {
                let data = common.replaceJSON(res.data, app.replaceConfig);
                result = ({
                    pageUrl,
                    data
                });
                globalData.set(`PAGE_JSON_${locationId}_${templateId}`, data, { expire: 30 * 60000 });
            }
            else if (local) {
                console.log('getPageJSON queryPageJson fail use local');
                result = ({
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
    return result;
}
async function rpcCardInfo() {
    let app = getApp();
    let result = {};
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
                        result[card.cardType] = ({ cardType: card.cardType, data: res });
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
                        result[card.cardType] = ({ cardType: card.cardType, data: res });
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
                result[card.cardType] = ({ cardType: card.cardType, data: Object.assign(Object.assign({}, CARD_MOCK[index]), { cardType: card.cardType }) });
            });
        }
    }
    catch (err) {
        console.error(err);
    }
    return result;
}
async function getECH5CardInfo() {
    timeEn && console.time("time-getECH5CardInfo");
    let result;
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
            result = { balance: balance, balanceTitle: balanceTitle };
        }
        else {
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
                        result = accounts[0];
                    }
                    else {
                        result = {
                            cardType,
                            status,
                            hasBind,
                            cardId,
                            disabled,
                            disabledTips
                        };
                    }
                }
            }
        }
    }
    catch (err) {
        console.error(err);
    }
    timeEn && console.timeEnd("time-getECH5CardInfo");
    return result;
}
async function getHomePage() {
    let result;
    try {
        timeEn && console.time("time-getHomePage");
        timeEn && console.time("time-getHomePage-getStorageSync");
        let globalData = getApp().globalData;
        globalData.getHomeCount = (globalData.getHomeCount || 0) + 1;
        if (globalData.getHomeCount == 2) {
            console.log("getHomePage 正在调用，稍等片刻");
            await common.sleep(100);
        }
        let local = await globalData.get("HOME_PAGE_JSON");
        timeEn && console.timeEnd("time-getHomePage-getStorageSync");
        let success;
        let cardPage;
        if (local) {
            success = true;
            cardPage = local;
            globalData.getHomeCount = 0;
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
                globalData.getHomeCount = 0;
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
                    priority: 1,
                    group_id: 'travel_service',
                    icon_id: '_' + common.hashCode(t.icon_name)
                }, t);
            }));
            all_service_icon && all_service_icon.length && (ele_icons = ele_icons.concat(all_service_icon));
            travel_service_icon && travel_service_icon.length && (travel_service_icon = travel_service_icon.map((t) => {
                return Object.assign({
                    card_status: true,
                    priority: 1,
                    group_id: 'travel_service',
                    icon_id: '_' + common.hashCode(t.icon_name)
                }, t);
            }));
            travel_service_icon && travel_service_icon.length && (ele_icons = ele_icons.concat(travel_service_icon));
            result = { cardRelativeTarget: cardPage, travelIcon: ele_icons };
        }
        timeEn && console.timeEnd("time-getHomePage-success");
    }
    catch (err) {
        console.error(err);
    }
    timeEn && console.timeEnd("time-getHomePage");
    return result;
}
