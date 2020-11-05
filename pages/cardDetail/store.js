import Store from 'herculex'
// import CardObj from './data'


export default new Store({
  connectGlobal: true, // 是否关联global
  state: {
    cardObj: null,
    cardRelativeTarget: null,
    indexCard: null
  },
  getters: {
    balance: (state, getters, global) => global.getIn(['account', 'balance']),
    balanceTitle: (state, getters, global) => global.getIn(['account', 'balanceTitle']),
    ele_cards: (state, getters, global) => global.getIn(['ele_cards']),
    curpage: (state, getters, global) => global.getIn(['pageJson','pages/cardDetail/index'])
  },
  mutations: {
    SET_PAGE: (state, config) => {
      state.cardObj = config
    },
    GET_INDEX_CARD: (state, config) => {
      state.indexCard = config
    },
   /* SET_ICON_LIST: (state, config) => {
      state.cardRelativeTarget = config
    }*/
  },
  actions: {
    setPageList({ commit }, payload) {
      commit('SET_PAGE', payload)
    }     
  }
})
