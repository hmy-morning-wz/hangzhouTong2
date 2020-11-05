
// 用户取消
const USER_CANCEL_1 = "JSAPI_SERVICE_TERMINATED";

const USER_CANCEL_2 = "6001";

// 参数问题
const PARAM_INVALID = "JSAPI_PARAM_INVALID";

// 系统异常
const SYSTEM_ERROR = "JSAPI_SYSTEM_ERROR";


const toName = (failCode) => {
  const names = {};

  names[USER_CANCEL_1] = '已取消';
  names[USER_CANCEL_2] = '已取消';
  names[PARAM_INVALID] = '参数错误';
  names[SYSTEM_ERROR] = '系统异常';

  return names[failCode];
};

export default {
  toName,
};
