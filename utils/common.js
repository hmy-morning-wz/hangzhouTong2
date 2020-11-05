const qs = {
    parse: function (str) {
        if (!str || str.length == 0)
            return {};
        let list = str.split('&');
        if (!list || list.length == 0)
            return {};
        let out = {};
        for (let index = 0; index < list.length; index++) {
            let set = list[index].split('=');
            set && set.length > 1 && (out[set[0]] = decodeURIComponent(set[1]));
        }
        return out;
    },
    stringify: function (data) {
        if (!data)
            return '';
        let list = [];
        for (let key in data) {
            if (data[key] instanceof Array && data[key].length) {
                data[key].forEach((t) => {
                    list.push(key + '=' + encodeURIComponent(t));
                });
            }
            else {
                list.push(key + '=' + encodeURIComponent(data[key]));
            }
        }
        return list.join('&');
    }
};
function handleNavigateScheme(jump, option) {
    let url;
    if (typeof jump == 'string') {
        url = jump;
    }
    else if (jump) {
        url = jump.url;
    }
    if (!url) {
        return false;
    }
    let navigate = {};
    let i = url.indexOf("?");
    if (i == -1) {
        return false;
    }
    let str = url.substring(i + 1);
    let query = qs.parse(str);
    if (url.indexOf('my://miniapp') == 0) {
        let { appId, path, extraData } = query;
        my.navigateToMiniProgram({
            appId,
            path,
            extraData,
            fail: (res) => {
                let { globalData } = getApp();
                my.reportAnalytics("jsapi_fail", { api: "navigateToMiniProgram",
                    file: "common.ts/handleNavigateScheme",
                    timestamp: +Date.now(),
                    extra: JSON.stringify(query),
                    appId,
                    path,
                    userId: globalData.userId,
                    err: JSON.stringify(res) });
            }
        });
    }
    else if (url.indexOf('my://alipaypage') == 0) {
        let { path } = query;
        my.ap.navigateToAlipayPage({
            path,
            fail: (err) => {
                console.error(err);
            }
        });
    }
    else if (url.indexOf('my://startapp') == 0) {
        let { appId, param } = query;
        if (typeof param === 'string' && param.indexOf('{') == 0) {
            param = JSON.parse(param);
        }
        param = param || {};
        let globalData = getApp().globalData;
        param = Object.assign({ chInfo: 'ch_' + globalData.appId }, param);
        my.call('startApp', {
            appId,
            param
        });
    }
    else if (url.indexOf('my://navigate') == 0) {
        my.navigateTo({
            url: query.url
        });
    }
    else if (url.indexOf('my://redirect') == 0) {
        my.redirectTo({
            url: query.url
        });
    }
    else if (url.indexOf('https://') == 0) {
        let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url);
        my.navigateTo({
            url: url_path
        });
    }
    else if (url.indexOf('alipays://') == 0) {
        my.ap.navigateToAlipayPage({
            path: url,
            fail: (err) => {
                console.error(err);
            }
        });
    }
    else {
        return false;
    }
    return true;
}
function intValue(num) {
    var MAX_VALUE = 0x7fffffff;
    var MIN_VALUE = 0x00;
    if (num > MAX_VALUE || num < MIN_VALUE) {
        return num &= 0x7FFFFFFF;
    }
    return num;
}
function isNull(str) {
    return str === undefined || str === null || str === '' || str.length === 0;
}
function sleep(time) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve();
            }, time || 0);
        }
        catch (e) {
            reject(e);
        }
    });
}
export default {
    qs,
    getSystemInfoSync: async () => {
        let loading = (my.$mySystemInfo && my.$mySystemInfo.loading);
        if (loading) {
            let count = 0;
            do {
                await sleep(50);
                if (my.$mySystemInfo && my.$mySystemInfo.success) {
                    break;
                }
            } while (count++ < 10);
        }
        if (my.$mySystemInfo && my.$mySystemInfo.success) {
            console.log("common getSystemInfoSync from systemInfo");
            return Promise.resolve(my.$mySystemInfo);
        }
        my.$mySystemInfo = { loading: true };
        return new Promise((resolve, reject) => {
            my.getSystemInfo({
                success: (res) => {
                    my.$mySystemInfo = Object.assign({ success: true }, res);
                    resolve(res);
                },
                fail: () => {
                    my.$mySystemInfo && (my.$mySystemInfo.loading = false);
                    reject();
                }
            });
        });
    },
    getStorageSync: (data) => {
        let { key } = data;
        return new Promise((resolve, reject) => {
            my.getStorage({
                key: key,
                success: (res) => {
                    resolve(res);
                },
                fail: () => {
                    reject();
                }
            });
        });
    },
    setStorageSync: (d) => {
        let { key, data } = d;
        return new Promise((resolve, reject) => {
            my.setStorage({
                key,
                data,
                success: () => {
                    resolve();
                },
                fail: () => {
                    reject();
                }
            });
        });
    },
    makeUrl: (url, data) => {
        let index = url && url.indexOf('?');
        return index && index > -1 ? url + "&" + qs.stringify(data) : url + "?" + qs.stringify(data);
    },
    hashCode: (strKey) => {
        var hash = 0;
        if (strKey && !isNull(strKey)) {
            for (var i = 0; i < strKey.length; i++) {
                hash = hash * 31 + strKey.charCodeAt(i);
                hash = intValue(hash);
            }
        }
        return hash.toString(16);
    },
    replaceJSON: (json, config = {}) => {
        let keys = config && Object.keys(config);
        let jsonString = typeof json === 'string' ? json : JSON.stringify(json);
        keys && keys.forEach((key) => {
            let keyName = new RegExp(`{${key}}`, 'g');
            config[key] && jsonString.indexOf(`{${key}}`) && (jsonString = jsonString.replace(keyName, config[key]));
        });
        let jsonObject = jsonString.indexOf("{") > -1 && jsonString.indexOf('}') > -1 && JSON.parse(jsonString);
        return jsonObject;
    },
    handleNavigate: async (options, gd) => {
        let globalData = gd || getApp().globalData;
        if (options && typeof options == 'string' && options.indexOf("{") > -1) {
            try {
                options = JSON.parse(options);
            }
            catch (err) {
                console.error(err);
            }
        }
        let { redirectTo, url, url_type } = options;
        if (url && !url_type) {
            let ret = handleNavigateScheme(options);
            if (ret) {
                console.log('my Scheme jump', options);
                return;
            }
        }
        redirectTo = redirectTo == '1' || redirectTo == 'true' || redirectTo == true;
        console.log('跳转', options.url_type, options.url_path);
        try {
            switch (options.url_type) {
                case 'selfWebview':
                    let url_path = '/pages/webview/webview?url=' + encodeURIComponent(options.url_path);
                    if (redirectTo) {
                        my.redirectTo({
                            url: url_path
                        });
                    }
                    else {
                        my.navigateTo({
                            url: url_path
                        });
                    }
                    break;
                case 'self':
                    {
                        let url_path = options.url_path;
                        if (url_path) {
                            let globalData = getApp().globalData;
                            if (url_path.indexOf('{userId}') > -1) {
                                url_path = url_path.replace('{userId}', globalData.alipayId);
                            }
                            if (url_path.indexOf('{appId}') > -1) {
                                url_path = url_path.replace('{appId}', globalData.appId);
                            }
                            if (url_path.indexOf('{formId}') > -1) {
                                globalData.formId && (url_path = url_path.replace('{formId}', globalData.formId));
                            }
                            if (url_path.indexOf('{cityCode}') > -1) {
                                url_path = url_path.replace('{cityCode}', globalData.cityInfo.cityCode);
                            }
                            if (url_path.indexOf('{cityName}') > -1) {
                                url_path = url_path.replace('{cityName}', globalData.cityInfo.cityName);
                            }
                            if (url_path.indexOf('{cardNo}') > -1) {
                                url_path = url_path.replace('{cardNo}', globalData.cardNo);
                            }
                            if (url_path.indexOf('{cToken}') > -1) {
                                let ctoken = await globalData.get('ech5');
                                url_path = url_path.replace('{cToken}', ctoken);
                            }
                        }
                        console.log("self new url", url_path);
                        if (options.url_path.indexOf("dynamic-plugin://") == 0) {
                            let reg = /^dynamic-plugin:\/\/\d{16}\//;
                            let reg1 = /\d{16}/;
                            let result = options.url_path.match(reg);
                            let appId = "";
                            if (result && result.length) {
                                appId = result[0].match(reg1)[0];
                            }
                            appId && my.loadPlugin({
                                plugin: `${appId}@*`,
                                success: async () => {
                                    if (redirectTo) {
                                        my.redirectTo({
                                            url: url_path
                                        });
                                    }
                                    else {
                                        my.navigateTo({
                                            url: url_path
                                        });
                                    }
                                },
                            });
                        }
                        else if (url_path.indexOf('plugin://') == 0) {
                            if (redirectTo) {
                                my.redirectTo({
                                    url: url_path
                                });
                            }
                            else {
                                my.navigateTo({
                                    url: url_path
                                });
                            }
                        }
                        else {
                            if (redirectTo) {
                                my.redirectTo({
                                    url: url_path
                                });
                            }
                            else {
                                my.navigateTo({
                                    url: url_path
                                });
                            }
                        }
                    }
                    break;
                case 'startApp':
                    {
                        let url_data = options.url_data || {};
                        if (typeof url_data === 'string' && url_data.indexOf('{') >= 0) {
                            try {
                                url_data = JSON.parse(url_data);
                            }
                            catch (err) {
                                console.warn(err);
                            }
                        }
                        let url_path = options.url_path;
                        if (url_path) {
                            if (url_path.indexOf('{userId}') > -1) {
                                url_path = url_path.replace('{userId}', globalData.alipayId);
                            }
                            if (url_path.indexOf('{appId}') > -1) {
                                url_path = url_path.replace('{appId}', globalData.appId);
                            }
                            if (url_path.indexOf('{formId}') > -1) {
                                globalData.formId && (url_path = url_path.replace('{formId}', globalData.formId));
                            }
                            if (url_path.indexOf('{cityCode}') > -1) {
                                url_path = url_path.replace('{cityCode}', globalData.cityInfo.cityCode);
                            }
                            if (url_path.indexOf('{cityName}') > -1) {
                                url_path = url_path.replace('{cityName}', globalData.cityInfo.cityName);
                            }
                        }
                        let param = {
                            chInfo: 'ch_' + globalData.appId
                        };
                        options.appId = options.appId || options.url_remark || '20000042';
                        if (options.appId === '20000042') {
                            param.publicBizType = options.publicBizType || 'LIFE_APP';
                            param.publicId = options.publicId || '2018052160219015';
                        }
                        Object.assign(param, url_data);
                        url_path && (param.url = url_path);
                        console.log('startApp', param);
                        my.call('startApp', {
                            appId: (options.appId),
                            param
                        });
                    }
                    break;
                case 'alipay':
                    console.log(options.url_path);
                    if (options.url_remark == 'plugin') {
                        let plugin = requirePlugin("myPlugin");
                        if (plugin && plugin.call) {
                            plugin.call("navigateToAlipayPage", { path: options.url_path });
                        }
                    }
                    else {
                        my.ap.navigateToAlipayPage({
                            path: options.url_path,
                            fail: (err) => {
                                my.alert({
                                    content: JSON.stringify(err)
                                });
                            }
                        });
                    }
                    break;
                case 'miniapp':
                    {
                        let url_data = options.url_data || {};
                        if (typeof url_data === 'string' && url_data.indexOf('{') >= 0) {
                            try {
                                url_data = JSON.parse(url_data);
                            }
                            catch (err) {
                                console.warn(err);
                            }
                        }
                        if (url_data && url_data.url) {
                            let url_path = url_data.url;
                            if (url_path.indexOf('{userId}') > -1) {
                                url_path = url_path.replace('{userId}', globalData.alipayId);
                            }
                            if (url_path.indexOf('{appId}') > -1) {
                                url_path = url_path.replace('{appId}', globalData.appId);
                            }
                            if (url_path.indexOf('{formId}') > -1) {
                                await globalData.getFormId();
                                globalData.formId && (url_path = url_path.replace('{formId}', globalData.formId));
                            }
                            if (url_path.indexOf('{cityCode}') > -1) {
                                url_path = url_path.replace('{cityCode}', globalData.cityInfo.cityCode);
                            }
                            if (url_path.indexOf('{cityName}') > -1) {
                                url_path = url_path.replace('{cityName}', globalData.cityInfo.cityName);
                            }
                            url_data.url = url_path;
                        }
                        console.log('miniapp跳转', options.url_remark, options.url_path, url_data);
                        my.navigateToMiniProgram({
                            appId: options.url_remark,
                            path: options.url_path,
                            extraData: url_data,
                            fail: (res) => {
                                my.reportAnalytics("jsapi_fail", {
                                    api: "navigateToMiniProgram",
                                    file: "common.ts/handleNavigate",
                                    timestamp: +Date.now(),
                                    extra: JSON.stringify(options),
                                    appId: options.url_remark,
                                    path: options.url_path,
                                    userId: globalData.userId,
                                    err: JSON.stringify(res)
                                });
                            }
                        });
                    }
                    break;
                case 'smkOut ':
                case 'h5Out':
                    {
                        let url = options.url_path;
                        if (url.indexOf('{userId}') > -1) {
                            url = url.replace('{userId}', globalData.alipayId);
                        }
                        if (url.indexOf('{appId}') > -1) {
                            url = url.replace('{appId}', globalData.appId);
                        }
                        if (url.indexOf('{formId}') > -1) {
                            await globalData.getFormId();
                            globalData.formId && (url = url.replace('{formId}', globalData.formId));
                        }
                        if (url.indexOf('{cityCode}') > -1) {
                            url = url.replace('{cityCode}', globalData.cityInfo.cityCode);
                        }
                        if (url.indexOf('{cityName}') > -1) {
                            url = url.replace('{cityName}', globalData.cityInfo.cityName);
                        }
                        my.call('startApp', {
                            appId: '20000067',
                            param: {
                                url: url,
                                chInfo: 'ch_' + globalData.appId
                            }
                        });
                        console.log('startApp 20000067', url);
                    }
                    break;
                case 'none':
                case '':
                    break;
                default:
                    break;
            }
        }
        catch (err) {
            console.error(err);
        }
    },
    checkUpdate: () => {
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
    },
    makeTaskId: (sellerId, taskType) => {
        const taskTypeMap = {
            "1": "M",
            'member': "M",
            '2': "F",
            'follow': "F",
            "3": "S",
            'shop': "S"
        };
        return "_618_" + sellerId + "-" + (taskTypeMap[taskType] || "NONE");
    },
    makeTaskName: (taskType) => {
        const taskTypeMap = {
            "1": "入会",
            'member': "入会",
            '2': "关注",
            'follow': "关注",
            "3": "到店",
            'shop': "到店"
        };
        return (taskTypeMap[taskType] || "");
    },
    myTaskId: (taskType) => {
        const taskTypeMap = {
            "1": "member",
            'member': "member",
            '2': "follow",
            'follow': "follow",
            "3": "shop",
            'shop': "shop"
        };
        return (taskTypeMap[taskType] || "");
    },
    getImageUrl: (url) => {
        return new Promise((r, v) => {
            my.getStorage({
                key: url, success: (res) => {
                    console.log("getStorage", res);
                    if (!res.data) {
                        my.canIUse('downloadFile') && my.downloadFile({
                            url, success: (res) => {
                                console.log("downloadFile", res);
                                let apFilePath = res === null || res === void 0 ? void 0 : res.apFilePath;
                                if (apFilePath) {
                                    my.setStorage({ key: url, data: apFilePath });
                                    r(url);
                                }
                                else {
                                    r(url);
                                }
                            }
                        });
                    }
                    else {
                        r(url);
                    }
                }, fail: () => {
                    console.log("getStorage fail");
                    r(url);
                }
            });
        });
    },
    crossImage: function (src, opt = {}) {
        if (!src) {
            return "";
        }
        let { width, height, systemInfo } = opt;
        let distImage = src;
        if (src.indexOf('.webp') > -1 || src.indexOf('.svg') > -1 || src.indexOf('.gif') > -1 || src.indexOf('x-oss-process') > -1) {
            return src;
        }
        if (src.indexOf('noOssProcess') == -1) {
            if (src.indexOf('aliyuncs.com') > -1 || src.indexOf('images.allcitygo.com') > -1) {
                if (src.indexOf('http://') > -1)
                    src = src.replace('http://', 'https://');
                systemInfo = systemInfo || getApp().systemInfo;
                if (systemInfo) {
                    let pixelRatio = systemInfo.pixelRatio || 1;
                    let screenWidth = (systemInfo.screen && systemInfo.screen.width && (pixelRatio * systemInfo.screen.width)) || systemInfo.screenWidth;
                    if (screenWidth && screenWidth < 750) {
                        width = Math.floor(screenWidth * width / 750);
                        if (height) {
                            height = Math.floor(screenWidth * height / 750);
                        }
                    }
                }
                let ossProcess = width ? `?x-oss-process=image/resize,m_fill,h_${height || width},w_${width}/format,webp` : '?x-oss-process=image/format,webp';
                distImage = `${src}${ossProcess}`;
            }
        }
        return distImage;
    },
    pageJsonFilter: function (pageUrl, option) {
        return (item) => {
            let b = item.pageUrl === pageUrl;
            if (!b) {
                return b;
            }
            if (!item.regular || item.regular.length == 0)
                return b;
            else if (option) {
                for (let i = 0; i < item.regular.length; i++) {
                    try {
                        let reg = new RegExp(item.regular[i]);
                        for (let key in option) {
                            if (reg.test(option[key])) {
                                console.log("match", item.regular[i], key, option[key]);
                                return b;
                            }
                        }
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
                return false;
            }
            return b;
        };
    },
    sleep
};
