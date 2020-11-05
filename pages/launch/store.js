import Store from 'herculex';

export default new Store({
  connectGlobal: true, // 是否关联global
  state: {
  },
   getters: {
      curpage: (state, getters, global) => global.getIn(['pageJson','pages/launch/index'])
   },
  mutations: {
  },
  actions: {
  }
});
