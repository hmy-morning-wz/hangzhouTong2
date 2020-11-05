import store from './store'

import CONFIG from '../services/config';
import api from './server';
import { MAP_URL, SHOP_URL } from '/constant'
import utils from '/utils/common'
let SHOPURL = SHOP_URL// `https://money/.allcitygo.com/shopping//#/goodDetail`; // 测试
// const SHOPURL = `http://money/.allcitygo.com/shopping/#/goodDetail`; // 正式
let MAPURL = MAP_URL// 'https://money/.allcitygo.com/hangzhoutong/#/map';
let startQuery = true;
const createPage = function(options) {
  return Page(store.register(options))
};
const app = getApp();
createPage({
  data: {
    latitude: '',
    longitude: '',
    scale: 16,
    markers: [],
    screening: null,
    isShow: false,
    isShowBusActivity: false,
    selIndex: -1,
    activity_id: '',
    hotArea_activityId: '',
    isNoNear: false,
    bannerList: [],
    selected: [],
    hot_area: {},
    ele_notice: {
      scroll_interval: 6000,
      scroll_indicatorDots: false,
      scroll_isAutoPlay: true
    },
    activityShopList: [],
    localShopList: [],
    labelList: [{
      name: '',
      id: ''
    }],
    pageNum: 1,
    pageSize: 10,
    params: {},
    setting: {
      showScale: 0,
      showCompass: 0
    },
    isScrollApi: true,
    activityType: '',
    userId: app.globalData.userId
  }
  ,
  async onLoad() {
      
    this.getQzCategoryList()
    let _this = this;
    //let res = await app. getPageJSON('pages/siteActivity/siteActivity');
    await this.dispatch('$global:getPageJSON','pages/siteActivity/siteActivity')
    let res = this.data.$getters.curpage || {}
    let { page_title, nearby_site, hot_area, banner, banner_config, goodsDetailUrl, mapUrl } = res;
    let { location } = nearby_site || {};
    const userId =app.globalData.userId// my.getStorageSync({ key: 'alipayId' }).data;
    let hotArea_activityId = hot_area.acitvity_list[0].acitvity_id;
    if (goodsDetailUrl) {
      SHOPURL = goodsDetailUrl;
    }
    if (mapUrl) {
      MAPURL = mapUrl;
    }
    _this.setData({
      bannerList: banner,
      hot_area,
      hotArea_activityId,
      ele_notice: banner_config,
      latitude: location &&location.latitude,
      longitude: location && location.longitude
    });
    my.setNavigationBar({
      title: page_title
    });
    if (nearby_site && nearby_site.activity_id) {
      my.getLocation({
        success(res) {
          _this.setData({
            longitude: res.longitude,
            latitude: res.latitude
          });
          _this.getDataList({
            latitude: res.latitude,
            longitude: res.longitude
          });
          _this.getNearActivity(nearby_site, res, userId);
        },
        fail() {
          if (location) {
            const address = {
              latitude: location.latitude,
              longitude: location.longitude
            }
            _this.getDataList(address);
            _this.getNearActivity(nearby_site, address, userId);
          }
          my.hideLoading();
        },
      });
    };

    if (hotArea_activityId) {
      my.getLocation({
        success(res) {
          let params = {
            pageNum: 1,
            pageSize: 10,
            activityId: hotArea_activityId,
            cityCode: app.cityCode,
            userId,
            lat: res.latitude,
            lng: res.longitude
          };
          _this.setData({
            params
          });
          _this.getLocalActivity(params);
        },
        fail() {
          if (location) {
            let params = {
              pageNum: 1,
              pageSize: 10,
              activityId: hotArea_activityId,
              cityCode: app.cityCode,
              userId,
              lat: location.latitude,
              lng: location.longitude
            };
            _this.setData({
              params
            });
            _this.getLocalActivity(params);
          }
        }
      });
    }

    if (nearby_site && !nearby_site.activity_id && hotArea_activityId) {
      _this.setData({
        activity_id: hotArea_activityId,
        isNoNear: true
      })
    }
  },
  // 获取附近热门活动
  getNearActivity(nearby_site, res, userId) {
    let _this = this;
    if (nearby_site && nearby_site.activity_id) {
      // 获取附近站点活动
      const activity_id = nearby_site.activity_id;
      _this.setData({
        activity_id,
        latitude: res.latitude,
        longitude: res.longitude
      });
      api.getNearActivity({
        activityId: activity_id,
        userId,
        lat: res.latitude,
        lng: res.longitude,
        cityCode: app.cityCode
      }).then(data => {
        if (Array.isArray(data)) {
          _this.setData({
            isShowBusActivity: true,
            activityShopList: data
          });
        } else {
          if (_this.data.hotArea_activityId) {
            _this.setData({
              activity_id: _this.data.hotArea_activityId,
              isNoNear: true
            });
          }
        }
      });
    }
  },
  getLocalActivity(config) {
    // 获取本地热门活动
    const _this = this;
    if (startQuery) {
      startQuery = false;
      api.getLocalActivity(config).then(data => {
        startQuery = true;
        let list = data.data;
        if (data.totalSize > _this.data.pageNum * 10) {
          _this.setData({
            localShopList: [..._this.data.localShopList, ...list],
            isScrollApi: true
          });
        } else {
          _this.setData({
            localShopList: [..._this.data.localShopList, ...list],
            isScrollApi: false
          });
        }
      });
    }
  },
  // 本地热门获取活动栏目
  getQzCategoryList(activity_id) {
    api.getQzCategoryList({}).then(data => {
      console.log(data, '哈哈哈哈哈哈哈哈哈')
      if (data.data) {
        this.setData({
          labelList: data.data
        })
        console.log(this.data.labelList)
      }
    });
  },
  scrollToLower() {
    if (this.data.isScrollApi) {
      let index = this.data.pageNum;
      index++;
      this.setData({
        pageNum: index
      });
      let config = {
        ...this.data.params,
        pageNum: index
      }
      this.getLocalActivity(config);
    }
  },
  async getDataList(address) {
    const { success, data } = await CONFIG.getDataList({}, address.latitude, address.longitude)
    if (success) {
      if (data.length > 0) {
        let markers = this.data.markers;
        let addRessList = [];
        data.forEach((item) => {
          let latitude = item.location.split(',')[1];
          let longitude = item.location.split(',')[0];
          addRessList.push(parseFloat(item.distance));
          let o = {
            iconPath: "../images/busStand.png",
            id: 10,
            latitude,
            longitude,
            width: 20,
            height: 20,
            name: item.name,
            distance: item.distance,
            isShow: false,
            children: []
          }
          markers.push(o);
        });
        this.setData({
          markers: markers
        })
      }
    }
  },
  toBanner(e) {
    let msg = e.currentTarget.dataset.msg;
    const { url_type, url_path, text } = msg;
    app.Tracker.click('站点活动-广告位-点击广告跳转-' + text);
    app.handleNavigate({ url_type, url_path });
  },
  toLookCity() {
    const { userId, activity_id, latitude, longitude, isNoNear } = this.data;
    app.Tracker.click('站点活动-附近站点活动-查看全城活动');
    app.handleNavigate({ url_type: 'selfWebview', url_path: utils.makeUrl(MAPURL, { lat: latitude, lng: longitude, activityId: activity_id, userId, cityCode: app.cityCode, bizScenario: app.cityName }) })// `${MAPURL}?userId=${userId}&cityCode=${app.cityCode}&activityId=${activity_id}&lat=${latitude}&lng=${longitude}&isNoNear=${isNoNear}&bizScenario=${app.cityName}`});
  },
  toActivityShop(e) {
    let msg = e.currentTarget.dataset.msg;
    app.Tracker.click(`站点活动-附近站点活动-${msg.skuName}`)
    const { userId } = this.data
    app.handleNavigate({ url_type: 'selfWebview', url_path: utils.makeUrl(SHOPURL, { userId, goodsId: msg.goodsId, bizScenario: app.cityName }) })// `${SHOPURL}?userId=${this.data.userId}&goodsId=${msg.goodsId}&bizScenario=${app.cityName}`});
  },
  toHotShop(e) {
    let msg = e.currentTarget.dataset.msg;
    console.log(e.currentTarget.dataset)
    app.Tracker.click(`站点活动-本地站点活动-${msg.skuName}`);
    const { userId } = this.data
    app.handleNavigate({ url_type: 'selfWebview', url_path: utils.makeUrl(SHOPURL, { userId, goodsId: msg.goodsId, bizScenario: app.cityName }) })// `${SHOPURL}?userId=${this.data.userId}&goodsId=${msg.goodsId}&bizScenario=${app.cityName}`});
  },
  show() {
    app.Tracker.click('站点活动-筛选-显示筛选框');
    this.setData({
      isShow: true
    })
  },
  hide() {
    app.Tracker.click('站点活动-筛选-隐藏筛选框');
    this.setData({
      isShow: false
    })
  },
  qrScreening() {
    app.Tracker.click('站点活动-筛选-确认筛选');
    this.setData({
      pageNum: 1,
      localShopList: []
    });
    let config = {};
    if (this.data.activityType) {
      config = {
        ...this.data.params,
        labelName: this.data.activityType
      }
    } else {
      config = this.data.params;
    }
    this.getLocalActivity(config);
    this.hide();
  },
  handleShopType(event) {
    this.setData({
      pageNum: 1,
      localShopList: []
    });
    const id = event.target.targetDataset.id;
    const index = this.data.selected.indexOf(id);
    let labelList = this.data.labelList;
    let selected = this.data.selected;
    if (index < 0) {
      selected.push(id);
      labelList.forEach((item) => {
        if (item.id === id) {
          item.type = true;
        }
      })
    } else {
      selected.splice(index, 1);
      labelList.forEach((item) => {
        if (item.id === id) {
          item.type = false;
        }
      })
    }
    this.setData({
      labelList: labelList,
      selected: selected
    })
    let config = {};
    config = {
      ...this.data.params,
      categoryIdList: selected
    }
    this.getLocalActivity(config);
  },
  setShopType(e) {
    console.log(e)
    app.Tracker.click('站点活动-筛选-选择标签类型');
    let msg = '杭州亲子'
    if (this.data.selIndex === -1) {
      this.setData({
        selIndex: 0,
        activityType: msg
      })
    } else {
      this.setData({
        selIndex: -1,
        activityType: ''
      })
    }
  }
});
