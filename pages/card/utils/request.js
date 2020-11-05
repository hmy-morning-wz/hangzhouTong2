const STATUS_OK = 200;
const STATUS_REDIRECT = 302;
const SERVICE_UNAVAILABLE = 405;

function doRequest(options) {
    console.log('api 调用信息: ', options);
    return new Promise((resolve, reject) => {
        my.request({
          ...options,
          success: (res) => {
            console.log('SUCCESS> ', res,"  STATUS> ",res.status," DATA> ",JSON.parse(res.data));
            if (res.status === 200) {
                let data = JSON.parse(res.data)
                 resolve(data)
                 //if(data.code===500) fallbackError(options.url,data.code,res)
            } else {
                // fallbackError(options.url,res.status,res)
                reject(new Error(`${res.status}`));
            }
          },
          fail: (res) => {
            console.error("FAIL> ",options, res);
            reject(res);
          }
        });
    });
}

const encodeQueryString = (query) => {
    return Object.keys(query || {}).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&');
};

const makeUrl = (url, params) => {
    const ps = encodeQueryString(params);
    return ps.length > 0 ? `${url}?${ps}` : url;
};

function doGet(url, query, options) {
    const opts = options || {};

    return doRequest({
        url: `${url}?${encodeQueryString(query)}`,
        headers: {'content-Type': 'application/x-www-form-urlencoded'},
        dataType: 'text',
        ...opts,
    });
}

function doPost(url, body, options) {
    const opts = options || {};

    return doRequest({
        url,
        method: 'POST',
        data: body,
        headers: {'content-Type': 'application/x-www-form-urlencoded'},
        dataType: 'text',
        ...opts,
    });
}

export default {
    STATUS_OK,
    STATUS_REDIRECT,
    SERVICE_UNAVAILABLE,
    doRequest,
    encodeQueryString,
    makeUrl,
    doGet,
    doPost,
};
