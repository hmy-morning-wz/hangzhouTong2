#配置模板
### 测试环境
~~~
{
  "extEnable": true,
  "ext": {
    "env":"sit",
      "apiHost":{
       "ech5":"https://ech5.allcitygo.com",
       "webtrack":"https://sit-webtrack-api.allcitygo.com/event/upload"
    },
    "cityInfo": {
    "appid": "2019031163539131",
    "title":  "杭州通",
    "cityName": "杭州",
    "cityCode":  "330100"
    },  
    "cardList":[{
       "cardType": "T0330100",
       "balanceMode":"NORMAL"     
    },{
       "cardType": "T2330100",
       "balanceMode":"NONE",
       "cardDetail":"my://startapp?appId=20000067&param=%7B%22url%22%3A%22https%3A%2F%2Fgjyp.96225.com%2FqrCodeMTichet%2FhasMoney.html%22%7D%20%20"     
    }],
    "publicId":"2018052160219015",
    "pageJson": [
      {
        "pageUrl": "pages/index/index",
        "locationId": "index4",
        "locationName": "首页",
        "templateId": "61"
      },     
      {
        "pageUrl": "pages/me/me",
        "locationId": "my",
        "locationName": "我的",
        "templateId": "8"
      },
      {
        "pageUrl": "pages/siteActivity/siteActivity",
        "locationId": "siteActivity",
        "locationName": "附近站点",
        "templateId": "47"
      },   
       {
      "pageUrl": "pages/cardDetail/index",
      "locationId": "cardDetail",
      "locationName": "卡详情",
      "templateId": "51"
    },         
      {
        "pageUrl": "pages/icon/index",
        "locationId": "icon",
        "locationName": "全部服务",
        "templateId": "54" 
      }
    ]
  }
}
~~~
### 生产环境
~~~
{
  "extEnable": true,
  "ext": {
    "env":"prd",
      "apiHost":{    
    },
    "cityInfo": {
    "appid": "2019031163539131",
    "title":  "杭州通",
    "cityName": "杭州",
    "cityCode":  "330100"
    },  
    "cardList":[{
       "cardType": "T0330100",
       "balanceMode":"NORMAL"     
    },{
       "cardType": "T2330100",
       "balanceMode":"NONE",
       "cardDetail":"my://startapp?appId=20000067&param=%7B%22url%22%3A%22https%3A%2F%2Fgjyp.96225.com%2FqrCodeMTichet%2FhasMoney.html%22%7D%20%20"     
    }],
    "publicId":"2018052160219015",
    "pageJson": [
      {
        "pageUrl": "pages/index/index",
        "locationId": "index4",
        "locationName": "首页",
        "templateId": "20"
      },     
      {
        "pageUrl": "pages/me/me",
        "locationId": "my",
        "locationName": "我的",
        "templateId": "8"
      },
      {
        "pageUrl": "pages/siteActivity/siteActivity",
        "locationId": "site",
        "locationName": "站点生活",
        "templateId": "9"
      },    
      {
        "pageUrl": "pages/cardDetail/index",
        "locationId": "cardDetail",
        "locationName": "卡详情",
        "templateId": "11"
      }, 
      {
        "pageUrl": "pages/icon/index",
        "locationId": "icon",
        "locationName": "全部服务",
        "templateId": "15"        
      }
    ]
  }
}

~~~


###  模板

{
  "extEnable": true,
  "ext": {
     "apiHost":{    
    },
    "cityInfo": {
    "appid": "2019062165635711",
    "title":  "杭州通公交卡",
    "cityName": "通卡联城",
    "cityCode":  "110000"
    },
    "cardList":[],
    "publicId":"2018052160219015",
    "pageJson": [
        {
        "pageUrl": "pages/index/index",
        "locationId": "index4",
        "locationName": "首页",
        "templateId": "20"
      },     
      {
        "pageUrl": "pages/me/me",
        "locationId": "my",
        "locationName": "我的",
        "templateId": "8"
      },
      {
        "pageUrl": "pages/siteActivity/siteActivity",
        "locationId": "site",
        "locationName": "站点生活",
        "templateId": "9"
      },    
      {
        "pageUrl": "pages/cardDetail/index",
        "locationId": "cardDetail",
        "locationName": "卡详情",
        "templateId": "11"
      }, 
      {
        "pageUrl": "pages/icon/index",
        "locationId": "icon",
        "locationName": "全部服务",
        "templateId": "15"        
      }
    ]
  }
}

### 杭州
  "cityInfo": {
    "appid": "2019031163539131",
    "title":  "杭州通",
    "cityName": "杭州",
    "cityCode":  "330100"
    },
    "cardList":[{
       "cardType": "T0330100",
       "balanceMode":"NORMAL"     
    },{
       "cardType": "T2330100",
       "balanceMode":"NONE"     
    }],
   "ad_tiny":"ad_tiny_2019031163539131_201909092200000754",
    "publicId":"2018052160219015",

"env":"sit",
    publicId 生活号 
    ad_tiny 灯火广告
### 中山

  "cityInfo": {
    "appid": "2018090361288261",
    "title":  "中山通",
    "cityName": "中山",
    "cityCode":  "442000"
    },
    "cardList":[{
       "cardType": "T0442000",
       "balanceMode":"NORMAL"     
    }],
  "publicId":"2018052160219015",
### 大同

  "cityInfo": {
    "appid": "2019011863103090",
    "title":  "大同公交",
    "cityName": "大同",
    "cityCode":  "140200"
    },
    "cardList":[{
       "cardType": "T0140200",
       "balanceMode":"NORMAL"     
    }],
  "publicId":"2018052160219015",


生产清远

{"extEnable":true,"ext":{"cityInfo":{"appid":"2019041563863898","title":"清远市民卡","cityName":"清远","cityCode":"441800","cityNamePy":"QingYuan"},"cardList":[{"cardType":"M0441800","balanceMode":"NONE"}],"ad_tiny":"ad_tiny_2019041563863898_226","publicId":"2018052160219015","pageJson":[{"pageUrl":"pages/index/index","locationId":"index","locationName":"首页","templateId":"6"},{"pageUrl":"pages/busStops/busStops","locationId":"bus","locationName":"公交","templateId":"7"},{"pageUrl":"pages/me/me","locationId":"my","locationName":"我的","templateId":"8"},{"pageUrl":"pages/siteActivity/siteActivity","locationId":"site","locationName":"站点生活","templateId":"9"},{"pageUrl":"#/mall","locationId":"mall","locationName":"商城","templateId":"10"},{"pageUrl":"pages/cardDetail/index","locationId":"cardDetail","locationName":"卡详情","templateId":"11"},{"pageUrl":"pages/index/page/changeCard","locationId":"customCard","locationName":"卡面定制","templateId":"12"},{"pageUrl":"pages/benefits/index","locationId":"benefits","locationName":"福利","templateId":"14"},{"pageUrl":"pages/icon/index","locationId":"icon","locationName":"全部服务","templateId":"15"}]}}


// sit 扬州测试卡
https://open.alipay.com/mini/dev/sub/dev-manage?appId=2019040163767035&bundleId=com.alipay.alipaywallet

https://sit-ech5.allcitygo.com/321000/index.htm
//2019040163767035
{"extEnable":true,"ext":{
  "env":"sit",
  "cityInfo":{"appid":"2019040163767035","title":"扬州市民卡","cityName":"扬州","cityCode":"321000","cityNamePy":"YangZhou"},
  "cardList":[{"cardType":"ACTIY002","balanceMode":"NONE"}],"ad_tiny":"ad_tiny_2019041563863898_226","publicId":"2018052160219015",
  "pageJson":[{"pageUrl":"pages/index/index","locationId":"index","locationName":"首页","templateId":"6"},{"pageUrl":"pages/busStops/busStops","locationId":"bus","locationName":"公交","templateId":"7"},{"pageUrl":"pages/me/me","locationId":"my","locationName":"我的","templateId":"8"},{"pageUrl":"pages/siteActivity/siteActivity","locationId":"site","locationName":"站点生活","templateId":"9"},{"pageUrl":"#/mall","locationId":"mall","locationName":"商城","templateId":"10"},{"pageUrl":"pages/cardDetail/index","locationId":"cardDetail","locationName":"卡详情","templateId":"11"},{"pageUrl":"pages/index/page/changeCard","locationId":"customCard","locationName":"卡面定制","templateId":"12"},{"pageUrl":"pages/benefits/index","locationId":"benefits","locationName":"福利","templateId":"55"},{"pageUrl":"pages/icon/index","locationId":"icon","locationName":"全部服务","templateId":"54"}]}}





  郑州测试

  {
  "extEnable": true,
  "ext": {
    "env":"sit",
    "cityInfo": {
      "appid": "2019052365361097",
      "title": "郑州公交",
      "cityName": "郑州",
      "cityCode": "410100",
      "cityNamePy": "ZhengZhou"
    },
    "cardList": [
      {
        "cardType": "T0410100",
        "balanceMode": "ALIPAY"
      }
    ],
    "apiHost":{},
    "ad_tiny": "NONE",
    "publicId": "2018052160219015",
    "pageJson": [
      {
        "pageUrl": "pages/index/index",
        "locationId": "index4",
        "locationName": "首页",
        "templateId": "61"
      },
      {
        "pageUrl": "pages/sub/draw/draw",
        "locationId": "draw",
        "locationName": "首页",
        "templateId": "63"
      },
      {
        "pageUrl": "pages/me/me",
        "locationId": "my",
        "locationName": "我的",
        "templateId": "8"
      },
      {
        "pageUrl": "pages/siteActivity/siteActivity",
        "locationId": "siteActivity",
        "locationName": "附近站点",
        "templateId": "47"
      },
      {
        "pageUrl": "pages/cardDetail/index",
        "locationId": "cardDetail",
        "locationName": "卡详情",
        "templateId": "51"
      },
      {
        "pageUrl": "pages/icon/index",
        "locationId": "icon",
        "locationName": "全部服务",
        "templateId": "54"
      }
    ]
  }
}


兰州

{
  "extEnable": true,
  "ext": {
    "apiHost": {},
    "cityInfo": {
      "appid": "2018121562519951",
      "title": "兰州公交",
      "cityName": "兰州",
      "cityCode": "620100",
      "cityNamePy": "LanZhou"
    },
    "cardList": [
      {
        "cardType": "T0620100",
        "balanceMode": "ALIPAY",
        "cardDetail": "my://alipaypage?path=https%3A%2F%2Frender.alipay.com%2Fp%2Fs%2Factivate-card%2Fwww%2FcardDetail.html%3FcardType%3DT0620100"
      }
    ],
    "ad_tiny": "NONE",
    "publicId": "2018052160219015",
    "pageJson": [
      {
        "pageUrl": "pages/index/index",
        "locationId": "index4",
        "locationName": "首页",
        "templateId": "20"
      },
      {
        "pageUrl": "pages/sub/draw/draw",
        "locationId": "draw",
        "locationName": "运营活动",
        "templateId": "22"
      },
      {
        "pageUrl": "pages/step/index",
        "locationId": "step",
        "locationName": "步数换权益",
        "templateId": "23"
      },
      {
        "pageUrl": "pages/me/me",
        "locationId": "my",
        "locationName": "我的",
        "templateId": "8"
      },
      {
        "pageUrl": "pages/siteActivity/siteActivity",
        "locationId": "site",
        "locationName": "站点生活",
        "templateId": "9"
      },
      {
        "pageUrl": "pages/cardDetail/index",
        "locationId": "cardDetail",
        "locationName": "卡详情",
        "templateId": "11"
      },
      {
        "pageUrl": "pages/icon/index",
        "locationId": "icon",
        "locationName": "全部服务",
        "templateId": "15"
      }
    ]
  }
}