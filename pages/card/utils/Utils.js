
// 时间
const getTimestamp = () => {
    return Math.floor(new Date().getTime() / 1000);
};

const arrayFind = (arr, predicate) => {
    if (!arr) {
    return null;
  }

  for (let i = 0; i < arr.length; i += 1) {
    if (predicate(arr[i], i)) {
      return arr[i];
    }
  }
};

const formatRMBYuanDecimal = (fen) => {
    return (fen / 100).toFixed(2);
};

const getAccountByType = (arr, tp) => {
    return arrayFind(arr, item => item.type === tp);
};

const isIOS = () => {
  if (getApp().systemInfo && getApp().systemInfo.platform) {
    return getApp().systemInfo.platform === 'iOS';
  } else {
    return false;
  }
};

export default {
    getTimestamp,
    arrayFind,
    formatRMBYuanDecimal,
    getAccountByType,
    isIOS,
};