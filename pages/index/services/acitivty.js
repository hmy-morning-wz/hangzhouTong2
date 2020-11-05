const MOCK = false;
export default {
    getZZPrizeList({ activityId }, option) {
        return {
            url: `/game/getZZPrizeList`,
            nextAction: "updateZPrizeList",
            cache: false,
            method: "GET",
            retry: true,
            data: { activityId },
            businessConfig: {
                urlType: 'game',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: MOCK && [{
                            activityId: 0,
                            id: '0',
                            type: 1,
                            picture: 'https://zos.alipayobjects.com/rmsportal/dexmbhnbsLRGIZGBqTcA.png',
                            name: "谢谢参与",
                        }, {
                            activityId: 0,
                            type: 1,
                            id: 1,
                            picture: "https://zos.alipayobjects.com/rmsportal/nxpXbcNBOmbeIOVCUsuS.png",
                            name: "666元红包",
                        }, {
                            activityId: 0,
                            type: 1,
                            id: 2,
                            picture: "https://zos.alipayobjects.com/rmsportal/RxQruKQwiQCeYXhvwCfP.png",
                            name: "1元红包",
                        }, {
                            activityId: 0,
                            type: 1,
                            id: 3,
                            picture: "https://zos.alipayobjects.com/rmsportal/tyMAYvTdjRFOVxqWVhsj.png",
                            name: "3元红包",
                        }, {
                            activityId: 0,
                            type: 1,
                            id: 4,
                            picture: "https://zos.alipayobjects.com/rmsportal/dexmbhnbsLRGIZGBqTcA.png",
                            name: "谢谢参与",
                        }, {
                            activityId: 0,
                            type: 1,
                            id: 5,
                            picture: "https://zos.alipayobjects.com/rmsportal/RxQruKQwiQCeYXhvwCfP.png",
                            name: "1元红包",
                        }, {
                            activityId: 0,
                            type: 1,
                            id: 0,
                            picture: "https://zos.alipayobjects.com/rmsportal/dexmbhnbsLRGIZGBqTcA.png",
                            name: "谢谢参与",
                        }, {
                            activityId: 0,
                            type: 1,
                            id: 6,
                            picture: "https://zos.alipayobjects.com/rmsportal/qanDEFeGBoiPflYxkhJY.png",
                            name: "5元红包",
                        }].sort(() => Math.random() > .5 ? -1 : 1)
                }
            }
        };
    },
    getZZLotteryMsg({ activityId }, option) {
        return {
            url: `/game/getZZLotteryMsg`,
            nextAction: "updateRemainLottery",
            cache: false,
            method: "POST",
            retry: true,
            data: { activityId, userId: option.userId },
            businessConfig: {
                urlType: 'game',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: MOCK && { remainLotteryNumber: 10 }
                }
            }
        };
    },
    getPrize({ activityId }, option) {
        return {
            url: `/game/getPrize`,
            nextAction: "updatePrizeResult",
            cache: false,
            method: "POST",
            retry: true,
            data: { activityId, userId: option.userId },
            businessConfig: {
                urlType: 'game',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: MOCK && {
                        prizeId: '0',
                        name: "5元红包",
                        type: 1,
                        picture: "https://zos.alipayobjects.com/rmsportal/qanDEFeGBoiPflYxkhJY.png",
                        content: '{"url_path":"pages/home/index","url_type":"miniapp","url_data":{"channel":"tklcshhysk"},"url_remark":"2018103161909533"}',
                        amount: 0.2,
                    }
                }
            }
        };
    },
    checkTag(data, option) {
        return {
            url: `/game/check`,
            nextAction: "updateUserTag",
            cache: false,
            method: "GET",
            retry: true,
            data: { userId: option.userId },
            businessConfig: {
                urlType: 'game',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: MOCK,
                delay: 2000,
                data: {
                    code: 20000,
                    msg: "Success",
                    data: MOCK && 1
                }
            }
        };
    },
};
