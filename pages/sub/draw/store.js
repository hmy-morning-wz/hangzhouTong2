import * as services from "../services/acitivty";
import parse from 'mini-html-parser2';
const { serviceplugin, servicesCreactor, herculex: Store } = getApp();
const activityIdDefault = 93;
const CodeMap = {
    "1": "BusCoupons",
    "2": "BusCoupons",
    "3": "LinkCoupons",
    "99": "NONE",
};
export default new Store({
    connectGlobal: true,
    state: {
        remainLotteryNumber: 0,
        activityId: activityIdDefault,
        tagMatch: false,
        prizeResult: {}
    },
    getters: {},
    plugins: ['logger', serviceplugin()],
    services: servicesCreactor(services),
    mutations: {
        UPDATE_PRIZE_RESULT: (state, res) => {
            state.prizeResult = res.prizeResult;
        }
    },
    actions: {
        async pageLoad({ commit, global, dispatch, state }) {
            dispatch("$service:checkTag");
            await dispatch('$global:getPageJSON', 'pages/sub/draw/draw');
            await dispatch("pageOnNextLoad");
        },
        async pageOnNextLoad({ state, commit, dispatch, global }, playlod) {
            let curpage = global.getIn(['pageJson', 'pages/sub/draw/draw'], {});
            let activityId = curpage['activityId'] || state.getIn(['activityId']);
            activityId && dispatch('$service:getZZPrizeList', { activityId: activityIdDefault });
            let { rule, drawTag } = curpage;
            let tagMatch = false;
            let { globalData, Tracker } = getApp();
            let tagOption = { userId: globalData === null || globalData === void 0 ? void 0 : globalData.userId };
            if (drawTag && drawTag.length) {
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
            curpage.rule = "";
            setTimeout(() => {
                var pattern = /<\/?[a-zA-Z]+(\s+[a-zA-Z]+=".*")*>/g;
                if (pattern.test(rule)) {
                    parse(rule, (err, nodes) => {
                        if (!err) {
                            commit("rule", { ruleRichText: nodes });
                        }
                    });
                }
                else {
                    commit("rule", {
                        ruleRichText: [{
                                name: 'div',
                                attrs: {
                                    class: 'text-item',
                                    style: 'color: #7696bb;',
                                },
                                children: [{
                                        type: 'text',
                                        text: rule,
                                    }],
                            }]
                    });
                }
            }, 0);
            let humantohumanSet = curpage.humantohumanSet;
            curpage.humantohumanSet = null;
            if (humantohumanSet && humantohumanSet.length) {
                humantohumanSet = humantohumanSet.map((t) => {
                    let money = t.money;
                    let moneyLen = 1;
                    if (money) {
                        moneyLen = ("" + money).length;
                        if (moneyLen > 2)
                            moneyLen = 2;
                    }
                    return Object.assign({ moneyLen }, t);
                });
            }
            commit("curpage", Object.assign(Object.assign({}, curpage), { humantohumanSet }));
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
