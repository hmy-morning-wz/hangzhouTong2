
Component({
  /**
   * 组件的属性列表
   */
  props: {
    columnGap: '16rpx'
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: [],
    leftData: [],
    rightData: []
  },

  didMount() {
    this._init();
  },

  didUpdate() {
    this._init();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _init() {
      my.lin = my.lin || {};
      my.lin.renderWaterFlow = (data = [], refresh = false, success) => {
        if (Object.prototype.toString.call(data) !== '[object Array]') {
          console.error('[data]参数类型错误，渲染失败');
          return false;
        }
        // 绑定data，判断data是否为[]
        this.setData({ data });
        if (refresh) {
          this.setData({
            leftData: [],
            rightData: []
          })
        }
        this._select(data, refresh).then(() => {
          success && success();
        }).catch(err => {
          console.error(err);
        });
      };
    },
    _select(data, refresh) {
      //my.createSelectorQuery(...).in is not a function(版本:4.3.1，文件:components/water-flow/index.js，行：53，列：7，变量名：this，源代码：const query = my.createSelectorQuery().in(this);)
      if(!my.canIUse('createSelectorQuery')) {
          return //为了云后端不要报这个js错误，用户端不支持的话就不管他了
      }
      const query = my.createSelectorQuery().in(this);
      this.columnNodes = query.selectAll('#left, #right');
      return new Promise((resolve) => {
        this._render(data, 0, refresh, () => {
          resolve();
        });
      });
    },
    _render(data, i, refresh, success) {
      if ((data.length > i || refresh) && this.data.data.length !== 0) {
        this.columnNodes.boundingClientRect().exec(res => {
          const rects = res[0];
          console.log('rectsrectsrects', rects)
          if (rects && rects[0]) {
            this.setData({
              leftHeight: rects[0].height,
              rightHeight: rects[1].height
            })
            if (this.data.leftHeight <= this.data.rightHeight || refresh) {
              this.data.leftData.push(data[i]);
            } else {
              this.data.rightData.push(data[i]);
            }

            this.setData({
              leftData: this.data.leftData,
              rightData: this.data.rightData
            }, () => {
              this._render(data, ++i, false, success);
            });
          }
        });
      } else {
        success && success();
      }
    },


    toKBDetail(e) {
      console.log('tap/tap', e)
      my.ap.navigateToAlipayPage({
        path: e.currentTarget.dataset && e.currentTarget.dataset.url,
        success: (result) => {

        }
      });
    }
  }
});
