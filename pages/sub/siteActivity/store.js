//import Store from 'herculex'
let Store = getApp().herculex

export default new Store({
  connectGlobal: true, // 是否关联global
  state: {

  },
  getters: {
  curpage: (state, getters, global) => global.getIn(['pageJson','pages/siteActivity/siteActivity']),
  },
  mutations: {

  },
  actions: {


  }
})
