import store from './store';
import { jumpToBusCode } from '../../../components/card-component/utils';
import common from '../../../utils/common';
const createPage = function (options) {
    return Page(store.register(options));
};
const app = getApp();
createPage({
    data: {
        prizeList: [],
        prizeName: '',
        disabled: true,
        currentIndex: 0,
        tipText: '',
        showGuidance: false,
        showDialog: false,
        arrowPositions: [
            'bottom-left',
            'bottom-center',
            'bottom-right',
            'top-left',
            'top-center',
            'top-right',
            'left',
            'right',
        ],
        arrowPosIndex: 5,
        useButton: true,
        modalOpened: false,
    },
    async onLoad(query) {
        common.getSystemInfoSync().then((res) => {
            this.setData(Object.assign({}, res));
        });
        await this.dispatch('pageLoad');
        let { page_title } = this.data;
        page_title && my.setNavigationBar({
            title: page_title
        });
    },
    async onShow() {
        console.log("onShow");
    },
    async onStart() {
        this.setData({
            tipText: '正在抽奖...'
        });
        return new Promise(async (resolve, reject) => {
            let { remainLotteryNumber, textMap } = this.data;
            if (remainLotteryNumber <= 0) {
                this.setData({
                    modalOpened: true,
                    prizeResult: {
                        typeClass: "modal-type",
                        title: (textMap && textMap["NoneTitle"]) || "今日次数已用完，明天再来~",
                        button2Action: "BusQrcode",
                        button1Action: "Guidance",
                        button2: (textMap && textMap["BusQrcode"]) || "去乘车",
                        button1: (textMap && textMap["Guidance"]) || "明日快速抽奖通道",
                        type: "NONE"
                    }
                });
                return resolve({ success: false });
            }
            let { activityId } = this.data;
            await this.dispatch('$service:getPrize', { activityId });
            setTimeout(() => {
                let { prizeId: prizeName, success } = this.data.prizeResult || {};
                if (!success || !prizeName) {
                    my.showToast({ content: "系统开小差了，请稍后再试" });
                    resolve({ success: false });
                }
                else {
                    this.setData({
                        prizeName
                    }, () => {
                        resolve({ prizeName, success });
                    });
                }
            }, 500);
        });
    },
    onFinish({ activeIndex, prizeName, resultFail }) {
        let { remainLotteryNumber } = this.data;
        this.setData({
            currentIndex: activeIndex,
            tipText: `抽奖结果：${prizeName}`,
            remainLotteryNumber: remainLotteryNumber > 0 ? remainLotteryNumber - 1 : 0
        });
        if ((!resultFail)) {
            setTimeout(() => {
                this.setData({
                    disabled: false,
                    modalOpened: true,
                });
            }, 1000);
        }
        let { activityId } = this.data;
        this.dispatch('$service:getZZLotteryMsg', { activityId });
    },
    onModalClick() {
        this.setData({
            modalOpened: false,
        });
    },
    onCloseTap() {
        this.setData({ showGuidance: false });
    },
    actionClick() { },
    linkActionClick() { },
    onModalClose() {
        this.setData({
            modalOpened: false,
        });
    },
    onTapNotice() {
        console.log("onTapNotice");
        my.pageScrollTo({ scrollTop: 0 });
        this.setData({ showGuidance: true });
    },
    activityTap(e) {
        app.handleIconClick(e);
    },
    openVoucherListTap(e) {
        my.openVoucherList();
    },
    onLinkCouponsTap(e) {
        console.log(e);
        app.handleIconClick(e);
        this.setData({ modalOpened: false });
    },
    onPrizeResultTap1(e) {
        console.log(e);
        let { currentTarget: { dataset: { obj } } } = e;
        let action = obj === null || obj === void 0 ? void 0 : obj.button1Action;
        if (action == 'BusQrcode') {
            this.setData({ modalOpened: false });
            jumpToBusCode(getApp().cardType);
        }
        else if (action == 'Guidance') {
            my.pageScrollTo({ scrollTop: 0 });
            this.setData({ showGuidance: true, modalOpened: false });
        }
    },
    onPrizeResultTap2(e) {
        console.log(e);
        let { currentTarget: { dataset: { obj } } } = e;
        let action = obj === null || obj === void 0 ? void 0 : obj.button2Action;
        if (action == 'BusQrcode') {
            this.setData({ modalOpened: false });
            jumpToBusCode(getApp().cardType);
        }
        else if (action == 'Guidance') {
            my.pageScrollTo({ scrollTop: 0 });
            this.setData({ showGuidance: true, modalOpened: false });
        }
    }
});
