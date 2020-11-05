
// 支付中
const UNPAY = 0;

// 成功
const SUCCESS = 1;

// 失败
const ERROR = 2;

// 退款
const REFUND = 3;


// 无效的交易号
const INVALID_TRADE_NO = 100;


const AlipayResultCode = [
  {code: 9000, desc: '订单支付成功'},
  {code: 8000, desc: '正在处理中'},
  {code: 4000, desc: '订单支付失败'},
  {code: 6001, desc: '用户中途取消'},
  {code: 6002, desc: '网络连接出错'},
  {code: 6004, desc: '支付结果未知, 请查询充值记录中订单的支付状态'},
  {code: 99, desc: '用户退出'},
];

const getDesc = (code) => {
  const result = AlipayResultCode.find(ele => {
    return ele.code == code;
  });
  return (result && result.desc) || '支付结果未知';
};


const toName = (status) => {
  const names = {};

  names[UNPAY] = '未支付';
  names[SUCCESS] = '已付款';
  names[ERROR] = '异常';
  names[REFUND] = '已退款';

  return names[status] || `支付状态未知, 请到支付记录查询.`;
};

export default {
  UNPAY,
  SUCCESS,
  ERROR,
  REFUND,
  INVALID_TRADE_NO,

  toName,
  getDesc,
};
