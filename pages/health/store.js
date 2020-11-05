import Store from 'herculex'
import CONFIG from '../../services/healthGold'
export default new Store({
  connectGlobal: true, // 是否关联global
  state: {
    isSiginShow: false,
    list: [],
    couponAmount: 0,
    sumAmount: 0,
    activeIndex: 0,
    size: 0,
    items: [{
      title: '1天',
    }, {
      title: '2天',
    }, {
      title: '3天',
    }, {
      title: '4天',
    }, {
      title: '5天',
    }, {
      title: '6天',
    }, {
      title: '7天',
    }],
  },
  mutations: {
    LIST_DATA: (state, config) => {
      state.list = config
      state.activeIndex = config.thisWeekSignCount;
    },
    COUNPON_AMOUNT: (state, config) => {
      if(config.couponAmount){
        state.isSiginShow = true;
      }
      state.couponAmount = config.couponAmount;
    },
    SUM_AMOUNT: (state, config) => {
      state.sumAmount = config
    },
    CLOSEPOPUP:(state) => {
      state.isSiginShow = false;
    }
  },
  actions: {
    closePopup({commit}){
     commit("CLOSEPOPUP")
    },
    async getThisWeekSign({ commit, state }, payload) {
      const params = {
        userId: payload.success
      }
      const { success, data } = await CONFIG.getThisWeekSign(params)
      if (success) {
        commit('LIST_DATA', JSON.parse(JSON.stringify(data)))
      } else {
        commit('LIST_DATA', [])
      }
    },
    async addSign({ commit, state }, payload) {
      const params = {
        userId: payload.userId.success,
        campId: payload.campId
      }
      const { success, data } = await CONFIG.addSign(params)
      if (success) {
        console.log(88888888)
        commit('COUNPON_AMOUNT', JSON.parse(JSON.stringify(data)))
      } else {
         my.alert({
          content: JSON.stringify('签到失败,请重新点击签到～')
        });
        commit('COUNPON_AMOUNT', '')
      }
    },
    async getSumHeathMoney({ commit, state }, payload) {
      const params = {
        userId: payload.success,
        channel: '健康金'
      }
      const { success, data } = await CONFIG.getSumHeathMoney(params)
      if (success) {
        commit('SUM_AMOUNT', data)
      }
    },
  },
})
