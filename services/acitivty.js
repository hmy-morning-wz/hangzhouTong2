const MOCK = false;
export default {
    getHotValue(list, option) {
        return {
            url: '/hotTopic/getClick',
            nextAction: "calHotValue",
            cache: false,
            method: "POST",
            retry: true,
            data: list,
            businessConfig: {
                urlType: 'activity',
                headers: {
                    'content-type': 'application/json'
                }
            },
            mock: {
                on: false,
                delay: 2000,
                data: {
                    code: 0,
                    msg: "Success",
                    data: MOCK && list.map((t) => {
                        return {
                            hotTopicId: t,
                            clickCount: Math.trunc((Math.random() * 100))
                        };
                    })
                }
            }
        };
    }
};
