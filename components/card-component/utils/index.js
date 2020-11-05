var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) console.error(_e) ; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { console.error("Invalid attempt to destructure non-iterable instance"); } }; }();

// import { mockCards, mockTabs } from '../../mock';

var rpc = function rpc(type, params) {
  return new Promise(function (resolve, reject) {
    let timeId = setTimeout(()=>{
       console.log("rpc buscode_query_data_for_applet timeout reject")
       my.reportAnalytics('buscode_query_timeout');
       timeId &&  reject({error:"timeout"})
    },10000)
    try{
    console.log("rpc buscode_query_data_for_applet ")
    my.call('buscode_query_data_for_applet', {
      bizType: type,
      bizParam: JSON.stringify(params)
    }, function (res) {
      console.log("rpc buscode_query_data_for_applet result success")
      timeId && clearTimeout(timeId)
      timeId= 0      
      if (res && (res.success==='true' || res.success===true) ) {
        my.reportAnalytics('buscode_query_success');
        return resolve(JSON.parse(res.data));
      }
      let app = getApp()
      app.Tracker && app.Tracker.log('buscode_query_cb',{...res})
      my.reportAnalytics('buscode_query_reject');
      // console.log('请求失败请求失败请求失败请求失败请求失败')
      reject(res)
      // if (params.cardType === 'T2330100') {
      //   return resolve({
      //     cardModels: [{cardNo: 3100701142286479}],
      //     cardTitle: '杭州通支付宝月卡',
      //     cardType: 'T2330100',
      //     extInfo: {cardApplyUrl: 'https://gjyp.96225.com/qrCodeMTichet/applyCard.html'},
      //     styleConfig:{
      //       imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/oWXlTlCclYVcUhsBpvcf.png',
      //       codeLogo: '',
      //       logoUrl: 'https://zos.alipayobjects.com/rmsportal/xZpdTVoDJkISGbLQvgEk.png'
      //     }
      //   })
      // } else {
      //   return resolve({
      //     cardModels: [{cardNo: 3100701142286479}],
      //     cardTitle: '杭州通支付宝公交卡',
      //     cardType: 'T0330100',
      //     extInfo: {cardApplyUrl: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017011104993459&auth_skip=false&scope=auth_base&redirect_uri=https%3A%2F%2Fcitysvc.96225.com%2Fexthtml%2FalipayCard%2Fsrc%2Fpages%2Findex.html%3Ftype%3Dindex%26source%3Dalipay%26sence%3Dopen'},
      //     styleConfig:{
      //       imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/pYHsMlnkokGhKGRRjaYJ.png',
      //       codeLogo: '',
      //       logoUrl: 'https://zos.alipayobjects.com/rmsportal/xZpdTVoDJkISGbLQvgEk.png'
      //     }
      //   })
      // }
    });
    }catch(err){
      timeId && clearTimeout(timeId)
      timeId= 0
      my.reportAnalytics('buscode_query_catch');
      reject(err)
    }
  });
};

var qsParse = function qsParse(qs) {
  if (!qs) return {};
  var res = {};

  qs.split('&').forEach(function (item) {
    var _item$split = item.split('='),
      _item$split2 = _slicedToArray(_item$split, 2),
      k = _item$split2[0],
      v = _item$split2[1];

    res[k] = v;
  });

  return res;
};

export function getTabs(cardType) {
  // return mockTabs();
  return rpc('QUERY_APPLET_FUNCTION_LIST', { cardType: cardType });
}

export function getCardInfo(cardType) {
  // return mockCards();
  return rpc('QUERY_CARD_DETAIL', { cardType: cardType });
}

export function jumpToBusCode(cardType) {
  my.ap.navigateToAlipayPage({
    path: 'alipays://platformapi/startapp?appId=200011235&source=applet&cardType=' + cardType
  });
}

export function jumpToBusRecord(_ref) {
  var cardType = _ref.cardType,
    cardNo = _ref.cardNo;

  my.ap.navigateToAlipayPage({
    path: 'alipays://platformapi/startapp?appId=20000076&returnHome=NO&bizSubType=75&showSearch=false&title=%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95&cardType=' + cardType + '&cardNo=' + cardNo
  });
}

export function jumpToAlipayPage(path) {
  my.ap.navigateToAlipayPage({
    path: path
  });
}

export function jump(url) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref2$cardType = _ref2.cardType,
    cardType = _ref2$cardType === undefined ? '' : _ref2$cardType,
    _ref2$cardNo = _ref2.cardNo,
    cardNo = _ref2$cardNo === undefined ? '' : _ref2$cardNo;

  var inc = arguments[2];

  var target = url.replace('{cardType}', cardType).replace('{cardNo}', cardNo);
  var res = target.match(/^alipays:\/\/platformapi\/startapp\?appId=(\d+)&?(.*)$/);

  if (res) {
    // 有appId只能跳转至小程序
    if (res[1].length > 8) {
      // 开放平台
      if (inc) {
        my.call('startApp', {
          appId: res[1],
          param: {
            page: decodeURIComponent(qsParse(res[2]).page),
            query: decodeURIComponent(qsParse(res[2]).query)
          }
        });
      } else {
        my.navigateToMiniProgram({
          appId: res[1],
          path: decodeURIComponent(qsParse(res[2]).page),
          extraData: qsParse(decodeURIComponent(qsParse(res[2]).query)) // query=key%3Dvalue => {key: value}
        });
      }
    } else {
      jumpToAlipayPage(target);
    }
  } else {
    my.call('startApp', {
      appId: '20000067',
      param: { url: target },
      closeCurrentApp: false
    });
  }
}