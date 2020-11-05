//import busService from '/pages/card/service/busService';
import { autoErrorPage, autoMiniErrorPage } from '/pages/card/utils/ErrorHandler';
    const app = getApp()
    let busService = getApp().busService
Page({
  data: {
    value: '',
    lines: [],
    sourceData: [],
    cancelStyle: 'search-cancel_hidden',
    searchStyle: 'search-input_1',
  },
    async onLoad(option) {
      
  },
  onShow() {
    busService.getConfig('ioc.ebuscard.city.lines').then(({data}) => {
      console.log('>>> 开通线路信息: ', data);
      this.setData({
        lines: data.list,
        sourceData: data.list,
        value: ''
      });
    });
  },

  search(value) {    
    if (value !== this.data.value) {
      const test = (word) => {
        return word.toString().indexOf(value) >= 0;
      };
      const lines = this.data.sourceData.filter((line) => {
        return value === null || value === '' || test(line.no) || test(line.from) || test(line.to);
      });

      this.setData({ value, lines });
    }
  },

  handleInput(value) {    
    this.search(value);
  },
  handleClear(value) {
    this.search(value);
  },
  handleFocus() {},
  handleBlur() {},
  handleCancel() {
    this.search('');
  },
  handleSubmit(value) {
   this.search(value);
  },
});
