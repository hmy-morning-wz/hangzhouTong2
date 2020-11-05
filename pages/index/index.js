
import store from './store'
import { jumpToBusCode } from '../../components/card-component/utils'
var plugin = null//my.canIUse('plugin') && requirePlugin("adFeedsPlugin");
const timeEn = false
const app = getApp()
const createPage = function (options) {
  return Page(store.register(options))
};
createPage({
  data: {
    isLoading: true,
    showGuidance: false,
    permission:false,
    permissionHasLoad:false,
    onLoadReady: false,
    cardIndex: 0,    
    curpage: {},   
    indicatorDots: true,
    autoplay: false,
    vertical: false,
    interval: 1000,
    circular: false,
    busCardNum:1,
    //busCardNum: extJson.cardList && extJson.cardList.length,
    hasMoveDistance: 0,
    // guidanceDesc: {
    //   welfareDesc: "是打个电话广东省公司的还是hjjg身",
    //   praiseDesc: "是打个电话广东省公司的的换个地方换个地方身",
    //   healthGoldDesc: "是打个电话广东省公司的sdgsdg身",
    // },
    healthGoldtyle: "",
    welfareStyle: "",
    thirdStyle: "",
    currentTarget: 0,
    hasLocation: false,
    circleRecommendList: [],
    hasMore: false,
    pageNum: 1,
    reachBottonReady: true,
    ad_tiny:null,
    pluginIsReady:false
    //showGuidance:true,
    //draw:"ON",
    //tagMatch:true,
    //drawText:"领取乘车红包 立减1元",
    //resourceId: "ad_tiny_2018090361288261_202008192200003492" // 厦门公交 ad_tiny_2019032263641200_202008192200003508 

  },
  onReady() {
    console.debug('onReady')
  },
  getCardIndex() {
    let cardIndex = 0
    if (app.type && 'month' === app.type) {
      cardIndex = 1
    }
    return cardIndex
  },
  async onLoad(query) {
    // 移到store.ts action: pageOnLoad 里面去了 
    //const userId = await getApp().loadUserId();
    //this.dispatch("getThisWeekSign", userId)
    my.showNavigationBarLoading()  
    await app.globalData.reday()
    const { extJson ,publicId} = app.globalData  
   // let card_type =  app.cardList && app.cardList.length && app.cardList[0].cardType 
    let busCardNum =  extJson && extJson.cardList && extJson.cardList.length
    let cardIndex = 0
    if (app.type && 'month' === app.type) {
      cardIndex = 1
    }
    await this.dispatch("pageOnLoad")
    let { adTinyBanner}  = this.data
    let ad_tiny = extJson.ad_tiny
    if(adTinyBanner ) {
        if(adTinyBanner.sw != "ON" ) {
          ad_tiny = ""
        }else {
          ad_tiny = adTinyBanner.ad_tiny  || ad_tiny
        }
    }
    this.setData({
      ad_tiny:ad_tiny,
      publicId,
      busCardNum,
      //card_type,
      isLoading: false, onLoadReady: true, cardIndex, query,
      card_type: app.cardList && app.cardList.length > cardIndex && app.cardList[cardIndex].cardType
    }, () => {
      my.hideNavigationBarLoading()
      this.data.page_title && my.setNavigationBar({
        title: this.data.page_title
      })
      this.loadPlugin()
    })

    if (!this.data.humantohuman && !this.data.health) {
      await this.getCircleRecommendList()
    } else {
      this.getCircleRecommendList()
    }
    console.log("circleRecommendList===",this.data.circleRecommendList)
    // 判断是否缓存新手引导
    /*
    let guidanceRes = my.getStorageSync({ key: 'showGuidance' });
    console.log("showGuidance====", guidanceRes)
    console.log("permission====", this.data.permission)
    if (guidanceRes.data === true) {
      console.log("guidanceRes====", guidanceRes)
      this.setData({
        showGuidance: false
      })
    } else {
       console.log("guidanceRes2====", guidanceRes)
      this.setData({
        showGuidance: true
      })
     
    }*/
 

  },

  loadPlugin(){
     let {adFeedsPlugin,adFeedsPluginSet} = this.data
     if(adFeedsPlugin && adFeedsPluginSet &&adFeedsPluginSet.resourceId ) {
      my.canIUse('plugin.dynamic') &&  my.loadPlugin  && my.loadPlugin({
      plugin: '2021001154677005@*', // 指定要加载的插件id和版本号，为*则每次拉取最新版本
      success: () => {
        plugin  = requirePlugin('dynamic-plugin://2021001154677005');
        //plugin.helloApi(); // 调用插件api
        console.log("loadPlugin success")
        this.setData({ pluginIsReady: true }); // 插件已加载，可以渲染插件组件了
      },
    });
    }
  },

  getCircleRecommendList() {
   let { circleRecommendItem }  = this.data
   if(circleRecommendItem) {
    return new Promise((resolve, reject) => {
      my.getSetting({
        success: (res) => {
          console.log('authSetting====', res)
          if (res.authSetting && res.authSetting.location) {
            this.setData({
              hasLocation: true
            })
            this.ifGetLocation(resolve, reject)
          } else {
            this.setData({
              hasLocation: false
            })
            this.ifNotLocation(resolve, reject)
          }
        }
      })
    })
  }else {
    return Promise.resolve({})
  }
  },


  async onShow() {
    console.log('onShow')
    let { onLoadReady } = this.data
    if (onLoadReady) {
      this.dispatch("getCardInfo")
      this.dispatch("getThisWeekSign")
      this.data.page_title && my.setNavigationBar({
        title: this.data.page_title
      })
    }
  },

  cardSwiperChange(e) {
    let { detail: { current } } = e
    this.setData({ cardIndex: current })
  },


  onCardmark() {
    console.log('onCardmark')
    let cardList = app.cardList
    let url = this.data.cardMark[cardList[0].cardType].markUrl
    if (url) app.handleNavigate({ url_type: 'selfWebview', url_path: url })
  },









  //
  bigAddClick(e) {


    app.handleIconClick(e);

  },

onModalClickClose() {
  this.setData({modalOpened:false})
},


  //卡详情
  cardDetail(e) {
    let { index, obj } = e.currentTarget.dataset;
    console.log('跳转卡详情', e, obj)
    let { cardType, cardNo, status } = obj
    let { cardIndex, busCardNum } = this.data
    if (busCardNum > 1 && cardIndex != index) {
      this.disableScroll = true
      setTimeout(() => {
        this.setData({
          cardIndex: index
        })
        this.claerCardScrollData()
      }, 100)
      return
    }
    cardType = cardType || app.cardType

    if (!status || status === 'noReceive') {
      console.log('未领卡')
      this.handleApply(cardType)
      this.$mtr_click(`首页-去领卡-${cardType}`, { index: e.currentTarget.dataset.index || 0, group: e.currentTarget.dataset.group || "-" })
      return
    }
    this.$mtr_click(`首页-跳转卡详情-${cardType}`, { index: e.currentTarget.dataset.index || 0, group: e.currentTarget.dataset.group || "-" })
    {
      const fastApplyCitys = ['M0331000', 'T0330381', 'T0360900', 'M0441800']//通卡一体化开卡 列表
      let cards = getApp().cardList
      let card = cards.filter(t => { return (cardType === t.cardType) })
      if (card && card.length && card[0].cardDetail && card[0].cardDetail.indexOf("://") > -1) {//my:// or https://
        app.handleNavigate({ url: card[0].cardDetail })
      } else {
        if (cardType == 'T0410100' || cardType == 'T0620100') {//郑州 //兰州 支付宝
          my.ap.navigateToAlipayPage({
            path: 'https://render.alipay.com/p/s/activate-card/www/cardDetail.html?cardType=' + cardType,
            success: (result) => {

            }
          });
        }
        else if (fastApplyCitys.indexOf(cardType) > -1) {//台州 //瑞安  通卡一体化开卡  宜春客运 T0360900 清远 M0441800
          my.ap.navigateToAlipayPage({
            path: 'alipays://platformapi/startapp?appId=77700120&page=pages%2Findex%2Findex%3FcardType%3D' + cardType + '%26cardNo%3D' + cardNo,
            success: (result) => {

            }
          });
        }
        else if (cardType == 'T2330100') {//   杭州月卡
          app.handleNavigate({ url: 'my://startapp?appId=20000067&param=%7B%22url%22%3A%22https%3A%2F%2Fgjyp.96225.com%2FqrCodeMTichet%2FhasMoney.html%22%7D%20%20' })
        } else {
          app.handleNavigate({ url_type: 'self', url_path: `/pages/cardDetail/index?cardType=${cardType}` })
        }
      }
    }/* else {
      console.warn('跳转卡详情未配置跳转默认地址')
      app.handleNavigate({ url_type: 'self', url_path: `/pages/cardDetail/index?cardType=${cardType}` })
    }*/

  },


  handleApply(cardType) {
    jumpToBusCode(cardType);
  },

  onSubmit(e) {
    app.onSubmit(e)
  },
  riding(e) {
    console.log('------去乘车', e)
    //"formId": e.detail.formId,
    console.log("formId", e.detail.formId)
    /*let obj = e.currentTarget.dataset.obj;
    let cardType = obj.cardType  */
    let { cardIndex, eleCards } = this.data
    let { cardType } = eleCards[cardIndex] || {}
    cardType = cardType || app.cardType
    this.$mtr_click(`首页-去乘车-${cardType}`, { index: e.currentTarget.dataset.index || 0, group: e.currentTarget.dataset.group || "-" })
    jumpToBusCode(cardType)
  },

  async drawTap(e) {
    let {activityId} = this.data
   
    await this.dispatch('$service:getPrize',{activityId}) 
    setTimeout(() => {   
     let {prizeId:prizeName,success} = this.data.prizeResult || {}
     if(!success || !prizeName) {
        my.showToast({content:"系统开小差了，请稍后再试"})       
     }else {
      this.onFinish({ prizeName ,success})
     }
    }, 100)
  },
  onFinish({prizeName,success}) { 
    //let {remainLotteryNumber} = this.data
    this.setData({ 
      tipText: `抽奖结果：${prizeName}`,
      remainLotteryNumber:0// remainLotteryNumber>0?remainLotteryNumber-1 : 0
    });
    if (success) {   
       this.setData({            
          modalOpened: true,
        })
    }
    let {activityId} = this.data
    this.dispatch('$service:getZZLotteryMsg',{activityId}) 
  },

  activityTap(e) {
    //handleNavigate
    app.handleIconClick(e);


  },


  onCatchTap() { },


  noticeClick(e) {

    app.handleIconClick(e);


  },
  superClick(e) {
    app.handleIconClick(e);

  },


  popupWindowClick(e) {
    this.setData({ modalOpened: false }, () => {
      app.handleIconClick(e)
    })

  },
  popupImageOnload() {
    let { popup } = this.data
    popup.imageLoad = true
    popup.showClose = true
    popup.hiddenButton = false
    this.setData({ popup: popup })
  },

  onPopupClose2() {
    this.setData({
      showBottom: false,
    });
  },

  onAppear(e) {

  },
  onStartExperience() {
    console.log("e: 关闭新手引导")
    let that = this
     my.setStorageSync({
        key: 'showGuidance',
        data: true
      });
    let {circleRecommendItem} = this.data  
    if(circleRecommendItem) {
    my.getSetting({
      success: (res) => {
        console.log('authSetting', res)
        if (res.authSetting && res.authSetting.location) {
          my.pageScrollTo({ scrollTop: 0, duration: 300 })
        } else {
          my.pageScrollTo({ scrollTop: 0, duration: 300 })
          if (this.data.circleRecommendItem) {
            new Promise((resolve, reject) => {
              this.ifGetLocation(resolve, reject)
            })

          }

        }
      }
    })
  }

  },

  // 获取定位
  // getLocation() {

  //   return new Promise((resolve, reject) => {
  //     my.showLoading();
  //     my.getLocation({
  //       success(res) {
  //         my.hideLoading();
  //         app.Tracker.click(`获取定位成功-latitude:${res.latitude}-longitude:${res.longitude}`)
  //         return resolve(res);
  //       },
  //       fail() {
  //         my.hideLoading();
  //         app.Tracker.click(`获取定位失败`)
  //         return reject();
  //       },
  //     })
  //   });


  // },

  onThridGuidance(resolve, reject) {
    let that = this
    // my.pageScrollTo({ scrollTop: 0 })

    my.createSelectorQuery()
      .select('#recommendTitle').boundingClientRect()
      .exec((ret) => {
        console.log("ret===", ret);
         //Cannot read property 'top' of null(版本:4.3.1，文件:pages/index/index.js，行：393，列：9，变量名：top，源代码：let top = ret[0].top this.data.hasMoveDistance)
        if(!ret.length) {
          return //为了云后端不要报这个js错误，length=0话就不管他了
        }
        console.log("hasMoveDistance===", this.data.hasMoveDistance);
        let top = ret[0].top + this.data.hasMoveDistance
        let systemInfo = my.getSystemInfoSync()
        console.log("systemInfo====", systemInfo)
        let windowHeight = systemInfo.windowHeight + 48
        let windowWidth = systemInfo.windowWidth
        let statusBarHeight = systemInfo.statusBarHeight
        let bottomDistance = windowHeight - top
        console.log("bottomDistance===", bottomDistance)
        let height
        if (that.data.hasLocation) {
          height = 644 * windowWidth / 750
        } else {
          height = 724 * windowWidth / 750
        }

        if (bottomDistance < height) {
          let moveDistance = height - bottomDistance
          console.log("moveDistance3====", moveDistance)
          setTimeout(() => {
            my.pageScrollTo({ scrollTop: moveDistance, duration: 200 })
          }, 200);
          

          // let mt = top- moveDistance -25
          let mt
          if (that.data.hasLocation) {
            mt = top - moveDistance - 79 * windowWidth / 750
          } else {
            mt = top - moveDistance - 79 * windowWidth / 750
          }
          let thirdStyle = `margin-top: ${mt}px;`
          console.log("thirdStyle===", thirdStyle)
          that.setData({
            thirdStyle: thirdStyle,
            hasMoveDistance: moveDistance
          })

        } else {
          let thirdStyle = `margin-top: ${(top - 79 * windowWidth / 750)}px;`
          console.log("thirdStyle===", thirdStyle)
          this.setData({
            thirdStyle: thirdStyle
          })
        }
        resolve()
      })


  },

  onFirstGuidance(resolve, reject) {
    my.createSelectorQuery()
      .select('#humantohuman').boundingClientRect()
      .exec((ret) => {
        console.log("ret===", ret);
        //Cannot read property 'top' of null(版本:4.3.1，文件:pages/index/index.js，行：393，列：9，变量名：top，源代码：let top = ret[0].top this.data.hasMoveDistance)
        if(!ret.length) {
          return //为了云后端不要报这个js错误，length=0话就不管他了
        }
        let top = ret[0].top + this.data.hasMoveDistance
        let systemInfo = my.getSystemInfoSync()
        console.log("systemInfo===", systemInfo)
        let windowHeight = systemInfo.windowHeight + 48
        let windowWidth = systemInfo.windowWidth
        let statusBarHeight = systemInfo.statusBarHeight
        let titleBarHeight = systemInfo.titleBarHeight
        let bottomDistance = windowHeight - top
        let height = 678 * windowWidth / 750
        console.log("bottomDistance===", bottomDistance)
        console.log("height===", height)
        if (bottomDistance < height) {
          let moveDistance = height - bottomDistance
          console.log("moveDistance===", moveDistance)
          my.pageScrollTo({ scrollTop: moveDistance, duration: 200 })
          let mt = top - moveDistance - 101 * windowWidth / 750
          let welfareStyle = `margin-top: ${mt}px;`
          console.log("welfareStyle:", welfareStyle)
          this.setData({
            welfareStyle: welfareStyle,
            hasMoveDistance: moveDistance
          })
        } else {
          let welfareStyle = `margin-top: ${(top - 101 * windowWidth / 750)}px;`
          console.log("welfareStyle===", welfareStyle)
          this.setData({
            welfareStyle: welfareStyle
          })
        }
        resolve()

      })
  },

  onSecondGuidance(resolve, reject) {
    // my.pageScrollTo({ scrollTop: 0 })

    my.createSelectorQuery()
      .select('#healthgold').boundingClientRect()
      .exec((ret) => {
        console.log("ret===", ret);
         //Cannot read property 'top' of null(版本:4.3.1，文件:pages/index/index.js，行：393，列：9，变量名：top，源代码：let top = ret[0].top this.data.hasMoveDistance)
        if(!ret.length) {
          return //为了云后端不要报这个js错误，length=0话就不管他了
        }
        let top = ret[0].top + this.data.hasMoveDistance
        let systemInfo = my.getSystemInfoSync()
        console.log("systemInfo===", systemInfo)
        let windowHeight = systemInfo.windowHeight + 48
        let windowWidth = systemInfo.windowWidth
        let screenHeight = systemInfo.screenHeight
        let statusBarHeight = systemInfo.statusBarHeight
        let bottomDistance = windowHeight - top
        let height = 320 * windowWidth / 750
        console.log("bottomDistance===", bottomDistance)
        console.log("height===", height)
        if (bottomDistance < height) {
          let moveDistance = height - bottomDistance
          console.log("moveDistance===", moveDistance)
          setTimeout(() => {
            my.pageScrollTo({ scrollTop: moveDistance, duration: 200 })
          }, 200);
          
          let mt = top - moveDistance - 450 * windowWidth / 750
          console.log("mt====", mt)
          let healthGoldtyle = `margin-top: ${mt}px;`
          console.log("healthGoldtyle===", healthGoldtyle)
          this.setData({
            healthGoldtyle: healthGoldtyle,
            hasMoveDistance: moveDistance
            // 'guidanceDesc.healthGoldDesc':"sdfgdsgdsgsdg"
          })
        } else {
          let healthGoldtyle = `margin-top: ${top - 450 * windowWidth / 750}px;`
          console.log("healthGoldtyle===", healthGoldtyle)
          this.setData({
            healthGoldtyle: healthGoldtyle,

          })
        }
        resolve()
      })


  },

  swiperChange(e) {
    let { detail: { current } } = e;
    this.setData({
      currentTarget: current
    });
  },

  ifGetLocation(resolve, reject) {
    console.log('getlocation')
    let that = this
    my.getLocation({
      success(res) {
        app.Tracker.click(`获取定位成功-latitude:${res.latitude}-longitude:${res.longitude}`)
        console.log('location===>', res)
        that.setData({
          hasLocation: true
        })
        let appId = that.data.circleRecommend && that.data.circleRecommend.appId
        //Uncaught TypeError: my.openRpc is not a function(版本:4.4.1，文件:pages/index/index.js，行：502，列：9，变量名：openRpc，源代码：my.openRpc({//发起openRpc调用)
        //为了云后端不要报这个js错误，用户端不支持的话就不管他了
        my.openRpc && my.openRpc({//发起openRpc调用
          operationType: 'com.alipay.openapi.jsapi.standard.invoke',//设置operationType，固定值
          requestData: [
            {
              "appId": appId,
              "method": "my.circleRecommendItem",
              "bizContent": {
                "dataSetId": "alipay_tongkaliancheng",
                "longitude": res.longitude,
                "latitude": res.latitude,
                "start": 0,
                "pageSize": 10
              }
            }
          ],//设置请求参数
          headers: {},//设置header
          getResponse: false,
          success: (data) => {
            console.log('successcircleRecommendItem1', data.recommendItem)
            that.setData({
              circleRecommendList: data.recommendItem || [],
              hasMore: data.hasMore
            }, () => {
              my.lin && my.lin.renderWaterFlow(that.data.circleRecommendList, true, () => {
              })
            })
            resolve()
          },
          fail: (data) => {
            console.log('failcircleRecommendItem', JSON.stringify(data))
            that.setData({
              circleRecommendList: [],
              hasMore: false
            })
            reject()
          }
        });
      },
      fail() {
        // my.alert({ title: '定位失败' });
        app.Tracker.click(`获取定位失败`)
        that.ifNotLocation(resolve, reject)

      },
    })
  },
  ifNotLocation(resolve, reject) {
    console.log('circleRecommend===', this.data.circleRecommend)
    let { appId, latitude, longitude } = this.data.circleRecommend
    if( latitude && longitude ) {
       //Uncaught TypeError: my.openRpc is not a function(版本:4.4.1，文件:pages/index/index.js，行：502，列：9，变量名：openRpc，源代码：my.openRpc({//发起openRpc调用)
        //为了云后端不要报这个js错误，用户端不支持的话就不管他了
     my.openRpc && my.openRpc({//发起openRpc调用
        operationType: 'com.alipay.openapi.jsapi.standard.invoke',//设置operationType，固定值
        requestData: [
          {
            "appId": appId,
            "method": "my.circleRecommendItem",
            "bizContent": {
              "dataSetId": "alipay_tongkaliancheng",
              "longitude": longitude,
              "latitude": latitude,
              "start": 0,
              "pageSize": 10
            }
          }
      ],//设置请求参数
      headers: {},//设置header
      getResponse: false,
      success: (data) => {
        console.log('successcircleRecommendItem1', data.recommendItem)
        this.setData({
          circleRecommendList: data.recommendItem || [],
          hasMore: data.hasMore
        }, () => {
          my.lin&&my.lin.renderWaterFlow(this.data.circleRecommendList, true, () => {
          })
        })
        resolve()
      },
      fail: (data) => {
        console.log('failcircleRecommendItem', JSON.stringify(data))
        this.setData({
          circleRecommendList: [],
          hasMore: false
        })
        reject()
      }
    });
  }
  },

  onCardScroll(e) {
    console.log(e)
    let { timeStamp, detail: { scrollLeft, scrollTop, scrollHeight, scrollWidth } } = e
    this.scrolltimeStamp = timeStamp
    if (this.disableScroll)  //TouchEnd 之后 不要scrollLeft了
    {
      return
    }
    if ((!this.scrollLeft) || Math.abs(this.scrollLeft - scrollLeft) > 1) {
      if (this.scrollLeft) {
        this.detalScroll = scrollLeft - this.scrollLeft
      }
      this.scrollLeft = scrollLeft
    }


  },
  claerCardScrollData() {
    console.log("claerCardScrollData")
    this.scrollLeft = 0
    this.detalScroll = undefined
    this.scrolltimeStamp = 0
    this.disableScroll = false
  }
  , onCardTouchEnd(e) {
    console.log("onCardTouchEnd detalScroll", this.detalScroll)
    let { busCardNum } = this.data
    if (this.detalScroll != undefined && busCardNum >= 2 && this.scrolltimeStamp) {
      this.disableScroll = true
      setTimeout(() => {
        if (Date.now() - this.scrolltimeStamp > 100) {   //判断不再滑动了  
          if (this.detalScroll > 0)
            this.setData({ cardIndex: 1 })
          else
            this.setData({ cardIndex: 0 })
          this.claerCardScrollData()
        } else {
          this.onCardTouchEnd()
        }
      }, 100)
    } else {
      console.log("onCardTouchEnd false", this.detalScroll, busCardNum, this.scrolltimeStamp)
    }

  },


  onReachBottom() {
    console.log('onReachBottom====>');
    let { circleRecommendItem, adFeedsPlugin } = this.data
   
    if (circleRecommendItem) { // 口碑生活区
      if (this.data.hasMore && this.data.hasLocation) {
        if (!this.data.reachBottonReady) {
          return
        }
        this.setData({
          reachBottonReady: false
        })
        let that = this
        my.getLocation({
          success(res) {
            that.setData({
              hasLocation: true
            })
            let appId = that.data.circleRecommend && that.data.circleRecommend.appId
            //Uncaught TypeError: my.openRpc is not a function(版本:4.4.1，文件:pages/index/index.js，行：502，列：9，变量名：openRpc，源代码：my.openRpc({//发起openRpc调用)
            //为了云后端不要报这个js错误，用户端不支持的话就不管他了
            my.openRpc && my.openRpc({//发起openRpc调用
              operationType: 'com.alipay.openapi.jsapi.standard.invoke',//设置operationType，固定值
              requestData: [
                {
                  "appId": appId,
                  "method": "my.circleRecommendItem",
                  "bizContent": {
                    "dataSetId": "alipay_tongkaliancheng",
                    "longitude": res.longitude,
                    "latitude": res.latitude,
                    "start": that.data.pageNum * 10 + 1,
                    "pageSize": 10
                  }
                }
              ],//设置请求参数
              headers: {},//设置header
              getResponse: false,
              success: (data) => {
                console.log('successcircleRecommendItem1', data, data.recommendItem)
                that.setData({
                  hasMore: data.hasMore,
                  pageNum: that.data.pageNum + 1,
                  reachBottonReady: true
                }, () => {
                  if (data.recommendItem) {
                    my.lin && my.lin.renderWaterFlow(data.recommendItem, false, () => {
                    })
                  }
                })
              },
              fail: (data) => {
                console.log('failcircleRecommendItem', JSON.stringify(data))
                that.setData({
                  hasMore: false
                })
              }
            });
          },
          fail() {
            console.log('定位失败')
          },
        })
      }
    }else if (adFeedsPlugin && plugin && plugin.loadMore) {// 灯火广告Feeds 
      plugin.loadMore();    
      console.log('灯火广告Feeds loadMore') 
    }
  },

onModalClick() {
    this.setData({
      modalOpened: false,
    });
  },
  onCloseTap() { 
      this.setData({showGuidance:false})

  },
  actionClick() { },
  linkActionClick() { },
  onModalClose() {
    this.setData({
      modalOpened: false,
    });
  },
  onTapNotice(){
    console.log("onTapNotice")
    my.pageScrollTo({scrollTop:0})
    this.setData({showGuidance:true})
  },
  activityTap(e) {    
    app.handleIconClick(e);

  },
   openVoucherListTap(e) {    
    my.openVoucherList();

  },
  onLinkCouponsTap(e) {
    console.log(e)
   // let {currentTarget:{dataset:{obj}} }= e
    app.handleIconClick(e);
        this.setData({   modalOpened: false})
  },
  onPrizeResultTap1(e) {
     console.log(e)
    let {currentTarget:{dataset:{obj}} }= e
    let action = obj&&obj.button1Action 
    if(action=='BusQrcode') {
      this.setData({   modalOpened: false})
      //@ts-ignore
       jumpToBusCode(getApp().cardType)
    }else if(action=='Guidance') {
       my.pageScrollTo({scrollTop:0})
     this.setData({showGuidance:true,    modalOpened: false})
    } 
  
  },
  onPrizeResultTap2(e) {
    console.log(e)
    let {currentTarget:{dataset:{obj}} }= e
    let action = obj&&obj.button2Action 
     if(action=='BusQrcode') {
      this.setData({   modalOpened: false})
        //@ts-ignore
      jumpToBusCode(getApp().cardType)
    }else if(action=='Guidance') {
       my.pageScrollTo({scrollTop:0})
     this.setData({showGuidance:true,    modalOpened: false})
    } 
  }


});
